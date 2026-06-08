import { NextRequest, NextResponse } from "next/server";

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

function guardarMensajes(telefono: string, userText: string, assistantText: string) {
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

// ─── Gemini ──────────────────────────────────────────────────────────────────
async function askGemini(
  userMessage: string,
  conversationHistory: Array<{ role: string; parts: Array<{ text: string }> }>
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: getSystemPrompt() }] },
        contents: [
          ...conversationHistory,
          { role: "user", parts: [{ text: userMessage }] },
        ],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.5,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    console.error("Gemini error:", err);
    throw new Error("Gemini " + response.status);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Respuesta vacia de Gemini");
  return text.trim();
}

// ─── Detectar reserva confirmada ─────────────────────────────────────────────
function reservaConfirmada(respuesta: string): boolean {
  const keywords = [
    "confirmada", "confirmado", "anotada", "anotado",
    "reserva hecha", "queda registrada", "todo listo",
    "te esperamos", "nos vemos"
  ];
  const lower = respuesta.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

// ─── Extraer resumen con Gemini ───────────────────────────────────────────────
async function extraerResumen(
  historial: Array<{ role: string; parts: Array<{ text: string }> }>,
  confirmacion: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
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

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 100, temperature: 0 },
      }),
    }
  );

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "Nueva reserva confirmada (sin detalles)";
}

// ─── Notificación WhatsApp al dueño ──────────────────────────────────────────
async function notificarDueno(resumen: string): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER; // whatsapp:+14155238886
  const ownerNumber = "whatsapp:+34608892038";

  const body = new URLSearchParams({
    From: `whatsapp:${fromNumber}`,
    To:   ownerNumber,
    Body: resumen,
  });

  const resp = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
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

// ─── Handler principal ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body = (formData.get("Body") as string)?.trim();
    const from = formData.get("From") as string;

    if (!body) {
      return twimlResponse("Hola! Soy el asistente de La Taberna del Sur. ¿En qué puedo ayudarte?");
    }

    const historial = obtenerHistorial(from);
    const aiReply   = await askGemini(body, historial);
    guardarMensajes(from, body, aiReply);

    // Si la reserva acaba de confirmarse → notificar al dueño
    if (reservaConfirmada(aiReply)) {
      const resumen = await extraerResumen(obtenerHistorial(from), aiReply);
      notificarDueno(resumen).catch((e) =>
        console.error("[Notificación dueño] Fallo silencioso:", e)
      );
    }

    return twimlResponse(aiReply);
  } catch (error) {
    console.error("[WhatsApp] Error:", error);
    return twimlResponse("Ha habido un problema técnico. Llámanos al 910 123 456.");
  }
}

export async function GET() {
  return Response.json({ status: "ok", endpoint: "/api/whatsapp" });
}
