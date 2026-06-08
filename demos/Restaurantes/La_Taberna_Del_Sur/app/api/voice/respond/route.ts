// app/api/voice/respond/route.ts
import { NextRequest, NextResponse } from "next/server";

const llamadas = new Map<
  string,
  {
    mensajes: Array<{ role: string; parts: Array<{ text: string }> }>;
    ultimaActividad: number;
  }
>();

const EXPIRACION_MS = 30 * 60 * 1000;
const MAX_TURNOS = 10;

function obtenerHistorial(callSid: string) {
  const llamada = llamadas.get(callSid);
  if (!llamada) return [];
  if (Date.now() - llamada.ultimaActividad > EXPIRACION_MS) {
    llamadas.delete(callSid);
    return [];
  }
  return llamada.mensajes.slice(-MAX_TURNOS);
}

function guardarMensajes(callSid: string, userText: string, assistantText: string) {
  if (!llamadas.has(callSid)) {
    llamadas.set(callSid, { mensajes: [], ultimaActividad: Date.now() });
  }
  const llamada = llamadas.get(callSid)!;
  llamada.mensajes.push(
    { role: "user", parts: [{ text: userText }] },
    { role: "model", parts: [{ text: assistantText }] }
  );
  llamada.ultimaActividad = Date.now();
}

function getSystemPrompt(): string {
  const ahora = new Date().toLocaleDateString("es-ES", {
    timeZone: "Europe/Madrid",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `Eres el asistente de voz de La Taberna del Sur (Madrid). Hoy: ${ahora}.
RESTAURANTE: C/Gran Via 42 | Tel: 910123456 | L-D 13-16h y 20-23:30h | Precio: 25-35€/pp | Máx 40 personas.
Especialidades: jamón ibérico, gazpacho, carrillada, tortilla, croquetas.
FLUJO (una pregunta a la vez):
1.Pide nombre+apellido 2.Personas 3.Fecha(resuelve "mañana","el viernes"→fecha completa) 4.Hora 5.Teléfono de contacto 6.Confirma resumen con fecha completa ej:"martes 10 junio".
REGLAS CRÍTICAS PARA VOZ:
- Respuestas MUY cortas, máx 2 frases (se escucha por teléfono)
- Sin emojis, sin asteriscos, sin guiones — solo texto natural hablado
- Habla con naturalidad, como una persona real
- Números siempre en palabras: "diez de junio" no "10/06"
- Si no entiendes algo, pide que lo repita amablemente
- Tuteo, tono amable y cercano
- +15 personas→diles que llamen al nueve uno cero, uno dos tres, cuatro cinco seis
- Al confirmar la reserva di exactamente: "Perfecto, tu reserva queda anotada. ¡Hasta pronto!"`;
}

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
          maxOutputTokens: 100,
          temperature: 0.4,
        },
      }),
    }
  );

  if (!response.ok) throw new Error("Gemini error " + response.status);

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Respuesta vacía");
  return text.trim();
}

// Convierte texto plano en SSML humanizado:
// - Pausa natural tras signos de puntuación
// - Velocidad ligeramente reducida (más natural al teléfono)
// - Énfasis en preguntas
function humanizarSSML(texto: string): string {
  const procesado = texto
    // Pausa media tras coma
    .replace(/,\s+/g, ', <break time="200ms"/> ')
    // Pausa larga tras punto (excepto abreviaturas de hora como 13.00)
    .replace(/\.\s+(?=[A-ZÁÉÍÓÚ¿¡])/g, '. <break time="400ms"/> ')
    // Pausa al final de pregunta
    .replace(/\?\s*/g, '? <break time="300ms"/> ')
    // Pausa al final de exclamación
    .replace(/!\s*/g, '! <break time="250ms"/> ')
    // Énfasis en "perfecto", "genial", "anotado" para sonar más cálido
    .replace(/\b(perfecto|genial|estupendo|anotado|anotada)\b/gi,
      '<emphasis level="moderate">$1</emphasis>')
    // Limpiar espacios dobles
    .replace(/\s{2,}/g, " ")
    .trim();

  return `<speak><prosody rate="93%">${procesado}</prosody></speak>`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function twimlResponse(xml: string): NextResponse {
  return new NextResponse(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const speechResult = (formData.get("SpeechResult") as string)?.trim();
    const callSid = formData.get("CallSid") as string;
    const confidence = parseFloat((formData.get("Confidence") as string) || "0");

    console.log(`[Voz] ${callSid} | Confianza: ${confidence} | "${speechResult}"`);

    // Confianza baja → pedir que repita
    if (!speechResult || confidence < 0.4) {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="es-ES" voice="Polly.Lucia-Neural">
    <speak>
      <prosody rate="93%">
        Perdona, no te he escuchado bien. <break time="200ms"/> ¿Puedes repetirlo?
      </prosody>
    </speak>
  </Say>
  <Gather
    input="speech"
    language="es-ES"
    speechTimeout="auto"
    action="/api/voice/respond"
    method="POST"
  />
</Response>`;
      return twimlResponse(xml);
    }

    const historial = obtenerHistorial(callSid);
    const aiReply = await askGemini(speechResult, historial);
    guardarMensajes(callSid, speechResult, aiReply);

    console.log(`[Voz] Respuesta: ${aiReply}`);

    const esConfirmacion =
      aiReply.toLowerCase().includes("queda anotada") ||
      aiReply.toLowerCase().includes("hasta pronto");

    // Escapar primero, luego humanizar con SSML
    const safeReply = humanizarSSML(escapeXml(aiReply));

    const xml = esConfirmacion
      ? `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="es-ES" voice="Polly.Lucia-Neural">${safeReply}</Say>
  <Pause length="1"/>
  <Hangup/>
</Response>`
      : `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="es-ES" voice="Polly.Lucia-Neural">${safeReply}</Say>
  <Gather
    input="speech"
    language="es-ES"
    speechTimeout="auto"
    action="/api/voice/respond"
    method="POST"
  />
  <Say language="es-ES" voice="Polly.Lucia-Neural">
    <speak>
      <prosody rate="93%">
        No he escuchado nada. <break time="300ms"/>
        Si necesitas ayuda, llámanos o escríbenos por WhatsApp.
      </prosody>
    </speak>
  </Say>
</Response>`;

    return twimlResponse(xml);
  } catch (error) {
    console.error("[Voz] Error:", error);
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="es-ES" voice="Polly.Lucia-Neural">
    <speak>
      <prosody rate="93%">
        Ha habido un problema técnico. <break time="300ms"/>
        Por favor llámanos directamente al
        <say-as interpret-as="telephone">910123456</say-as>.
      </prosody>
    </speak>
  </Say>
  <Hangup/>
</Response>`;
    return twimlResponse(xml);
  }
}
