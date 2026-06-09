import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ─── Modelos Gemini con fallback ─────────────────────────────────────────────
const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

// ─── Historial por número ────────────────────────────────────────────────────
const conversaciones = new Map<
  string,
  {
    mensajes: Array<{ role: string; parts: Array<{ text: string }> }>;
    ultimaActividad: number;
  }
>();

const EXPIRACION_MS = 2 * 60 * 60 * 1000;
const MAX_TURNOS = 6;

function obtenerHistorial(telefono: string) {
  const conv = conversaciones.get(telefono);
  if (!conv) return [];
  if (Date.now() - conv.ultimaActividad > EXPIRACION_MS) {
    conversaciones.delete(telefono);
    return [];
  }
  return conv.mensajes.slice(-MAX_TURNOS);
}

function guardarMensajes(
  telefono: string,
  userText: string,
  assistantText: string
) {
  if (!conversaciones.has(telefono)) {
    conversaciones.set(telefono, { mensajes: [], ultimaActividad: Date.now() });
  }
  const conv = conversaciones.get(telefono)!;
  conv.mensajes.push(
    { role: "user", parts: [{ text: userText }] },
    { role: "model", parts: [{ text: assistantText }] }
  );
  conv.ultimaActividad = Date.now();
}

// ─── System prompt ───────────────────────────────────────────────────────────
function getSystemPrompt(): string {
  const ahora = new Date().toLocaleDateString("es-ES", {
    timeZone: "Europe/Madrid",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `Eres asistente de reservas de La Taberna del Sur (Madrid). Hoy: ${ahora}.
RESTAURANTE: C/Gran Via 42 | Tel: 910123456 | L-D 13-16h y 20-23:30h | Precio: 25-35€/pp | Máx 40 personas.
Especialidades: jamón ibérico, gazpacho, carrillada, tortilla, croquetas.
FLUJO (una pregunta a la vez):
1.Saluda y pide nombre+apellido 2.Personas 3.Fecha(resuelve "mañana","el viernes","el 29"→fecha completa) 4.Hora 5.Teléfono 6.Confirma resumen con fecha completa ej:"martes 10 junio".
REGLAS: Respuestas cortas (máx 3 líneas). Tuteo. Hora fuera de rango→ofrece la más cercana. +15 personas→llamen al tel. Alergias→el equipo lo tendrá en cuenta. Cancelar/modificar→pide nombre+tel. Responde en el idioma del cliente.`;
}

// ─── Llamada a Gemini con fallback de modelos ────────────────────────────────
async function geminiCall(
  contents: Array<{ role: string; parts: Array<{ text: string }> }>,
  config: { maxOutputTokens: number; temperature: number },
  systemInstruction?: string
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  for (const model of GEMINI_MODELS) {
    try {
      const body: Record<string, unknown> = {
        contents,
        generationConfig: config,
      };
      if (systemInstruction) {
        body.systemInstruction = { parts: [{ text: systemInstruction }] };
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (
        data?.error?.code === 503 ||
        data?.error?.code === 429 ||
        data?.error?.code === 404
      ) {
        console.warn(`[Gemini] ${model} no disponible (${data.error.code}), probando siguiente...`);
        continue;
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!text) {
        console.warn(`[Gemini] ${model} respuesta vacía, probando siguiente...`);
        continue;
      }

      console.log(`[Gemini] Respondió con ${model}`);
      return text;
    } catch (err) {
      console.warn(`[Gemini] ${model} error de red:`, err);
      continue;
    }
  }

  console.error("[Gemini] Todos los modelos fallaron");
  return null;
}

// ─── Bot principal ───────────────────────────────────────────────────────────
async function askGemini(
  userMessage: string,
  conversationHistory: Array<{ role: string; parts: Array<{ text: string }> }>
): Promise<string> {
  const contents = [
    ...conversationHistory,
    { role: "user", parts: [{ text: userMessage }] },
  ];

  const text = await geminiCall(
    contents,
    { maxOutputTokens: 400, temperature: 0.5 },  // ← aumentado para que no se corte la confirmación
    getSystemPrompt()
  );

  if (!text) throw new Error("Todos los modelos de Gemini no están disponibles");
  return text;
}

// ─── Detectar reserva confirmada ─────────────────────────────────────────────
function reservaConfirmada(respuesta: string): boolean {
  const keywords = [
    "confirmada", "confirmado", "anotada", "anotado",
    "reserva hecha", "queda registrada", "todo listo",
    "te esperamos", "nos vemos",
  ];
  const lower = respuesta.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

// ─── Detectar respuesta a recordatorio ───────────────────────────────────────
function esConfirmacionPositiva(mensaje: string): boolean {
  const positivos = ["sí", "si", "yes", "claro", "confirmo", "allí estaré",
    "alli estare", "por supuesto", "ahí estaré", "ahi estare", "vamos", "ok", "vale"];
  return positivos.some((p) => mensaje.toLowerCase().includes(p));
}

function esCancelacion(mensaje: string): boolean {
  const negativos = ["no", "cancelar", "cancelad", "no puedo", "no voy",
    "no iremos", "imposible", "cancel"];
  return negativos.some((n) => mensaje.toLowerCase().includes(n));
}

// ─── Extraer resumen legible para notificar al dueño ─────────────────────────
async function extraerResumen(
  historial: Array<{ role: string; parts: Array<{ text: string }> }>,
  confirmacion: string
): Promise<string> {
  const conversacionTexto = historial
    .map((m) => `${m.role === "user" ? "Cliente" : "Bot"}: ${m.parts[0].text}`)
    .join("\n");

  const prompt = `Dada esta conversación de reserva:
${conversacionTexto}
Bot: ${confirmacion}

Extrae los datos y devuelve SOLO este bloque (sin texto extra):
🍽️ Nueva reserva — La Taberna del Sur
👤 Nombre: [nombre y apellido]
👥 Personas: [número]
📅 Fecha: [fecha completa]
🕐 Hora: [hora]
📞 Contacto: [teléfono]`;

  const text = await geminiCall(
    [{ role: "user", parts: [{ text: prompt }] }],
    { maxOutputTokens: 100, temperature: 0 }
  );

  return text ?? "Nueva reserva confirmada (sin detalles)";
}

// ─── Extraer datos estructurados para Supabase ────────────────────────────────
async function extraerDatosReserva(
  historial: Array<{ role: string; parts: Array<{ text: string }> }>,
  confirmacion: string
): Promise<{
  nombre: string;
  personas: number;
  fecha: string;
  hora: string;
  telefono: string;
} | null> {
  const conversacionTexto = historial
    .map((m) => `${m.role === "user" ? "Cliente" : "Bot"}: ${m.parts[0].text}`)
    .join("\n");

  const hoy = new Date().toISOString().split("T")[0];

  const prompt = `Dada esta conversación de reserva (fecha actual: ${hoy}):
${conversacionTexto}
Bot: ${confirmacion}

Devuelve SOLO un JSON válido con esta estructura exacta (sin markdown, sin texto extra):
{"nombre":"Nombre Apellido","personas":4,"fecha":"YYYY-MM-DD","hora":"HH:MM","telefono":"+34XXXXXXXXX"}

Si algún dato no está disponible usa null. La fecha debe estar en formato YYYY-MM-DD y la hora en HH:MM (24h).`;

  const raw = await geminiCall(
    [{ role: "user", parts: [{ text: prompt }] }],
    { maxOutputTokens: 80, temperature: 0 }
  );

  if (!raw) return null;

  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    console.error("[extraerDatosReserva] JSON inválido:", raw);
    return null;
  }
}

// ─── Construir reserva_at (timestamptz) para el cron ─────────────────────────
// datos.fecha viene en YYYY-MM-DD y datos.hora en HH:MM (extraídos por Gemini)
function buildReservaAt(fecha: string, hora: string): string | null {
  try {
    // "2025-06-10" + "21:00" → ISO con zona Madrid (UTC+2 verano)
    return `${fecha}T${hora}:00+02:00`;
  } catch {
    return null;
  }
}

// ─── Guardar reserva en Supabase ──────────────────────────────────────────────
async function guardarReservaEnSupabase(datos: {
  nombre: string;
  personas: number;
  fecha: string;
  hora: string;
  telefono: string;
}): Promise<string | null> {
  const reservaAt = buildReservaAt(datos.fecha, datos.hora);

  const { data, error } = await supabase
    .from("reservas")
    .insert({
      restaurante: "La Taberna del Sur",
      nombre: datos.nombre,
      telefono: datos.telefono,
      personas: datos.personas,
      fecha: datos.fecha,
      hora: datos.hora,
      estado: "pendiente",          // ← cambiado: el cron lo busca por "pendiente"
      reserva_at: reservaAt,        // ← nuevo: necesario para que el cron calcule cuándo mandar el recordatorio
      recordatorio_enviado: false,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[Supabase] Error guardando reserva:", error);
    return null;
  }
  console.log("[Supabase] Reserva guardada con ID:", data.id);
  return data.id;
}

// ─── Notificación WhatsApp al dueño ──────────────────────────────────────────
async function notificarDueno(resumen: string): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;
  const ownerNumber = "whatsapp:+34608892038";

  const body = new URLSearchParams({
    From: `whatsapp:${fromNumber}`,
    To: ownerNumber,
    Body: resumen,
  });

  const resp = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    }
  );

  if (!resp.ok) {
    const err = await resp.json();
    console.error("[Notificación dueño] Error Twilio:", err);
  } else {
    console.log("[Notificación dueño] Enviada correctamente a +34608892038");
  }
}

// ─── TwiML helper ────────────────────────────────────────────────────────────
function twimlResponse(message: string): NextResponse {
  const safe = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Message>${safe}</Message>\n</Response>`,
    { status: 200, headers: { "Content-Type": "text/xml; charset=utf-8" } }
  );
}

// ─── Buscar reserva pendiente de confirmación para ese teléfono ───────────────
async function buscarReservaPendiente(
  telefono: string
): Promise<{ id: string; fecha: string; hora: string } | null> {
  const hoy = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("reservas")
    .select("id, fecha, hora")
    .eq("telefono", telefono)
    .eq("estado", "pendiente")
    .eq("recordatorio_enviado", true)
    .gte("fecha", hoy)
    .order("fecha", { ascending: true })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data;
}

// ─── Handler principal ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body = (formData.get("Body") as string)?.trim();
    const from = formData.get("From") as string;

    if (!body) {
      return twimlResponse(
        "Hola! Soy el asistente de La Taberna del Sur. ¿En qué puedo ayudarte?"
      );
    }

    const telefonoCliente = from.replace("whatsapp:", "");

    // ── ¿Está respondiendo a un recordatorio? ───────────────────────────────
    const reservaPendiente = await buscarReservaPendiente(telefonoCliente);
    if (reservaPendiente) {
      if (esConfirmacionPositiva(body)) {
        await supabase
          .from("reservas")
          .update({ estado: "confirmada" })
          .eq("id", reservaPendiente.id);
        return twimlResponse(
          `¡Perfecto! Tu reserva del ${reservaPendiente.fecha} a las ${reservaPendiente.hora} queda confirmada. ¡Te esperamos! 🍷`
        );
      }
      if (esCancelacion(body)) {
        await supabase
          .from("reservas")
          .update({ estado: "cancelada" })
          .eq("id", reservaPendiente.id);
        return twimlResponse(
          "Entendido, hemos cancelado tu reserva. Si cambias de idea escríbenos y te buscamos hueco. ¡Hasta pronto!"
        );
      }
    }

    // ── Flujo normal de reserva ──────────────────────────────────────────────
    const historial = obtenerHistorial(from);
    const aiReply = await askGemini(body, historial);
    guardarMensajes(from, body, aiReply);

    // ── Si la reserva acaba de confirmarse ───────────────────────────────────
    if (reservaConfirmada(aiReply)) {
      const historialActualizado = obtenerHistorial(from);

      const resumen = await extraerResumen(historialActualizado, aiReply);
      const datos = await extraerDatosReserva(historialActualizado, aiReply);
      if (datos) {
        const telefono = datos.telefono ?? telefonoCliente;
        await guardarReservaEnSupabase({ ...datos, telefono });
      }

      notificarDueno(resumen).catch((e) =>
        console.error("[Notificación dueño] Fallo silencioso:", e)
      );
    }

    return twimlResponse(aiReply);
  } catch (error) {
    console.error("[WhatsApp] Error:", error);
    return twimlResponse(
      "Ha habido un problema técnico. Llámanos al 910 123 456."
    );
  }
}

export async function GET() {
  return Response.json({ status: "ok", endpoint: "/api/whatsapp" });
}
