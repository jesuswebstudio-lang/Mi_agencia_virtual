import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'
import { supabase } from '@/lib/supabase'

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER!
const client = twilio(accountSid, authToken)

// Esta ruta se llama desde Vercel Cron Jobs cada minuto
// Configura en vercel.json: { "crons": [{ "path": "/api/cron", "schedule": "* * * * *" }] }

export async function GET(req: NextRequest) {
  // Verificar que es llamada legítima de Vercel Cron
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const results = { reminders: 0, cancellations: 0, errors: 0 }

  try {
    // ─── 1. ENVIAR RECORDATORIOS (reservas en 60 minutos) ───────────────────
    const reminderTime = new Date(now.getTime() + 60 * 60 * 1000) // ahora + 1 hora
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
            body: `¡Hola ${reserva.nombre}! 👋\n\nTe recordamos que tienes una reserva en *La Taberna del Sur* hoy a las *${reserva.hora}* para ${reserva.personas} persona${reserva.personas > 1 ? 's' : ''}.\n\n¿Podrás acudir? Responde *SÍ* para confirmar o *NO* para cancelar.\n\nSi no recibimos respuesta, la reserva se cancelará automáticamente 10 minutos antes. 🙏`
          })

          // Marcar recordatorio como enviado y estado pendiente
          await supabase
            .from('reservas')
            .update({ recordatorio_enviado: true, estado: 'pendiente' })
            .eq('id', reserva.id)

          results.reminders++
          console.log(`Recordatorio enviado a ${reserva.nombre} (${reserva.telefono}) para ${reserva.fecha} ${reserva.hora}`)
        } catch (err) {
          console.error(`Error enviando recordatorio a ${reserva.telefono}:`, err)
          results.errors++
        }
      }
    }

    // ─── 2. CANCELAR AUTOMÁTICAMENTE (reservas en 10 minutos sin confirmar) ─
    const cancelTime = new Date(now.getTime() + 10 * 60 * 1000) // ahora + 10 minutos
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
      console.error('Error buscando reservas para cancelar:', cancelError)
      results.errors++
    } else if (toCancel && toCancel.length > 0) {
      for (const reserva of toCancel) {
        try {
          // Cancelar en base de datos
          await supabase
            .from('reservas')
            .update({ estado: 'cancelada' })
            .eq('id', reserva.id)

          // Avisar al cliente
          await client.messages.create({
            from: `whatsapp:${twilioWhatsAppNumber}`,
            to: `whatsapp:${reserva.telefono}`,
            body: `Hola ${reserva.nombre}, al no recibir confirmación hemos liberado tu mesa de hoy a las ${reserva.hora}.\n\nSi quieres hacer una nueva reserva estaremos encantados de recibirte otro día. 😊`
          })

          results.cancellations++
          console.log(`Reserva cancelada automáticamente: ${reserva.nombre} (${reserva.fecha} ${reserva.hora})`)
        } catch (err) {
          console.error(`Error cancelando reserva ${reserva.id}:`, err)
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
    console.error('Error general en cron:', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
