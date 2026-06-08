<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Panel de Reservas — La Taberna del Sur</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:        #0f0e0c;
      --surface:   #1a1814;
      --surface2:  #221f1a;
      --border:    #2e2b25;
      --gold:      #c9a84c;
      --gold-dim:  #8a6f2e;
      --text:      #e8e2d6;
      --muted:     #7a7060;
      --nueva:     #4a9eff;
      --pendiente: #f0a030;
      --confirmada:#4cba6a;
      --cancelada: #d05050;
      --radius:    12px;
    }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
    }

    /* ── SIDEBAR ─────────────────────────────────── */
    .sidebar {
      width: 240px;
      flex-shrink: 0;
      background: var(--surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      padding: 28px 0 24px;
    }

    .logo {
      padding: 0 24px 28px;
      border-bottom: 1px solid var(--border);
    }
    .logo-icon {
      font-size: 26px;
      line-height: 1;
      margin-bottom: 6px;
    }
    .logo-name {
      font-family: 'Playfair Display', serif;
      font-size: 15px;
      font-weight: 700;
      color: var(--gold);
      line-height: 1.2;
    }
    .logo-sub {
      font-size: 11px;
      color: var(--muted);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-top: 2px;
    }

    .nav {
      flex: 1;
      padding: 20px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 13.5px;
      color: var(--muted);
      cursor: pointer;
      transition: all .15s;
      user-select: none;
    }
    .nav-item:hover { background: var(--surface2); color: var(--text); }
    .nav-item.active { background: rgba(201,168,76,.12); color: var(--gold); }
    .nav-icon { font-size: 16px; width: 20px; text-align: center; }

    .sidebar-footer {
      padding: 16px 24px 0;
      border-top: 1px solid var(--border);
    }
    .bot-status {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--muted);
    }
    .dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: var(--confirmada);
      box-shadow: 0 0 6px var(--confirmada);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%,100% { opacity:1; } 50% { opacity:.4; }
    }

    /* ── MAIN ────────────────────────────────────── */
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .topbar {
      padding: 20px 28px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .page-title {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      font-weight: 500;
    }
    .topbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .filter-tabs {
      display: flex;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
    }
    .filter-tab {
      padding: 7px 14px;
      font-size: 12.5px;
      cursor: pointer;
      color: var(--muted);
      border: none;
      background: transparent;
      font-family: 'DM Sans', sans-serif;
      transition: all .15s;
    }
    .filter-tab.active { background: var(--surface2); color: var(--text); }
    .filter-tab:hover:not(.active) { color: var(--text); }

    /* ── METRICS ─────────────────────────────────── */
    .metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1px;
      background: var(--border);
      border-bottom: 1px solid var(--border);
    }
    .metric {
      background: var(--surface);
      padding: 20px 24px;
    }
    .metric-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .08em;
      color: var(--muted);
      margin-bottom: 6px;
    }
    .metric-value {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
    }
    .metric-sub {
      font-size: 11px;
      color: var(--muted);
      margin-top: 4px;
    }
    .metric-value.gold { color: var(--gold); }
    .metric-value.blue { color: var(--nueva); }
    .metric-value.green { color: var(--confirmada); }
    .metric-value.orange { color: var(--pendiente); }

    /* ── TABLE ───────────────────────────────────── */
    .table-wrap {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }
    thead {
      position: sticky;
      top: 0;
      background: var(--surface);
      z-index: 10;
    }
    th {
      padding: 12px 20px;
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .08em;
      color: var(--muted);
      font-weight: 500;
      border-bottom: 1px solid var(--border);
    }
    tr {
      border-bottom: 1px solid var(--border);
      transition: background .1s;
    }
    tr:last-child { border-bottom: none; }
    tbody tr:hover { background: var(--surface2); }
    td {
      padding: 14px 20px;
      font-size: 13.5px;
      vertical-align: middle;
    }

    .avatar {
      width: 32px; height: 32px;
      border-radius: 50%;
      background: var(--surface2);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      color: var(--gold);
      font-weight: 500;
      flex-shrink: 0;
    }
    .name-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .name-text { font-weight: 500; }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    .badge::before {
      content: '';
      width: 6px; height: 6px;
      border-radius: 50%;
    }
    .badge.nueva    { background: rgba(74,158,255,.12); color: var(--nueva); }
    .badge.nueva::before { background: var(--nueva); }
    .badge.pendiente { background: rgba(240,160,48,.12); color: var(--pendiente); }
    .badge.pendiente::before { background: var(--pendiente); }
    .badge.confirmada { background: rgba(76,186,106,.12); color: var(--confirmada); }
    .badge.confirmada::before { background: var(--confirmada); }
    .badge.cancelada { background: rgba(208,80,80,.12); color: var(--cancelada); }
    .badge.cancelada::before { background: var(--cancelada); }

    .people-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: var(--text);
    }

    .actions {
      display: flex;
      gap: 6px;
    }
    .btn-action {
      padding: 5px 12px;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: transparent;
      font-size: 12px;
      cursor: pointer;
      font-family: 'DM Sans', sans-serif;
      color: var(--muted);
      transition: all .15s;
    }
    .btn-action:hover { border-color: var(--gold); color: var(--gold); }
    .btn-action.danger:hover { border-color: var(--cancelada); color: var(--cancelada); }

    /* ── MOBILE ──────────────────────────────────── */
    .mobile-header { display: none; }
    .mobile-nav    { display: none; }
    .cards-list    { display: none; }

    @media (max-width: 768px) {
      .sidebar    { display: none; }
      .topbar     { display: none; }
      .metrics    { display: none; }
      .table-wrap { display: none; }
      .mobile-header { display: flex; }
      .mobile-nav    { display: flex; }
      .cards-list    { display: flex; }

      body { flex-direction: column; background: var(--bg); }
      .main { height: 100dvh; overflow: hidden; }

      .mobile-header {
        background: var(--surface);
        border-bottom: 1px solid var(--border);
        padding: 16px 20px;
        align-items: center;
        justify-content: space-between;
      }
      .mobile-logo {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .mobile-logo-text {
        font-family: 'Playfair Display', serif;
        font-size: 15px;
        color: var(--gold);
      }

      .mobile-metrics {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1px;
        background: var(--border);
        border-bottom: 1px solid var(--border);
      }
      .mobile-metric {
        background: var(--surface);
        padding: 14px 16px;
      }
      .mobile-metric-label {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: .08em;
        color: var(--muted);
        margin-bottom: 4px;
      }
      .mobile-metric-value {
        font-family: 'Playfair Display', serif;
        font-size: 24px;
        font-weight: 700;
      }

      .mobile-filter {
        padding: 12px 16px;
        border-bottom: 1px solid var(--border);
        display: flex;
        gap: 8px;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      .mobile-filter::-webkit-scrollbar { display: none; }
      .mf-tab {
        padding: 6px 14px;
        border-radius: 20px;
        border: 1px solid var(--border);
        background: transparent;
        font-size: 12px;
        color: var(--muted);
        cursor: pointer;
        white-space: nowrap;
        font-family: 'DM Sans', sans-serif;
        flex-shrink: 0;
        transition: all .15s;
      }
      .mf-tab.active { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,.08); }

      .cards-list {
        flex: 1;
        flex-direction: column;
        gap: 0;
        overflow-y: auto;
        padding: 0 0 80px;
      }
      .card {
        background: var(--surface);
        border-bottom: 1px solid var(--border);
        padding: 16px 20px;
      }
      .card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .card-name {
        font-weight: 500;
        font-size: 15px;
      }
      .card-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 12px;
        font-size: 13px;
        color: var(--muted);
      }
      .card-detail { display: flex; align-items: center; gap: 6px; }
      .card-actions { display: flex; gap: 8px; }
      .card-btn {
        flex: 1;
        padding: 8px;
        border-radius: 8px;
        border: 1px solid var(--border);
        background: transparent;
        font-size: 12.5px;
        cursor: pointer;
        font-family: 'DM Sans', sans-serif;
        color: var(--muted);
        text-align: center;
        transition: all .15s;
      }
      .card-btn:hover { border-color: var(--gold); color: var(--gold); }
      .card-btn.danger:hover { border-color: var(--cancelada); color: var(--cancelada); }

      .mobile-nav {
        position: fixed;
        bottom: 0; left: 0; right: 0;
        background: var(--surface);
        border-top: 1px solid var(--border);
        padding: 10px 0 calc(10px + env(safe-area-inset-bottom));
        justify-content: space-around;
        z-index: 100;
      }
      .mnav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        font-size: 10px;
        color: var(--muted);
        cursor: pointer;
        padding: 4px 16px;
      }
      .mnav-item.active { color: var(--gold); }
      .mnav-icon { font-size: 20px; }
    }
  </style>
