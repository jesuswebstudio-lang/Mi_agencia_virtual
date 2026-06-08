export default function PanelPage() {
  return (
    <>
      <style>{`
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
        .logo-icon { font-size: 26px; line-height: 1; margin-bottom: 6px; }
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
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }

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
        .topbar-right { display: flex; align-items: center; gap: 12px; }

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

        .metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--border);
          border-bottom: 1px solid var(--border);
        }
        .metric { background: var(--surface); padding: 20px 24px; }
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
        .metric-sub { font-size: 11px; color: var(--muted); margin-top: 4px; }
        .metric-value.gold { color: var(--gold); }
        .metric-value.blue { color: var(--nueva); }
        .metric-value.green { color: var(--confirmada); }
        .metric-value.orange { color: var(--pendiente); }

        .table-wrap { flex: 1; overflow-y: auto; }
        table { width: 100%; border-collapse: collapse; }
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
        tr { border-bottom: 1px solid var(--border); transition: background .1s; }
        tr:last-child { border-bottom: none; }
        tbody tr:hover { background: var(--surface2); }
        td { padding: 14px 20px; font-size: 13.5px; vertical-align: middle; }

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
        .name-cell { display: flex; align-items: center; gap: 10px; }
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
        .badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; }
        .badge.nueva    { background: rgba(74,158,255,.12); color: var(--nueva); }
        .badge.nueva::before { background: var(--nueva); }
        .badge.pendiente { background: rgba(240,160,48,.12); color: var(--pendiente); }
        .badge.pendiente::before { background: var(--pendiente); }
        .badge.confirmada { background: rgba(76,186,106,.12); color: var(--confirmada); }
        .badge.confirmada::before { background: var(--confirmada); }
        .badge.cancelada { background: rgba(208,80,80,.12); color: var(--cancelada); }
        .badge.cancelada::before { background: var(--cancelada); }

        .people-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; }

        .actions { display: flex; gap: 6px; }
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

        @media (max-width: 768px) {
          .sidebar { display: none; }
          .topbar { display: none; }
          .metrics { display: none; }
          .table-wrap { display: none; }
          body { flex-direction: column; }
          .main { height: 100dvh; overflow: hidden; }
        }
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">🍷</div>
          <div className="logo-name">La Taberna<br />del Sur</div>
          <div className="logo-sub">Panel de gestión</div>
        </div>
        <nav className="nav">
          <div className="nav-item active"><span className="nav-icon">📋</span> Reservas</div>
          <div className="nav-item"><span className="nav-icon">📊</span> Estadísticas</div>
          <div className="nav-item"><span className="nav-icon">⚙️</span> Configuración</div>
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
          <h1 className="page-title">Reservas</h1>
          <div className="topbar-right">
            <div className="filter-tabs" id="filterTabs">
              <button className="filter-tab active" data-filter="all">Todas</button>
              <button className="filter-tab" data-filter="nueva">Nuevas</button>
              <button className="filter-tab" data-filter="pendiente">Pendientes</button>
              <button className="filter-tab" data-filter="confirmada">Confirmadas</button>
              <button className="filter-tab" data-filter="cancelada">Canceladas</button>
            </div>
          </div>
        </div>

        <div className="metrics" id="metricsRow"></div>

        <div className="table-wrap" id="tableWrap">
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
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        const today = new Date();
        const fmt = d => d.toLocaleDateString('es-ES', { weekday:'short', day:'numeric', month:'short' });
        function daysFromNow(n) { const d = new Date(today); d.setDate(d.getDate() + n); return fmt(d); }

        let reservas = [
          { id:1, nombre:'María García',   personas:2, fecha: daysFromNow(0), hora:'14:00', estado:'confirmada' },
          { id:2, nombre:'Carlos Ruiz',    personas:4, fecha: daysFromNow(0), hora:'14:30', estado:'nueva' },
          { id:3, nombre:'Ana Martínez',   personas:6, fecha: daysFromNow(0), hora:'21:00', estado:'pendiente' },
          { id:4, nombre:'Luis Fernández', personas:3, fecha: daysFromNow(0), hora:'21:30', estado:'nueva' },
          { id:5, nombre:'Sofía López',    personas:2, fecha: daysFromNow(1), hora:'14:00', estado:'nueva' },
          { id:6, nombre:'Jorge Sánchez',  personas:5, fecha: daysFromNow(1), hora:'21:00', estado:'confirmada' },
          { id:7, nombre:'Elena Torres',   personas:4, fecha: daysFromNow(2), hora:'14:30', estado:'nueva' },
          { id:8, nombre:'Pablo Moreno',   personas:2, fecha: daysFromNow(-1),hora:'21:00', estado:'cancelada' },
        ];

        let currentFilter = 'all';

        function estadoBadge(e) {
          const labels = { nueva:'Nueva', pendiente:'Pendiente', confirmada:'Confirmada', cancelada:'Cancelada' };
          return '<span class="badge ' + e + '">' + labels[e] + '</span>';
        }
        function initials(name) { return name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase(); }
        function filtered() { return currentFilter === 'all' ? reservas : reservas.filter(r => r.estado === currentFilter); }

        function renderMetrics() {
          const todayStr = fmt(today);
          const hoy = reservas.filter(r => r.fecha === todayStr);
          const nuevas = reservas.filter(r=>r.estado==='nueva').length;
          const confirmadas = reservas.filter(r=>r.estado==='confirmada').length;
          const pendientes = reservas.filter(r=>r.estado==='pendiente').length;
          document.getElementById('metricsRow').innerHTML =
            '<div class="metric"><div class="metric-label">Hoy</div><div class="metric-value gold">' + hoy.length + '</div><div class="metric-sub">reservas</div></div>' +
            '<div class="metric"><div class="metric-label">Nuevas</div><div class="metric-value blue">' + nuevas + '</div><div class="metric-sub">sin gestionar</div></div>' +
            '<div class="metric"><div class="metric-label">Confirmadas</div><div class="metric-value green">' + confirmadas + '</div><div class="metric-sub">total</div></div>' +
            '<div class="metric"><div class="metric-label">Pendientes</div><div class="metric-value orange">' + pendientes + '</div><div class="metric-sub">esperando resp.</div></div>';
        }

        function renderTable() {
          document.getElementById('tableBody').innerHTML = filtered().map(r =>
            '<tr>' +
            '<td><div class="name-cell"><div class="avatar">' + initials(r.nombre) + '</div><span class="name-text">' + r.nombre + '</span></div></td>' +
            '<td><span class="people-badge">👥 ' + r.personas + '</span></td>' +
            '<td>' + r.fecha + '</td>' +
            '<td>' + r.hora + '</td>' +
            '<td>' + estadoBadge(r.estado) + '</td>' +
            '<td><div class="actions">' +
            (r.estado !== 'confirmada' && r.estado !== 'cancelada' ? '<button class="btn-action" onclick="changeEstado(' + r.id + ',\'confirmada\')">Confirmar</button>' : '') +
            (r.estado !== 'cancelada' ? '<button class="btn-action danger" onclick="changeEstado(' + r.id + ',\'cancelada\')">Cancelar</button>' : '') +
            '</div></td></tr>'
          ).join('');
        }

        window.changeEstado = function(id, newEstado) {
          reservas = reservas.map(r => r.id === id ? {...r, estado: newEstado} : r);
          renderMetrics(); renderTable();
        };

        document.getElementById('filterTabs').querySelectorAll('[data-filter]').forEach(btn => {
          btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            document.querySelectorAll('#filterTabs .filter-tab').forEach(b => b.classList.toggle('active', b.dataset.filter === currentFilter));
            renderTable();
          });
        });

        renderMetrics();
        renderTable();

        setTimeout(() => {
          reservas.unshift({ id:99, nombre:'Demo — Reserva en vivo', personas:3, fecha: daysFromNow(0), hora:'22:00', estado:'nueva' });
          renderMetrics(); renderTable();
        }, 4000);
      `}} />
    </>
  );
}
