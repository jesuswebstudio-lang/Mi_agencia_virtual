import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SYSTEM_PROMPT = [
  "Eres el asistente de ventas de Fluxia, una agencia de automatización con IA para negocios en España.",
  "",
  "Tu objetivo es recopilar información del visitante para prepararle un presupuesto orientativo. Sigue este orden de preguntas de forma conversacional, una a una:",
  "",
  "1. Nombre y nombre del negocio",
  "2. Sector (restaurante, peluquería, hookah, otro — si es otro, que especifique)",
  "3. Qué problema quiere resolver o qué quiere automatizar",
  "4. Cuántos mensajes/reservas/consultas recibe aproximadamente al día",
  "5. Si tiene web actualmente",
  "6. Email de contacto",
  "",
  "Una vez tengas todos los datos, genera un resumen así:",
  "---",
  "RESUMEN LISTO PARA ENVIAR:",
  "- Nombre: [nombre]",
  "- Negocio: [negocio]",
  "- Sector: [sector]",
  "- Necesidad: [qué quiere automatizar]",
  "- Volumen diario: [mensajes/reservas]",
  "- Tiene web: [sí/no]",
  "- Email: [email]",
  "",
  "PRESUPUESTO ORIENTATIVO:",
  "[Basándote en el sector y necesidad, indica qué plan de Fluxia le conviene (Auto Starter 49EUR/mes, Auto Pro 89EUR/mes, Auto Elite 149EUR/mes, o Pro con web desde 799EUR+49EUR/mes) y por qué en 2-3 frases.]",
  "---",
  "",
  "Cuando llegues a ese punto, añade exactamente esta frase al final: ENVIAR_PRESUPUESTO",
  "",
  "Reglas:",
  "- Sé amable, cercano y profesional",
  "- Máximo 2-3 frases por respuesta",
  "- No hagas más de una pregunta a la vez",
  "- No menciones precios hasta el resumen final",
  "- Si el visitante pregunta algo sobre Fluxia, responde brevemente y redirige a las preguntas",
].join("\n");

function extractLeadData(conversation: string) {
  const lines = conversation.split("\n");
  const data: Record<string, string> = {};

  for (const line of lines) {
    if (line.includes("Nombre:")) data.nombre = line.split("Nombre:")[1]?.trim();
    if (line.includes("Negocio:")) data.negocio = line.split("Negocio:")[1]?.trim();
    if (line.includes("Sector:")) data.sector = line.split("Sector:")[1]?.trim();
    if (line.includes("Necesidad:")) data.necesidad = line.split("Necesidad:")[1]?.trim();
    if (line.includes("Volumen diario:")) data.volumen = line.split("Volumen diario:")[1]?.trim();
    if (line.includes("Tiene web:")) data.web = line.split("Tiene web:")[1]?.trim();
    if (line.includes("Email:")) data.email = line.split("Email:")[1]?.trim();
  }

  const presupuestoMatch = conversation.match(
    /PRESUPUESTO ORIENTATIVO:\n([\s\S]*?)(?:---|ENVIAR_PRESUPUESTO|$)/
  );
  if (presupuestoMatch) data.presupuesto = presupuestoMatch[1].trim();

  return data;
}