</head>
<body>

<!-- ── SIDEBAR (desktop) ───────────────────────── -->
<aside class="sidebar">
  <div class="logo">
    <div class="logo-icon">🍷</div>
    <div class="logo-name">La Taberna<br>del Sur</div>
    <div class="logo-sub">Panel de gestión</div>
  </div>
  <nav class="nav">
    <div class="nav-item active"><span class="nav-icon">📋</span> Reservas</div>
    <div class="nav-item"><span class="nav-icon">📊</span> Estadísticas</div>
    <div class="nav-item"><span class="nav-icon">⚙️</span> Configuración</div>
  </nav>
  <div class="sidebar-footer">
    <div class="bot-status">
      <div class="dot"></div>
      Bot activo · Fluxia
    </div>
  </div>
</aside>

<!-- ── MAIN ───────────────────────────────────── -->
<div class="main">

  <!-- Mobile header -->
  <header class="mobile-header">
    <div class="mobile-logo">
      <span style="font-size:22px">🍷</span>
      <span class="mobile-logo-text">La Taberna del Sur</span>
    </div>
    <div class="dot" style="margin-left:auto"></div>
  </header>

  <!-- Mobile metrics -->
  <div class="mobile-metrics" id="mobileMetrics" style="display:none"></div>

  <!-- Desktop topbar -->
  <div class="topbar">
    <h1 class="page-title">Reservas</h1>
    <div class="topbar-right">
      <div class="filter-tabs" id="filterTabs">
        <button class="filter-tab active" data-filter="all">Todas</button>
        <button class="filter-tab" data-filter="nueva">Nuevas</button>
        <button class="filter-tab" data-filter="pendiente">Pendientes</button>
        <button class="filter-tab" data-filter="confirmada">Confirmadas</button>
        <button class="filter-tab" data-filter="cancelada">Canceladas</button>
      </div>
    </div>
  </div>

  <!-- Metrics row (desktop) -->
  <div class="metrics" id="metricsRow"></div>

  <!-- Mobile filter -->
  <div class="mobile-filter" id="mobileFilter" style="display:none">
    <button class="mf-tab active" data-filter="all">Todas</button>
    <button class="mf-tab" data-filter="nueva">Nuevas</button>
    <button class="mf-tab" data-filter="pendiente">Pendientes</button>
    <button class="mf-tab" data-filter="confirmada">Confirmadas</button>
    <button class="mf-tab" data-filter="cancelada">Canceladas</button>
  </div>

  <!-- Desktop table -->
  <div class="table-wrap" id="tableWrap">
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
      <tbody id="tableBody"></tbody>
    </table>
  </div>

  <!-- Mobile cards -->
  <div class="cards-list" id="cardsList"></div>

  <!-- Mobile bottom nav -->
  <nav class="mobile-nav">
    <div class="mnav-item active"><div class="mnav-icon">📋</div>Reservas</div>
    <div class="mnav-item"><div class="mnav-icon">📊</div>Stats</div>
    <div class="mnav-item"><div class="mnav-icon">⚙️</div>Config</div>
  </nav>
