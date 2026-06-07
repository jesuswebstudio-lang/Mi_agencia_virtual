import { NextRequest, NextResponse } from "next/server";

// Historial de conversaciones por número de teléfono
const conversaciones = new Map<
  string,
  {
    mensajes: Array<{ role: string; parts: Array<{ text: string }> }>;
    ultimaActividad: number;
  }
>();

const EXPIRACION_MS = 2 * 60 * 60 * 1000; // 2 horas

function obtenerHistorial(telefono: string) {
  const conv = conversaciones.get(telefono);
  if (!conv) return [];
  if (Date.now() - conv.ultimaActividad > EXPIRACION_MS) {
    conversaciones.delete(telefono);
    return [];
  }
  return conv.mensajes;
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

function getSystemPrompt(): string {
  const ahora = new Date().toLocaleDateString("es-ES", {
    timeZone: "Europe/Madrid",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return [
    "Eres el asistente virtual de 'La Taberna del Sur', un restaurante de cocina andaluza en Madrid.",
    "",
    `FECHA ACTUAL: ${ahora} (zona horaria Madrid)`,
    "Usa esta fecha para resolver fechas relativas como 'mañana', 'el viernes', 'el 29', 'la semana que viene', etc.",
    "Cuando confirmes la reserva, indica siempre la fecha completa con el dia de la semana, por ejemplo: 'martes 10 de junio'.",
    "",
    "INFORMACION DEL RESTAURANTE:",
    "- Nombre: La Taberna del Sur",
    "- Direccion: Calle Gran Via 42, Madrid",
    "- Telefono: 910 123 456",
    "- Horario: Lunes a domingo de 13:00 a 16:00 y de 20:00 a 23:30",
    "- Especialidades: Jamon iberico, gazpacho, carrillada al vino, tortilla de patatas, croquetas caseras",
    "- Precio medio: 25-35 EUR por persona",
    "- Capacidad: maxima 40 personas. Terraza disponible en verano.",
    "- Aparcamiento: parking publico a 200m en Calle Montera",
    "",
    "TU OBJETIVO es gestionar reservas siguiendo este flujo, una pregunta a la vez:",
    "",
    "1. Saludar y preguntar el nombre y apellido de la persona",
    "2. Preguntar para cuantas personas es la reserva",
    "3. Preguntar la fecha deseada",
    "4. Preguntar la hora (recordar que el servicio es de 13:00-16:00 y 20:00-23:30)",
    "5. Preguntar un telefono de contacto",
    "6. Confirmar todos los datos con un resumen y decir que la reserva queda anotada",
    "",
    "REGLAS IMPORTANTES:",
    "- Mensajes cortos, maximo 3-4 lineas (es WhatsApp, no un email)",
    "- Tono cercano y amable, tuteo",
    "- Si piden una hora fuera del horario, explica el horario y ofrece la hora mas cercana disponible",
    "- Si son mas de 15 personas, indica que para grupos grandes llamen al 910 123 456",
    "- Si preguntan por alergias o dietas especiales, di que lo anoten en la reserva y el equipo lo tendra en cuenta",
    "- Si quieren cancelar o modificar una reserva, pide el nombre y telefono y di que el equipo les llamara",
    "- Si preguntan por el menu, menciona 2-3 especialidades y ofrece mas info si quieren",
    "- Responde siempre en el idioma en que te escriban (espanol o ingles)",
    "- Nunca inventes informacion que no este en este prompt",
  ].join("\n");
}

async function askGemini(
  userMessage: string,
  userName: string,
  conversationHistory: Array<{ role: string; parts: Array<{ text: string }> }>
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  const contents = [
    ...conversationHistory,
    {
      role: "user",
      parts: [
        {
          text: userName
            ? "[Cliente: " + userName + "]\n" + userMessage
            : userMessage,
        },
      ],
    },
  ];

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: getSystemPrompt() }],
        },
        contents,
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7,
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

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Message>' +
    safe +
    "</Message>\n</Response>";

  return new NextResponse(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const body = (formData.get("Body") as string)?.trim();
    const from = formData.get("From") as string;
    const profileName = (formData.get("ProfileName") as string) || "";

    console.log("[WhatsApp Reservas] De: " + from + " (" + profileName + ") -> " + body);

    if (!body) {
      return twimlResponse(
        "Hola! Soy el asistente de La Taberna del Sur. Puedo ayudarte a hacer una reserva o resolver tus dudas. En que puedo ayudarte?"
      );
    }

    const historial = obtenerHistorial(from);
    const aiReply = await askGemini(body, profileName, historial);

    guardarMensajes(from, profileName ? `[Cliente: ${profileName}]\n${body}` : body, aiReply);

    console.log("[WhatsApp Reservas] Respuesta -> " + aiReply.slice(0, 80));

    return twimlResponse(aiReply);
  } catch (error) {
    console.error("[WhatsApp Reservas] Error:", error);
    return twimlResponse(
      "Vaya, ha habido un problema tecnico. Por favor llamanos al 910 123 456 y te atendemos enseguida."
    );
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    endpoint: "/api/whatsapp",
    restaurante: "La Taberna del Sur",
  });
}
