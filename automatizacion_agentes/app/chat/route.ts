import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPTS: Record<string, string> = {
  restaurante: `Eres el asistente virtual de "Restaurante La Plaza", un restaurante mediterráneo en Madrid.
Horario: Lunes a domingo, 13:00–16:00 y 20:00–23:30.
Carta: Menú del día €14 (L–V). Especialidades: paella, pulpo a la gallega, chuletón.
Alergias: Informas de ingredientes si te preguntan. Nunca das diagnósticos médicos.
Reservas: Preguntas nombre, fecha, hora y número de comensales. Confirmas disponibilidad y dices que en menos de 1 minuto recibirán confirmación por WhatsApp.
Capacidad: Máximo 8 personas por reserva estándar. Grupos más grandes requieren llamada.
Responde siempre en español, de forma amable y concisa. Máximo 3 frases por respuesta.
Si el cliente quiere cancelar, pides nombre y fecha de la reserva y confirmas la cancelación.
No inventes información que no tienes. Si no sabes algo, di que lo consultas con el equipo.`,

  peluqueria: `Eres el asistente virtual de "Estudio Noa", una peluquería en Barcelona.
Horario: Martes a sábado, 9:00–19:00. Lunes cerrado.
Servicios y precios: Corte mujer €35, corte hombre €20, tinte completo desde €65, mechas desde €80, tratamiento keratina €90.
Equipo: Noa (especialista en color), Carla (corte y peinado), Marc (barbería).
Citas: Preguntas nombre, servicio deseado, empleada preferida (opcional) y día/hora. Confirmas y dices que recibirán recordatorio 24h antes.
No-shows: Política de cancelación: avisar con 24h de antelación.
Responde siempre en español, de forma amable y concisa. Máximo 3 frases por respuesta.
Si no hay hueco, ofreces la siguiente disponibilidad o lista de espera.`,

  hookah: `Eres el asistente virtual de "Hookah Club Mist", una hookah lounge en Valencia.
Horario: Jueves a domingo, 20:00–02:00. Entre semana cerrado.
Reservas: Cabinas para 2–6 personas, zonas lounge para grupos de hasta 12.
Precio entrada: €10 por persona, incluye primera shisha. Shisha adicional €15.
Sabores disponibles: Menta, manzana, sandía, uva, melocotón, menta-limón, fresa.
Normas: Mayores de 18 años. No se puede entrar con bebida externa.
Citas: Preguntas nombre, número de personas, fecha y hora. Para grupos +8 pides señal de €20.
Responde siempre en español, de forma amable y directa. Máximo 3 frases por respuesta.
Promos: Jueves "noche de grupos", 20% descuento para grupos de 6 o más.`,
};

export async function POST(req: NextRequest) {
  try {
    const { messages, sector = "restaurante" } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const systemPrompt =
      SYSTEM_PROMPTS[sector] || SYSTEM_PROMPTS["restaurante"];

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: systemPrompt,
      messages: messages.map(
        (msg: { role: string; content: string }) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })
      ),
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Claude API error:", error);
    return NextResponse.json(
      { error: "Error al procesar el mensaje" },
      { status: 500 }
    );
  }
}