</div>

<script>
// ── DATOS DEMO ─────────────────────────────────────────────────────────────
const today = new Date()
const fmt = d => d.toLocaleDateString('es-ES', { weekday:'short', day:'numeric', month:'short' })

function daysFromNow(n) {
  const d = new Date(today)
  d.setDate(d.getDate() + n)
  return fmt(d)
}

let reservas = [
  { id:1, nombre:'María García',     personas:2, fecha: daysFromNow(0), hora:'14:00', estado:'confirmada' },
  { id:2, nombre:'Carlos Ruiz',      personas:4, fecha: daysFromNow(0), hora:'14:30', estado:'nueva' },
  { id:3, nombre:'Ana Martínez',     personas:6, fecha: daysFromNow(0), hora:'21:00', estado:'pendiente' },
  { id:4, nombre:'Luis Fernández',   personas:3, fecha: daysFromNow(0), hora:'21:30', estado:'nueva' },
  { id:5, nombre:'Sofía López',      personas:2, fecha: daysFromNow(1), hora:'14:00', estado:'nueva' },
  { id:6, nombre:'Jorge Sánchez',    personas:5, fecha: daysFromNow(1), hora:'21:00', estado:'confirmada' },
  { id:7, nombre:'Elena Torres',     personas:4, fecha: daysFromNow(2), hora:'14:30', estado:'nueva' },
  { id:8, nombre:'Pablo Moreno',     personas:2, fecha: daysFromNow(-1),hora:'21:00', estado:'cancelada' },
]

