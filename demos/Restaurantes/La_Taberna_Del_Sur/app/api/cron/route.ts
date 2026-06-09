import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'
import { supabase } from '@/lib/supabase'

const accountSid          = process.env.TWILIO_ACCOUNT_SID!
const authToken           = process.env.TWILIO_AUTH_TOKEN!
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER!
const client = twilio(accountSid, authToken)

// ─── Gemini fallback (para extraer personas actualizadas) ─────────────────────
const GEMINI_MODELS = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash']

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function geminiCall(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 10, temperature: 0 },
          }),
        }
      )
      const data = await res.json()
      if (data?.error?.code === 429 || data?.error?.code === 503) {
        await sleep(1500)
        continue
      }
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      if (text) return text
    } catch { continue }
  }
  return null
}

async function extraerPersonasActualizadas(
  respuesta: string,
  personasActuales: number
): Promise<number | null> {
  const prompt = `El cliente tiene una reserva para ${personasActuales} personas y ha enviado este mensaje: "${respuesta}".
¿Cuántas personas serán ahora en total? Responde SOLO con el número entero, sin texto adicional.
Si no se puede determinar con certeza, responde "null".`

  const resultado = await geminiCall(prompt)
  if (!resultado) return null
  const num = parseInt(resultado.trim())
  return isNaN(num) ? null : num
}

// ─── Detectores de intención ──────────────────────────────────────────────────
function esModificacion(texto: string): boolean {
  const keywords = [
    'en vez de', 'en lugar de', 'seremos', 'somos',
    'cambia', 'cambiar', 'modificar', 'actualiza',
    'uno menos', 'uno más', 'una más', 'una menos',
    'ya no viene', 'se apunta', 'se cae', 'al final',
  ]
  return keywords.some(k => texto.toLowerCase().includes(k))
}

// ─── Handler principal ───────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // Verificar que es llamada legítima
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const results = { reminders: 0, cancellations: 0, modifications: 0, errors: 0 }

  try {
    // ─── 1. ENVIAR RECORDATORIOS (reservas en 60 minutos) ───────────────────
    const reminderTime = new Date(now.getTime() + 60 * 60 * 1000)
    const reminderDate = reminderTime.toISOString().split('T')[0]
    const reminderHour = reminderTime.toTimeString().slice(0, 5) // 'HH:MM'

    const { data: toRemind, error: remindError } = await supabase
      .from('reservas')
      .select('*')
      .eq('fecha', reminderDate)
      .eq('hora', reminderHour)
      .eq('recordatorio_enviado', false)
      .in('estado', ['nueva', 'pendiente'])

    if (remindError) {
      console.error('Error buscando reservas para recordatorio:', remindError)
      results.errors++
    } else if (toRemind && toRemind.length > 0) {
      for (const reserva of toRemind) {
        try {
          await client.messages.create({
            from: `whatsapp:${twilioWhatsAppNumber}`,
            to: `whatsapp:${reserva.telefono}`,
            body: `¡Hola ${reserva.nombre}! 👋\n\nTe recordamos que tienes una reserva en *La Taberna del Sur* hoy a las *${reserva.hora}* para ${reserva.personas} persona${reserva.personas > 1 ? 's' : ''}.\n\n¿Podrás acudir? Responde *SÍ* para confirmar o *NO* para cancelar.\n\nSi necesitas cambiar algo (ej: "al final somos 3") indícanoslo y lo actualizamos. 🙏`
          })

          await supabase
            .from('reservas')
            .update({ recordatorio_enviado: true, estado: 'pendiente' })
            .eq('id', reserva.id)

          results.reminders++
          console.log(`[Cron] Recordatorio enviado a ${reserva.nombre} (${reserva.telefono}) para ${reserva.fecha} ${reserva.hora}`)
        } catch (err) {
          console.error(`[Cron] Error enviando recordatorio a ${reserva.telefono}:`, err)
          results.errors++
        }
      }
    }

    // ─── 2. CANCELAR AUTOMÁTICAMENTE (reservas en 10 minutos sin confirmar) ─
    const cancelTime = new Date(now.getTime() + 10 * 60 * 1000)
    const cancelDate = cancelTime.toISOString().split('T')[0]
    const cancelHour = cancelTime.toTimeString().slice(0, 5)

    const { data: toCancel, error: cancelError } = await supabase
      .from('reservas')
      .select('*')
      .eq('fecha', cancelDate)
      .eq('hora', cancelHour)
      .eq('estado', 'pendiente')
      .eq('recordatorio_enviado', true)

    if (cancelError) {
      console.error('[Cron] Error buscando reservas para cancelar:', cancelError)
      results.errors++
    } else if (toCancel && toCancel.length > 0) {
      for (const reserva of toCancel) {
        try {
          await supabase
            .from('reservas')
            .update({ estado: 'cancelada' })
            .eq('id', reserva.id)

          await client.messages.create({
            from: `whatsapp:${twilioWhatsAppNumber}`,
            to: `whatsapp:${reserva.telefono}`,
            body: `Hola ${reserva.nombre}, al no recibir confirmación hemos liberado tu mesa de hoy a las ${reserva.hora}.\n\nSi quieres hacer una nueva reserva estaremos encantados de recibirte otro día. 😊`
          })

          results.cancellations++
          console.log(`[Cron] Reserva cancelada automáticamente: ${reserva.nombre} (${reserva.fecha} ${reserva.hora})`)
        } catch (err) {
          console.error(`[Cron] Error cancelando reserva ${reserva.id}:`, err)
          results.errors++
        }
      }
    }

    return NextResponse.json({
      ok: true,
      timestamp: now.toISOString(),
      ...results
    })

  } catch (err) {
    console.error('[Cron] Error general:', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
