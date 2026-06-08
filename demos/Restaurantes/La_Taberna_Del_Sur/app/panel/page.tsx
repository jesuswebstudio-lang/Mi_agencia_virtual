'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Reserva = {
  id: string
  nombre: string
  telefono: string
  personas: number
  fecha: string
  hora: string
  estado: 'nueva' | 'pendiente' | 'confirmada' | 'cancelada'
  created_at: string
}

export default function PanelPage() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [filtro, setFiltro] = useState('all')
  const [loading, setLoading] = useState(true)
  const [nueva, setNueva] = useState<string | null>(null)

  useEffect(() => {
    cargarReservas()

    // Suscripción en tiempo real
    const channel = supabase
      .channel('reservas-channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reservas',
        filter: `restaurante=eq.La Taberna del Sur`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const r = payload.new as Reserva
          setReservas(prev => [r, ...prev])
          setNueva(r.id)
          setTimeout(() => setNueva(null), 3000)
        } else if (payload.eventType === 'UPDATE') {
          setReservas(prev => prev.map(r => r.id === payload.new.id ? payload.new as Reserva : r))
        } else if (payload.eventType === 'DELETE') {
          setReservas(prev => prev.filter(r => r.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function cargarReservas() {
    setLoading(true)
    const { data } = await supabase
      .from('reservas')
      .select('*')
      .eq('restaurante', 'La Taberna del Sur')
      .order('created_at', { ascending: false })
    if (data) setReservas(data)
    setLoading(false)
  }

  async function cambiarEstado(id: string, estado: Reserva['estado']) {
    await supabase.from('reservas').update({ estado }).eq('id', id)
  }

  const hoy = new Date().toISOString().split('T')[0]
  const filtradas = filtro === 'all' ? reservas : reservas.filter(r => r.estado === filtro)
  const reservasHoy = reservas.filter(r => r.fecha === hoy).length
  const nuevas = reservas.filter(r => r.estado === 'nueva').length
  const confirmadas = reservas.filter(r => r.estado === 'confirmada').length
  const pendientes = reservas.filter(r => r.estado === 'pendiente').length

  function formatFecha(fecha: string) {
    const d = new Date(fecha + 'T00:00:00')
    return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  function initials(nombre: string) {
    return nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  }

  const FILTROS = [
    { key: 'all', label: 'Todas' },
    { key: 'nueva', label: 'Nuevas' },
    { key: 'pendiente', label: 'Pendientes' },
    { key: 'confirmada', label: 'Confirmadas' },
    { key: 'cancelada', label: 'Canceladas' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0f0e0c; --surface: #1a1814; --surface2: #221f1a;
          --border: #2e2b25; --gold: #c9a84c; --text: #e8e2d6; --muted: #7a7060;
          --nueva: #4a9eff; --pendiente: #f0a030; --confirmada: #4cba6a; --cancelada: #d05050;
        }
        html, body { height: 100%; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
        .layout { display: flex; height: 100vh; }
        .sidebar {
          width: 240px; flex-shrink: 0; background: var(--surface);
          border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 28px 0 24px;
        }
        .logo { padding: 0 24px 28px; border-bottom: 1px solid var(--border); }
        .logo-icon { font-size: 26px; margin-bottom: 6px; }
        .logo-name { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; color: var(--gold); line-height: 1.2; }
        .logo-sub { font-size: 11px; color: var(--muted); letter-spacing: .08em; text-transform: uppercase; margin-top: 2px; }
        .nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 4px; }
        .nav-item {
          display: flex; align-items: center; gap: 10px; padding: 10px 12px;
          border-radius: 8px; font-size: 13.5px; color: var(--muted); cursor: pointer; transition: all .15s;
        }
        .nav-item.active { background: rgba(201,168,76,.12); color: var(--gold); }
        .sidebar-footer { padding: 16px 24px 0; border-top: 1px solid var(--border); }
        .bot-status { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); }
        .dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--confirmada); box-shadow: 0 0 6px var(--confirmada); animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .topbar {
          padding: 20px 28px; border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
        }
        .page-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 500; }
        .filter-tabs {
          display: flex; background: var(--surface);
          border: 1px solid var(--border); border-radius: 8px; overflow: hidden;
        }
        .filter-tab {
          padding: 7px 14px; font-size: 12.5px; cursor: pointer; color: var(--muted);
          border: none; background: transparent; font-family: 'DM Sans', sans-serif; transition: all .15s;
        }
        .filter-tab.active { background: var(--surface2); color: var(--text); }
        .metrics {
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: 1px; background: var(--border); border-bottom: 1px solid var(--border);
        }
        .metric { background: var(--surface); padding: 20px 24px; }
        .metric-label { font-size: 11px; text-transform: uppercase; letter-spacing:.08em; color: var(--muted); margin-bottom: 6px; }
        .metric-value { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; line-height: 1; }
        .metric-sub { font-size: 11px; color: var(--muted); margin-top: 4px; }
        .table-wrap { flex: 1; overflow-y: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead { position: sticky; top: 0; background: var(--surface); z-index: 10; }
        th {
          padding: 12px 20px; text-align: left; font-size: 11px;
          text-transform: uppercase; letter-spacing:.08em; color: var(--muted);
          font-weight: 500; border-bottom: 1px solid var(--border);
        }
        tr { border-bottom: 1px solid var(--border); transition: background .1s; }
        tbody tr:hover { background: var(--surface2); }
        td { padding: 14px 20px; font-size: 13.5px; vertical-align: middle; }
        .name-cell { display: flex; align-items: center; gap: 10px; }
        .avatar {
          width: 32px; height: 32px; border-radius: 50%; background: var(--surface2);
          border: 1px solid var(--border); display: flex; align-items: center;
          justify-content: center; font-size: 13px; color: var(--gold); font-weight: 500;
        }
        .badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500;
        }
        .badge::before { content:''; width:6px; height:6px; border-radius:50%; }
        .badge.nueva { background: rgba(74,158,255,.12); color: var(--nueva); }
        .badge.nueva::before { background: var(--nueva); }
        .badge.pendiente { background: rgba(240,160,48,.12); color: var(--pendiente); }
        .badge.pendiente::before { background: var(--pendiente); }
        .badge.confirmada { background: rgba(76,186,106,.12); color: var(--confirmada); }
        .badge.confirmada::before { background: var(--confirmada); }
        .badge.cancelada { background: rgba(208,80,80,.12); color: var(--cancelada); }
        .badge.cancelada::before { background: var(--cancelada); }
        .actions { display: flex; gap: 6px; }
        .btn-action {
          padding: 5px 12px; border-radius: 6px; border: 1px solid var(--border);
          background: transparent; font-size: 12px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; color: var(--muted); transition: all .15s;
        }
        .btn-action:hover { border-color: var(--gold); color: var(--gold); }
        .btn-action.danger:hover { border-color: var(--cancelada); color: var(--cancelada); }
        .row-nueva { animation: flashNew 3s ease-out; }
        @keyframes flashNew {
          0% { background: rgba(74,158,255,.25); }
          100% { background: transparent; }
        }
        .empty { padding: 60px; text-align: center; color: var(--muted); font-size: 14px; }
        .loading { padding: 60px; text-align: center; color: var(--muted); font-size: 14px; }
        .live-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 20px; font-size: 11px;
          background: rgba(76,186,106,.12); color: var(--confirmada); margin-left: 12px;
        }
      `}</style>

      <div className="layout">
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-icon">🍷</div>
            <div className="logo-name">La Taberna<br />del Sur</div>
            <div className="logo-sub">Panel de gestión</div>
          </div>
          <nav className="nav">
            <div className="nav-item active"><span>📋</span> Reservas</div>
            <div className="nav-item"><span>📊</span> Estadísticas</div>
            <div className="nav-item"><span>⚙️</span> Configuración</div>
          </nav>
          <div className="sidebar-footer">
            <div className="bot-status">
              <div className="dot"></div>
              Bot activo · Fluxia
            </div>
          </div>
        </aside>

        <div className="main">
          <div className="topbar">
            <h1 className="page-title">
              Reservas
              <span className="live-badge"><span className="dot"></span> En vivo</span>
            </h1>
            <div className="filter-tabs">
              {FILTROS.map(f => (
                <button
                  key={f.key}
                  className={`filter-tab${filtro === f.key ? ' active' : ''}`}
                  onClick={() => setFiltro(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="metrics">
            <div className="metric">
              <div className="metric-label">Hoy</div>
              <div className="metric-value" style={{ color: 'var(--gold)' }}>{reservasHoy}</div>
              <div className="metric-sub">reservas</div>
            </div>
            <div className="metric">
              <div className="metric-label">Nuevas</div>
              <div className="metric-value" style={{ color: 'var(--nueva)' }}>{nuevas}</div>
              <div className="metric-sub">sin gestionar</div>
            </div>
            <div className="metric">
              <div className="metric-label">Confirmadas</div>
              <div className="metric-value" style={{ color: 'var(--confirmada)' }}>{confirmadas}</div>
              <div className="metric-sub">total</div>
            </div>
            <div className="metric">
              <div className="metric-label">Pendientes</div>
              <div className="metric-value" style={{ color: 'var(--pendiente)' }}>{pendientes}</div>
              <div className="metric-sub">esperando resp.</div>
            </div>
          </div>

          <div className="table-wrap">
            {loading ? (
              <div className="loading">Cargando reservas...</div>
            ) : filtradas.length === 0 ? (
              <div className="empty">No hay reservas{filtro !== 'all' ? ` con estado "${filtro}"` : ''}</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Personas</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtradas.map(r => (
                    <tr key={r.id} className={nueva === r.id ? 'row-nueva' : ''}>
                      <td>
                        <div className="name-cell">
                          <div className="avatar">{initials(r.nombre)}</div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{r.nombre}</div>
                            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.telefono}</div>
                          </div>
                        </div>
                      </td>
                      <td>👥 {r.personas}</td>
                      <td>{formatFecha(r.fecha)}</td>
                      <td>{r.hora}</td>
                      <td><span className={`badge ${r.estado}`}>
                        {{ nueva: 'Nueva', pendiente: 'Pendiente', confirmada: 'Confirmada', cancelada: 'Cancelada' }[r.estado]}
                      </span></td>
                      <td>
                        <div className="actions">
                          {r.estado !== 'confirmada' && r.estado !== 'cancelada' && (
                            <button className="btn-action" onClick={() => cambiarEstado(r.id, 'confirmada')}>Confirmar</button>
                          )}
                          {r.estado !== 'cancelada' && (
                            <button className="btn-action danger" onClick={() => cambiarEstado(r.id, 'cancelada')}>Cancelar</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