async function sendEmails(lead: Record<string, string>, fullSummary: string) {
  await resend.emails.send({
    from: "Fluxia Bot <onboarding@resend.dev>",
    to: "jesus.webstudio@gmail.com",
    subject: "Nuevo lead: " + (lead.negocio || "Negocio nuevo") + " - " + (lead.sector || ""),
    html:
      '<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0a0a0a;color:#e5e5e5;border-radius:12px;">' +
      '<h2 style="color:#34d399;margin-bottom:24px;">Nuevo lead desde la web</h2>' +
      '<table style="width:100%;border-collapse:collapse;">' +
      '<tr><td style="padding:8px 0;color:#9ca3af;width:140px;">Nombre</td><td style="padding:8px 0;font-weight:600;">' + (lead.nombre || "-") + "</td></tr>" +
      '<tr><td style="padding:8px 0;color:#9ca3af;">Negocio</td><td style="padding:8px 0;font-weight:600;">' + (lead.negocio || "-") + "</td></tr>" +
      '<tr><td style="padding:8px 0;color:#9ca3af;">Sector</td><td style="padding:8px 0;">' + (lead.sector || "-") + "</td></tr>" +
      '<tr><td style="padding:8px 0;color:#9ca3af;">Necesidad</td><td style="padding:8px 0;">' + (lead.necesidad || "-") + "</td></tr>" +
      '<tr><td style="padding:8px 0;color:#9ca3af;">Volumen/dia</td><td style="padding:8px 0;">' + (lead.volumen || "-") + "</td></tr>" +
      '<tr><td style="padding:8px 0;color:#9ca3af;">Tiene web</td><td style="padding:8px 0;">' + (lead.web || "-") + "</td></tr>" +
      '<tr><td style="padding:8px 0;color:#9ca3af;">Email</td><td style="padding:8px 0;">' + (lead.email || "-") + "</td></tr>" +
      "</table>" +
      '<div style="margin-top:24px;padding:16px;background:#111;border-left:3px solid #34d399;border-radius:4px;">' +
      '<p style="color:#34d399;font-weight:600;margin:0 0 8px;">Presupuesto orientativo</p>' +
      '<p style="margin:0;line-height:1.6;">' + (lead.presupuesto || "-") + "</p></div>" +
      '<div style="margin-top:24px;padding:16px;background:#111;border-radius:8px;">' +
      '<p style="color:#6b7280;font-size:12px;margin:0 0 8px;">Conversacion completa</p>' +
      '<pre style="font-size:12px;color:#9ca3af;white-space:pre-wrap;margin:0;">' + fullSummary + "</pre></div></div>",
  });

  if (lead.email) {
    const firstName = lead.nombre ? lead.nombre.split(" ")[0] : "";
    await resend.emails.send({
      from: "Fluxia <onboarding@resend.dev>",
      to: lead.email,
      subject: "Tu presupuesto orientativo de Fluxia",
      html:
        '<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0a0a0a;color:#e5e5e5;border-radius:12px;">' +
        '<h2 style="color:#34d399;">Hola, ' + firstName + '!</h2>' +
        '<p style="color:#9ca3af;line-height:1.6;">Hemos recibido tu solicitud de presupuesto para <strong style="color:#e5e5e5;">' + (lead.negocio || "tu negocio") + "</strong>. Nuestro equipo lo revisará y te contactará en menos de 24 horas.</p>" +
        '<div style="margin:24px 0;padding:16px;background:#111;border-left:3px solid #34d399;border-radius:4px;">' +
        '<p style="color:#34d399;font-weight:600;margin:0 0 8px;">Presupuesto orientativo</p>' +
        '<p style="margin:0;line-height:1.6;color:#d1d5db;">' + (lead.presupuesto || "-") + "</p></div>" +
        '<p style="color:#6b7280;font-size:13px;">Si tienes cualquier duda, escribenos a <a href="mailto:jesus.webstudio@gmail.com" style="color:#34d399;">jesus.webstudio@gmail.com</a></p>' +
        '<div style="margin-top:32px;padding-top:16px;border-top:1px solid #1f2937;">' +
        '<p style="margin:0;font-size:18px;font-weight:600;">Flux<span style="color:#34d399;">ia</span></p>' +
        '<p style="margin:4px 0 0;color:#6b7280;font-size:12px;">El sistema que gestiona tu negocio mientras tu lo haces crecer.</p></div></div>',
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY no esta configurada" }, { status: 500 });
    }

    // Convertir roles y eliminar mensajes iniciales del bot (Gemini exige empezar con 'user')
    const contents = messages
      .map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }))
      .filter((_, i, arr) => !(i === 0 && arr[0].role === "model"));

    if (contents.length === 0) {
      return NextResponse.json({ error: "No hay mensajes validos" }, { status: 400 });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          generationConfig: {
            maxOutputTokens: 600,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json().catch(() => ({}));
      console.error("Gemini API Error:", errorResponse);
      return NextResponse.json({ error: "Error en la comunicacion con Gemini" }, { status: response.status });
    }

    const data = await response.json();
    const reply: string = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!reply) {
      console.error("Gemini devolvio respuesta vacia:", data);
      return NextResponse.json({ error: "Respuesta vacia de Gemini" }, { status: 500 });
    }

    const shouldSend = reply.includes("ENVIAR_PRESUPUESTO");
    const cleanReply = reply.replace("ENVIAR_PRESUPUESTO", "").trim();

    if (shouldSend) {
      const fullConversation =
        messages
          .map((m: { role: string; content: string }) =>
            (m.role === "user" ? "Visitante" : "Fluxia") + ": " + m.content
          )
          .join("\n\n") +
        "\n\nFluxia: " +
        cleanReply;

      const lead = extractLeadData(cleanReply);
      await sendEmails(lead, fullConversation);
    }

    return NextResponse.json({ message: cleanReply, sent: shouldSend });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Error al procesar el mensaje" }, { status: 500 });
  }
}
