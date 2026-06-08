import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Reserva = {
  id?: string
  restaurante?: string
  nombre: string
  telefono: string
  personas: number
  fecha: string       // 'YYYY-MM-DD'
  hora: string        // 'HH:MM'
  estado?: 'nueva' | 'pendiente' | 'confirmada' | 'cancelada'
  recordatorio_enviado?: boolean
  created_at?: string
  updated_at?: string
}
