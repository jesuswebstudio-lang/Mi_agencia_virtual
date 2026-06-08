// app/api/voice/route.ts
import { NextRequest, NextResponse } from "next/server";

function twimlResponse(xml: string): NextResponse {
  return new NextResponse(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

export async function POST(req: NextRequest) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="es-ES" voice="Polly.Lucia-Neural">
    <speak>
      Hola, <break time="200ms"/> bienvenido a La Taberna del Sur.
      <break time="150ms"/>
      Soy el asistente virtual y puedo ayudarte a hacer una reserva.
      <break time="300ms"/>
      ¿En qué puedo ayudarte?
    </speak>
  </Say>
  <Gather
    input="speech"
    language="es-ES"
    speechTimeout="auto"
    action="/api/voice/respond"
    method="POST"
  />
  <Say language="es-ES" voice="Polly.Lucia-Neural">
    <speak>
      No he escuchado nada. <break time="200ms"/>
      Por favor llama de nuevo o escríbenos por WhatsApp.
    </speak>
  </Say>
</Response>`;

  return twimlResponse(xml);
}
