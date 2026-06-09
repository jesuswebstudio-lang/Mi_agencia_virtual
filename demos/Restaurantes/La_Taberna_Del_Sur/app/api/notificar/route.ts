import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'
import { supabase } from '@/lib/supabase'

const accountSid          = process.env.TWILIO_ACCOUNT_SID!
const authToken           = process.env.TWILIO_AUTH_TOKEN!
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER!

export async function POST(req: NextRequest) {
  try {
    const { id, estado } = await req.json()

    if (!id || !['confirmada', 'cancelada'].includes(estado)) {
      return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 })
    }

    // Obtener la reserva
    const { data: reserva, error } = await supabase
      .from('reservas')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !reserva) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 })
    }

    // Actualizar estado en Supabase
    const { error: updateError } = await supabase
      .from('reservas')
      .update({ estado })
      .eq('id', id)

    if (updateError) {
      console.error('[Notificar] Error actualizando estado:', updateError)
      return NextResponse.json({ error: 'Error actualizando reserva' }, { status: 500 })
    }

    // Mensaje al cliente según el estado
    const mensajeCliente =
      estado === 'confirmada'
        ? `✅ ¡Tu reserva en La Taberna del Sur está *confirmada*!\n\n👤 ${reserva.nombre}\n👥 ${reserva.personas} personas\n📅 ${reserva.fecha} a las ${reserva.hora}\n\n¡Te esperamos! Si necesitas cambiar algo, escríbenos aquí mismo.`
        : `❌ Lamentablemente hemos tenido que *cancelar* tu reserva en La Taberna del Sur.\n\n👤 ${reserva.nombre}\n📅 ${reserva.fecha} a las ${reserva.hora}\n\nSi quieres reservar para otra fecha, escríbenos. ¡Disculpa las molestias!`

    // Enviar WhatsApp al cliente
    const client = twilio(accountSid, authToken)
    await client.messages.create({
      from: `whatsapp:${twilioWhatsAppNumber}`,
      to: `whatsapp:${reserva.telefono}`,
      body: mensajeCliente,
    })

    console.log(`[Notificar] Reserva ${id} → "${estado}" y cliente notificado.`)
    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error('[Notificar] Error:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
