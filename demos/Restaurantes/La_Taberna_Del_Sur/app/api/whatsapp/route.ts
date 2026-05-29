import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = [
  "Eres el asistente virtual de 'La Taberna del Sur', un restaurante de cocina andaluza en Madrid.",
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
  "1. Saludar y preguntar para cuantas personas es la reserva",
  "2. Preguntar la fecha deseada",
  "3. Preguntar la hora (recordar que el servicio es de 13:00-16:00 y 20:00-23:30)",
  "4. Preguntar el nombre para la reserva",
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

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

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
          parts: [{ text: SYSTEM_PROMPT }],
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

    const aiReply = await askGemini(body, profileName, []);

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
