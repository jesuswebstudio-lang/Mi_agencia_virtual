import { NextRequest, NextResponse } from "next/server";

const conversaciones = new Map<
  string,
  {
    mensajes: Array<{ role: string; parts: Array<{ text: string }> }>;
    ultimaActividad: number;
  }
>();

const EXPIRACION_MS = 2 * 60 * 60 * 1000;
const MAX_TURNOS = 6; // Solo últimos 6 mensajes (3 turnos)

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

function getSystemPrompt(): string {
  // Fecha compacta: "lun 9 jun 2025"
  const ahora = new Date().toLocaleDateString("es-ES", {
    timeZone: "Europe/Madrid",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Prompt ultra compacto — mismo comportamiento, ~60% menos tokens
  return `Eres asistente de reservas de La Taberna del Sur (Madrid). Hoy: ${ahora}.
RESTAURANTE: C/Gran Via 42 | Tel: 910123456 | L-D 13-16h y 20-23:30h | Precio: 25-35€/pp | Máx 40 personas.
Especialidades: jamón ibérico, gazpacho, carrillada, tortilla, croquetas.
FLUJO (una pregunta a la vez):
1.Saluda y pide nombre+apellido 2.Personas 3.Fecha(resuelve "mañana","el viernes","el 29"→fecha completa) 4.Hora 5.Teléfono 6.Confirma resumen con fecha completa ej:"martes 10 junio".
REGLAS: Respuestas cortas (máx 3 líneas). Tuteo. Hora fuera de rango→ofrece la más cercana. +15 personas→llamen al tel. Alergias→el equipo lo tendrá en cuenta. Cancelar/modificar→pide nombre+tel. Responde en el idioma del cliente.`;
}

async function askGemini(
  userMessage: string,
  conversationHistory: Array<{ role: string; parts: Array<{ text: string }> }>
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
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
          maxOutputTokens: 150, // Suficiente para WhatsApp
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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body = (formData.get("Body") as string)?.trim();
    const from = formData.get("From") as string;

    if (!body) {
      return twimlResponse("Hola! Soy el asistente de La Taberna del Sur. ¿En qué puedo ayudarte?");
    }

    const historial = obtenerHistorial(from);
    const aiReply = await askGemini(body, historial);
    guardarMensajes(from, body, aiReply);

    return twimlResponse(aiReply);
  } catch (error) {
    console.error("[WhatsApp] Error:", error);
    return twimlResponse("Ha habido un problema técnico. Llámanos al 910 123 456.");
  }
}

export async function GET() {
  return Response.json({ status: "ok", endpoint: "/api/whatsapp" });
}