let currentFilter = 'all'

// ── HELPERS ────────────────────────────────────────────────────────────────
function estadoBadge(e) {
  const labels = { nueva:'Nueva', pendiente:'Pendiente', confirmada:'Confirmada', cancelada:'Cancelada' }
  return `<span class="badge ${e}">${labels[e]}</span>`
}

function initials(name) {
  return name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()
}

function filtered() {
  if (currentFilter === 'all') return reservas
  return reservas.filter(r => r.estado === currentFilter)
}

// ── METRICS ────────────────────────────────────────────────────────────────
function renderMetrics() {
  const todayStr = fmt(today)
  const hoy = reservas.filter(r => r.fecha === todayStr)
  const total = reservas.length
  const confirmadas = reservas.filter(r=>r.estado==='confirmada').length
  const pendientes  = reservas.filter(r=>r.estado==='pendiente').length
  const nuevas      = reservas.filter(r=>r.estado==='nueva').length

  document.getElementById('metricsRow').innerHTML = `
    <div class="metric"><div class="metric-label">Hoy</div><div class="metric-value gold">${hoy.length}</div><div class="metric-sub">reservas</div></div>
    <div class="metric"><div class="metric-label">Nuevas</div><div class="metric-value blue">${nuevas}</div><div class="metric-sub">sin gestionar</div></div>
    <div class="metric"><div class="metric-label">Confirmadas</div><div class="metric-value green">${confirmadas}</div><div class="metric-sub">total</div></div>
    <div class="metric"><div class="metric-label">Pendientes</div><div class="metric-value orange">${pendientes}</div><div class="metric-sub">esperando resp.</div></div>
  `
  document.getElementById('mobileMetrics').innerHTML = `
    <div class="mobile-metric"><div class="mobile-metric-label">Hoy</div><div class="mobile-metric-value" style="color:var(--gold)">${hoy.length}</div></div>
    <div class="mobile-metric"><div class="mobile-metric-label">Nuevas</div><div class="mobile-metric-value" style="color:var(--nueva)">${nuevas}</div></div>
    <div class="mobile-metric"><div class="mobile-metric-label">Confirmadas</div><div class="mobile-metric-value" style="color:var(--confirmada)">${confirmadas}</div></div>
    <div class="mobile-metric"><div class="mobile-metric-label">Pendientes</div><div class="mobile-metric-value" style="color:var(--pendiente)">${pendientes}</div></div>
  `
}

