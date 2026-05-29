// app/api/whatsapp/route.ts
// Webhook de Twilio para WhatsApp → responde con Gemini (Fluxia)

import { NextRequest, NextResponse } from "next/server";

// ─── CONFIGURACIÓN ───────────────────────────────────────────────────────────

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `Eres el asistente virtual de Fluxia, una consultora española especializada en automatización con inteligencia artificial para negocios de hostelería y servicios: restaurantes, peluquerías y hookahs.

Tu rol es atender a posibles clientes que contactan por WhatsApp, responder sus dudas sobre automatización y ayudarles a agendar una llamada de consultoría gratuita con el equipo de Fluxia.

SERVICIOS QUE OFRECE FLUXIA:
- Agentes de IA para atender reservas y preguntas por WhatsApp (24/7)
- Automatización de citas y recordatorios para peluquerías
- Gestión de pedidos y menús con IA para restaurantes
- Respuesta automática a reseñas de Google
- Integración con los sistemas que ya usan (Instagram, Google, WhatsApp Business)

CÓMO RESPONDER:
- Usa un tono cercano, directo y profesional (tuteo)
- Mensajes cortos — WhatsApp no es un email, máximo 3-4 líneas
- Si el cliente muestra interés, invítale a agendar una llamada gratuita
- Si pregunta por precios, di que depende del negocio y que en la llamada lo ven juntos
- No hagas promesas que no puedas cumplir

CIERRE PARA AGENDAR:
Cuando el cliente esté listo: "¿Te viene bien que te llame alguien del equipo esta semana? Dime qué días y horario y lo organizamos."

IDIOMAS: Responde siempre en el idioma en que te escriban (español o inglés).`;

// ─── FUNCIÓN GEMINI ───────────────────────────────────────────────────────────

async function askGemini(userMessage: string, userName: string): Promise<string> {
  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: userName
                ? `[El cliente se llama ${userName}]\n${userMessage}`
                : userMessage,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 350,
        temperature: 0.75,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error("Gemini error:", err);
    throw new Error(`Gemini ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("Respuesta vacía de Gemini");
  return text.trim();
}

// ─── HELPER: CONSTRUIR RESPUESTA TWIML ───────────────────────────────────────

function twimlResponse(message: string): NextResponse {
  // Escapar caracteres especiales para XML
  const safe = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${safe}</Message>
</Response>`;

  return new NextResponse(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

// ─── WEBHOOK PRINCIPAL ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // Twilio envía los datos como form-encoded
    const formData = await req.formData();

    const body = (formData.get("Body") as string)?.trim();
    const from = formData.get("From") as string;        // ej: whatsapp:+34612345678
    const profileName = (formData.get("ProfileName") as string) || "";

    // Log para Vercel
    console.log(`[WhatsApp] De: ${from} (${profileName}) → "${body}"`);

    // Ignorar mensajes vacíos o solo con multimedia sin texto
    if (!body) {
      return twimlResponse(
        "¡Hola! Soy el asistente de Fluxia 🤖 ¿En qué puedo ayudarte? Cuéntame qué tipo de negocio tienes."
      );
    }

    // Llamar a Gemini
    const aiReply = await askGemini(body, profileName);

    console.log(`[WhatsApp] Respuesta enviada → "${aiReply.slice(0, 80)}..."`);

    return twimlResponse(aiReply);
  } catch (error) {
    console.error("[WhatsApp] Error:", error);

    return twimlResponse(
      "Vaya, ha habido un problema técnico 😅 Inténtalo de nuevo en un momento o visita fluxia.es"
    );
  }
}

// GET para verificar que el endpoint está vivo (útil para debugging)
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/whatsapp",
    description: "Webhook de WhatsApp · Fluxia",
  });
}