// ── TABLE ──────────────────────────────────────────────────────────────────
function renderTable() {
  const rows = filtered()
  document.getElementById('tableBody').innerHTML = rows.map(r => `
    <tr>
      <td><div class="name-cell"><div class="avatar">${initials(r.nombre)}</div><span class="name-text">${r.nombre}</span></div></td>
      <td><span class="people-badge">👥 ${r.personas}</span></td>
      <td>${r.fecha}</td>
      <td>${r.hora}</td>
      <td>${estadoBadge(r.estado)}</td>
      <td>
        <div class="actions">
          ${r.estado !== 'confirmada' && r.estado !== 'cancelada'
            ? `<button class="btn-action" onclick="changeEstado(${r.id},'confirmada')">Confirmar</button>` : ''}
          ${r.estado !== 'cancelada'
            ? `<button class="btn-action danger" onclick="changeEstado(${r.id},'cancelada')">Cancelar</button>` : ''}
        </div>
      </td>
    </tr>
  `).join('')
}

// ── CARDS (mobile) ─────────────────────────────────────────────────────────
function renderCards() {
  const rows = filtered()
  document.getElementById('cardsList').innerHTML = rows.map(r => `
    <div class="card">
      <div class="card-top">
        <div class="card-name">${r.nombre}</div>
        ${estadoBadge(r.estado)}
      </div>
      <div class="card-details">
        <div class="card-detail">👥 ${r.personas} personas</div>
        <div class="card-detail">🕐 ${r.hora}</div>
        <div class="card-detail" style="grid-column:span 2">📅 ${r.fecha}</div>
      </div>
      <div class="card-actions">
        ${r.estado !== 'confirmada' && r.estado !== 'cancelada'
          ? `<button class="card-btn" onclick="changeEstado(${r.id},'confirmada')">✓ Confirmar</button>` : ''}
        ${r.estado !== 'cancelada'
          ? `<button class="card-btn danger" onclick="changeEstado(${r.id},'cancelada')">✕ Cancelar</button>` : ''}
      </div>
    </div>
  `).join('')
}

// ── ACTIONS ────────────────────────────────────────────────────────────────
function changeEstado(id, newEstado) {
  reservas = reservas.map(r => r.id === id ? {...r, estado: newEstado} : r)
  renderAll()
}

function renderAll() {
  renderMetrics()
  renderTable()
  renderCards()
}

// ── RESPONSIVE ─────────────────────────────────────────────────────────────
function applyLayout() {
  const mobile = window.innerWidth <= 768
  document.getElementById('mobileMetrics').style.display = mobile ? 'grid' : 'none'
  document.getElementById('mobileFilter').style.display  = mobile ? 'flex' : 'none'
}

// ── FILTER TABS ─────────────────────────────────────────────────────────────
function setupFilters(containerId) {
  document.getElementById(containerId).querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter
      // desktop
      document.querySelectorAll('#filterTabs .filter-tab').forEach(b => b.classList.toggle('active', b.dataset.filter === currentFilter))
      // mobile
      document.querySelectorAll('#mobileFilter .mf-tab').forEach(b => b.classList.toggle('active', b.dataset.filter === currentFilter))
      renderTable()
      renderCards()
    })
  })
}

// ── INIT ────────────────────────────────────────────────────────────────────
setupFilters('filterTabs')
setupFilters('mobileFilter')
applyLayout()
renderAll()
window.addEventListener('resize', applyLayout)

// Simular llegada de nueva reserva tras 4s (demo)
setTimeout(() => {
  reservas.unshift({
    id: 99,
    nombre: 'Demo — Reserva en vivo',
    personas: 3,
    fecha: daysFromNow(0),
    hora: '22:00',
    estado: 'nueva'
  })
  renderAll()
}, 4000)
</script>
</body>
</html>
