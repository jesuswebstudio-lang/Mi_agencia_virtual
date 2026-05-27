// app/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";

// ─── DATOS ────────────────────────────────────────────────────────────────────
const PAINS = [
  { n: "01", title: "Pierdes reservas fuera de horario", desc: "Si no contestas el WhatsApp a las 23h, esa mesa la reserva el restaurante de al lado." },
  { n: "02", title: "Tu equipo no puede hacer dos cosas a la vez", desc: "Mientras sirven mesas o cortan el pelo, los mensajes se acumulan sin respuesta." },
  { n: "03", title: "Siempre las mismas preguntas", desc: "Horarios, carta, precios, disponibilidad. Tu equipo las repite decenas de veces al día." },
  { n: "04", title: "Los clientes no esperan", desc: "Si no reciben respuesta en minutos, buscan otra opción. La inmediatez ya no es un extra." },
  { n: "05", title: "Reservas gestionadas a mano", desc: "Cuadernos, hojas de Excel, notas de voz. Un error y tienes dos clientes en la misma mesa." },
  { n: "06", title: "Sin tiempo para crecer", desc: "Estás apagando fuegos todo el día. No hay espacio para marketing, fidelización ni expansión." },
];

const PILLARS = [
  { num: "Pilar 01", title: "Atención 24/7", desc: "Un asistente inteligente por WhatsApp que responde, reserva y gestiona sin que nadie intervenga.", feats: ["Responde en segundos, a cualquier hora", "Entiende lenguaje natural, no comandos", "Escala sin límite, sin contratar a nadie"] },
  { num: "Pilar 02", title: "Reservas automáticas", desc: "El sistema confirma, recuerda y gestiona cancelaciones solo. Sin cuadernos, sin errores.", feats: ["Confirmación instantánea al cliente", "Recordatorio automático 24h antes", "Gestión de cancelaciones y lista de espera"] },
  { num: "Pilar 03", title: "Tu negocio siempre activo", desc: "Mientras tu equipo se centra en dar el mejor servicio, Fluxia gestiona el resto en segundo plano.", feats: ["Menos tiempo en tareas repetitivas", "Más espacio para crecer y fidelizar", "Sin formación técnica para tu equipo"] },
];

const STEPS = [
  { n: "0", opt: true,  tag: "Opcional · Solo Fluxia Pro", title: "Tu presencia online",      desc: "¿Sin web o necesitas renovarla? La creamos como parte del pack, adaptada a tu negocio.", pill: "Solo con Fluxia Pro" },
  { n: "1", opt: false, tag: "30 minutos",                 title: "Cuéntanos tu negocio",      desc: "Una llamada de 30 minutos. Analizamos tu negocio y diseñamos el sistema a tu medida." },
  { n: "2", opt: false, tag: "Tú no haces nada",           title: "Configuramos todo",          desc: "Nuestro equipo instala y configura Fluxia en tu WhatsApp sin que tengas que intervenir." },
  { n: "3", opt: false, tag: "Menos de 48 horas",          title: "Piloto automático",          desc: "Tu asistente ya atiende clientes, gestiona reservas y trabaja por ti las 24 horas." },
];

type SectorKey = "r" | "p" | "h";

const SECTORES: Record<SectorKey, { label: string; title: string; italic: string; desc: string; feats: string[]; chat: { in: boolean; text: string }[]; ts: string }> = {
  r: {
    label: "Restaurantes", title: "Restaurantes", italic: "sin reservas perdidas.",
    desc: "Tus mesas siempre ocupadas, tu equipo siempre libre para dar el mejor servicio.",
    feats: ["Reservas automáticas sin intervención del personal", "Gestión de lista de espera en tiempo real", "Respuestas sobre carta, horarios y alergias", "Respuesta automática a reseñas de Google", "Recordatorio al cliente 24h antes"],
    chat: [{ in: true, text: "Hola, ¿tenéis mesa para 2 el viernes por la noche?" }, { in: false, text: "¡Hola! Sí. ¿Prefieres a las 20:30 o a las 22:00?" }, { in: true, text: "A las 21h si puede ser" }, { in: false, text: "Mesa para 2 el viernes a las 21:00 confirmada. Te recuerdo el jueves. ¡Hasta entonces!" }],
    ts: "Respondido en 3 segundos · 02:14 AM",
  },
  p: {
    label: "Peluquerías", title: "Peluquerías", italic: "sin huecos vacíos.",
    desc: "Citas gestionadas solas, no-shows reducidos y clientes que vuelven sin que tengas que llamarlos.",
    feats: ["Reserva eligiendo empleado y servicio por WhatsApp", "Recordatorio automático 24h antes", "Lista de espera si no hay hueco disponible", "Seguimiento post-visita para fidelizar clientes", "Promociones automáticas a clientes inactivos"],
    chat: [{ in: true, text: "Quiero pedir cita para corte y color con Laura" }, { in: false, text: "Laura tiene hueco el jueves a las 11:00 o el sábado a las 10:30. ¿Cuál te viene mejor?" }, { in: true, text: "El jueves perfecto" }, { in: false, text: "Cita con Laura el jueves a las 11:00 confirmada. Te recuerdo el miércoles. ¡Hasta entonces!" }],
    ts: "Respondido en 2 segundos · 11:47 PM",
  },
  h: {
    label: "Hookahs", title: "Hookahs", italic: "sin caos en grupos.",
    desc: "Grupos grandes, múltiples cabinas, dudas sobre sabores y normas. Todo gestionado antes de que lleguen.",
    feats: ["Reserva de cabina o zona para grupos por WhatsApp", "Información automática sobre sabores, precios y normas", "Gestión de lista de espera en tiempo real", "Confirmación de asistencia para grupos grandes", "Promociones automáticas para grupos y eventos"],
    chat: [{ in: true, text: "Somos 8 personas el sábado, ¿tenéis cabina?" }, { in: false, text: "¡Hola! Sí. El sábado hay hueco a las 21:00 y a las 23:00. ¿Cuál preferís?" }, { in: true, text: "A las 21h. ¿Qué sabores tenéis?" }, { in: false, text: "Reserva para 8 a las 21:00 confirmada. Os mando la carta de sabores y las normas del local." }],
    ts: "Respondido en 4 segundos · 01:32 AM",
  },
};

const AUTO_PLANS = [
  { name: "Starter", monthly: 49,  annual: 41,  popular: false, feats: ["WhatsApp bot con IA", "Reservas automáticas", "Respuestas a preguntas frecuentes"] },
  { name: "Pro",     monthly: 89,  annual: 75,  popular: true,  feats: ["Todo lo del plan Starter", "Recordatorios automáticos", "Respuesta a reseñas Google"] },
  { name: "Elite",   monthly: 149, annual: 126, popular: false, feats: ["Todo lo del plan Pro", "Analytics avanzado", "Soporte prioritario 24/7"] },
];

const PRO_PLANS = [
  { name: "Starter", monthly: 49,  annual: 41,  setup: "€799",   popular: false, feats: ["Web profesional incluida", "Fluxia Auto Starter", "Dominio y hosting"] },
  { name: "Pro",     monthly: 89,  annual: 75,  setup: "€1.199", popular: true,  feats: ["Web premium a medida", "Fluxia Auto Pro completo", "SEO local optimizado"] },
  { name: "Elite",   monthly: 149, annual: 126, setup: "€1.799", popular: false, feats: ["Web a medida completa", "Fluxia Auto Elite", "Soporte prioritario 24/7"] },
];

type DemoSector = "restaurante" | "peluqueria" | "hookah";

const DEMO_SECTORS: Record<DemoSector, { name: string; welcome: string; sugs: string[]; system: string }> = {
  restaurante: {
    name: "Restaurante Demo",
    welcome: "¡Hola! Soy el asistente de Restaurante Demo. Puedo ayudarte a reservar mesa, informarte sobre la carta, horarios o gestionar tu reserva. ¿En qué te puedo ayudar?",
    sugs: ["Quiero reservar mesa", "¿Qué horarios tenéis?", "¿Tenéis menú del día?", "Cancelar mi reserva"],
    system: "Eres el asistente de WhatsApp de un restaurante español llamado 'Restaurante Demo'. Gestiona reservas de mesa, informa sobre horarios (martes a domingo, 13:00-16:00 y 20:00-23:30), carta (cocina mediterránea, menú del día 14€) y responde FAQs. Si alguien quiere reservar, pide: número de personas, día y hora. Confirma siempre con amabilidad. Responde en español, conciso y natural, como en WhatsApp. Máximo 3 frases.",
  },
  peluqueria: {
    name: "Peluquería Demo",
    welcome: "¡Hola! Soy el asistente de Peluquería Demo. Puedo ayudarte a reservar cita, elegir servicio y estilista, o resolver tus dudas. ¿Qué necesitas?",
    sugs: ["Quiero pedir cita", "¿Qué servicios ofrecéis?", "¿Cuánto cuesta un corte?", "Cambiar mi cita"],
    system: "Eres el asistente de WhatsApp de una peluquería llamada 'Peluquería Demo'. Gestiona citas (lunes a sábado, 9:00-20:00), informa sobre servicios (corte mujer 25€, corte hombre 15€, tinte desde 45€, mechas desde 60€) and estilistas (Laura, Carlos, Ana). Si alguien quiere cita, pide: servicio, estilista y horario. Responde en español, conciso y natural. Máximo 3 frases.",
  },
  hookah: {
    name: "Hookah Demo",
    welcome: "¡Hola! Soy el asistente de Hookah Demo. Puedo ayudarte a reservar cabina, informarte sobre sabores, precios y normas del local. ¿En qué te ayudo?",
    sugs: ["Reservar cabina para hoy", "¿Qué sabores tenéis?", "¿Cuánto cuesta la entrada?", "Reserva para grupo"],
    system: "Eres el asistente de WhatsApp de un hookah lounge llamado 'Hookah Demo'. Gestiona reservas de cabinas (jueves a domingo, 20:00-3:00), informa sobre sabores (más de 30: menta, tropical, doble manzana…), precios (entrada libre, cachimba desde 15€, cabina privada desde 40€) y normas (+18, sin comida externa). Si quieren reservar, pide personas, día y hora. Responde en español, conciso. Máximo 3 frases.",
  },
};

// ─── COMPONENTES COMPARTIDOS ──────────────────────────────────────────────────
function Check() {
  return (
    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[11px] font-medium tracking-[1.1px] uppercase text-zinc-500 mb-4">
      <span className="w-5 h-px bg-zinc-700 inline-block" />
      {children}
    </p>
  );
}

function PlanCard({ plan, annual, cta }: { plan: (typeof AUTO_PLANS)[0] & { setup?: string }; annual: boolean; cta: string }) {
  const price = annual ? plan.annual : plan.monthly;
  return (
    <div className={`relative rounded-xl p-6 flex flex-col gap-4 border ${plan.popular ? "border-emerald-500/30 bg-emerald-950/20" : "border-white/8 bg-white/2"}`}>
      {plan.popular && <span className="absolute top-0 right-4 bg-emerald-600 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-b-md">Más popular</span>}
      <p className="text-xs font-medium tracking-wide uppercase text-zinc-400">{plan.name}</p>
      <div>
        <p className="text-3xl font-medium text-white tracking-tight">€{price}<span className="text-sm font-normal text-zinc-400">/mes</span></p>
        {plan.setup && <p className="text-xs text-zinc-500 mt-0.5">+ {plan.setup} setup único</p>}
        <p className="text-xs text-zinc-600 mt-0.5">{annual ? "Facturado anualmente" : "Facturado mensualmente"}</p>
      </div>
      <ul className="flex flex-col gap-2">
        {plan.feats.map((f) => <li key={f} className="flex items-start gap-2 text-[13px] text-zinc-400"><Check />{f}</li>)}
      </ul>
      <button className={`mt-auto py-2.5 rounded-lg text-sm font-medium transition-all ${plan.popular ? "bg-emerald-600 text-white hover:bg-emerald-700" : "border border-white/12 text-zinc-400 hover:border-white/25 hover:text-white bg-transparent"}`}>
        {cta}
      </button>
    </div>
  );
}

// ─── SECCIONES ────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative bg-[#0A0A0A] overflow-hidden pb-20">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
      <div className="absolute -top-20 -right-20 w-[500px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(29,158,117,0.12) 0%, transparent 70%)" }} />
      <nav className="relative z-10 flex items-center justify-between px-12 py-7">
        <span className="font-serif text-xl text-white">Flux<span className="text-emerald-500">ia</span></span>
        <ul className="flex items-center gap-8 list-none">
          {["Cómo funciona", "Sectores", "Precios"].map((l) => (
            <li key={l}><a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors no-underline">{l}</a></li>
          ))}
          <li><a href="#contacto" className="text-sm font-medium bg-emerald-600 text-white px-5 py-2 rounded-md hover:bg-emerald-700 transition-colors no-underline">Solicitar demo</a></li>
        </ul>
      </nav>
      <div className="relative z-10 max-w-3xl mx-auto text-center px-6 pt-20">
        <div className="inline-flex items-center gap-2 bg-emerald-950/50 border border-emerald-500/25 text-emerald-400 text-[11px] font-medium tracking-widest uppercase px-4 py-1.5 rounded-full mb-9">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Disponible en 48 horas
        </div>
        <h1 className="font-serif text-5xl leading-[1.1] tracking-tight text-white mb-6">
          El sistema que gestiona tu negocio{" "}
          <em className="italic text-emerald-400">mientras tú lo haces crecer.</em>
        </h1>
        <p className="text-[17px] text-zinc-400 leading-relaxed max-w-lg mx-auto mb-12 font-light">
          Automatización de reservas, atención al cliente y tareas repetitivas vía WhatsApp e IA. Sin complicaciones técnicas, sin contratos, sin excusas.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a href="#contacto" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-7 py-3.5 rounded-lg text-[15px] font-medium hover:bg-emerald-700 transition-colors no-underline">
            Solicitar demo gratuita <Arrow />
          </a>
          <a href="#como-funciona" className="inline-flex items-center gap-2 border border-white/15 text-zinc-400 px-6 py-3.5 rounded-lg text-sm hover:border-white/30 hover:text-white transition-colors no-underline">
            Ver cómo funciona
          </a>
        </div>
      </div>
      <div className="relative z-10 flex items-center justify-center gap-10 flex-wrap px-12 pt-14">
        {["Sin tarjeta de crédito", "14 días de prueba gratuita", "Funcionando en 48 horas", "Solo para negocios en España"].map((t, i) => (
          <span key={t} className={`flex items-center gap-2 text-xs text-zinc-600 ${i > 0 ? "border-l border-white/8 pl-10" : ""}`}>
            <Check />{t}
          </span>
        ))}
      </div>
      <div className="relative z-10 max-w-2xl mx-auto mt-14 bg-white/[0.02] border border-white/8 rounded-xl p-5 flex items-center gap-6">
        <div className="flex-1 flex flex-col gap-2">
          <p className="text-xs text-zinc-600 bg-white/5 border border-white/8 rounded-2xl rounded-bl-sm px-3.5 py-2 max-w-[280px]">Hola, quiero reservar mesa para 4 el sábado a las 21h</p>
          <p className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl rounded-br-sm px-3.5 py-2 max-w-[300px] self-end">¡Perfecto! Mesa para 4 el sábado 31 a las 21:00 confirmada. Te enviaré un recordatorio 24h antes 🤖</p>
        </div>
        <div className="flex flex-col gap-3 border-l border-white/8 pl-6 min-w-[130px]">
          {[["24/7", "Atención sin parar"], ["0 min", "Intervención humana"], ["48 h", "Para estar activo"]].map(([n, l]) => (
            <div key={l}><p className="font-serif text-xl text-white leading-none">{n}</p><p className="text-[11px] text-zinc-600">{l}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Problema() {
  return (
    <section className="bg-[#0A0A0A] py-24 px-12 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <Label>El problema</Label>          <h2 className="font-serif text-4xl text-white tracking-tight mb-3">Tu negocio pierde dinero <em className="italic text-zinc-500">mientras duermes.</em></h2>
          <p className="text-zinc-400 font-light">Cada mensaje sin respuesta es un cliente que se va a la competencia.</p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-y divide-white/6 border border-white/6 rounded-2xl overflow-hidden">
          {PAINS.map((p) => (
            <div key={p.n} className="p-8 bg-[#0A0A0A] hover:bg-[#111] transition-colors flex flex-col gap-3">
              <span className="font-serif text-xs tracking-widest text-white/15">{p.n}</span>
              <div className="w-9 h-9 flex items-center justify-center bg-red-950/30 border border-red-500/20 rounded-lg">
                <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <p className="text-[15px] font-medium text-white leading-snug">{p.title}</p>
              <p className="text-[13px] text-zinc-500 leading-relaxed font-light">{p.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-zinc-600 mt-10"><span className="text-zinc-400 font-medium">¿Te suena familiar?</span> Fluxia resuelve los seis.</p>
      </div>
    </section>
  );
}

function Solucion() {
  return (
    <section className="bg-[#0D0D0D] py-24 px-12 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <Label>La solución</Label>
          <h2 className="font-serif text-4xl text-white tracking-tight mb-3">Tres pilares. <em className="italic text-emerald-400">Un negocio que no para.</em></h2>
          <p className="text-zinc-400 font-light max-w-md mx-auto">Fluxia no es una app más. Es el sistema que trabaja por ti las 24 horas, sin que tengas que tocar nada.</p>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {PILLARS.map((p) => (
            <div key={p.num} className="bg-white/[0.02] border border-white/8 rounded-2xl p-8 flex flex-col gap-5 hover:border-emerald-500/25 transition-colors">
              <p className="text-[11px] tracking-widest uppercase text-emerald-500/50">{p.num}</p>
              <div className="w-12 h-12 bg-emerald-950/40 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              </div>
              <div>
                <p className="font-serif text-xl text-white mb-2">{p.title}</p>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">{p.desc}</p>
              </div>
              <ul className="flex flex-col gap-2">
                {p.feats.map((f) => <li key={f} className="flex items-start gap-2 text-[13px] text-zinc-500"><span className="w-1.5 h-1.5 bg-emerald-600/60 rounded-full mt-1.5 flex-shrink-0" />{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 bg-emerald-950/20 border border-emerald-500/18 rounded-xl px-10 py-7 flex items-center justify-between gap-6">
          <div>
            <p className="font-serif text-xl text-white">Todo esto, funcionando en menos de 48 horas.</p>
            <p className="text-sm text-zinc-500 mt-1 font-light">Sin contratos de permanencia. Sin complicaciones técnicas.</p>
          </div>
          <a href="#contacto" className="flex-shrink-0 inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors no-underline">
            Solicitar demo <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-[#0A0A0A] py-24 px-12 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <Label>Cómo funciona</Label>
          <h2 className="font-serif text-4xl text-white tracking-tight mb-3">En marcha en <em className="italic text-emerald-400">cuatro pasos.</em></h2>
          <p className="text-zinc-400 font-light max-w-md mx-auto">Sin reuniones eternas ni equipos técnicos. De la llamada inicial a tu negocio automatizado en menos de 48 horas.</p>
        </div>
        <div className="grid grid-cols-4 relative">
          <div className="absolute top-[22px] left-[13%] right-[13%] h-px bg-emerald-500/20" />
          {STEPS.map((s, i) => (
            <div key={s.n} className={`flex flex-col gap-4 px-5 relative z-10 ${i < STEPS.length - 1 ? "border-r border-white/5" : ""} ${i === 0 ? "pl-0" : ""} ${i === STEPS.length - 1 ? "pr-0" : ""}`}>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-base font-medium ${s.opt ? "bg-white/4 border border-white/10 text-zinc-600" : "bg-emerald-950/40 border border-emerald-500/30 text-emerald-400"}`}>{s.n}</div>
              <div>
                <p className="text-[11px] tracking-wider uppercase text-zinc-600 mb-1">{s.tag}</p>
                <p className="text-[15px] font-medium text-white mb-2">{s.title}</p>
                <p className="text-[13px] text-zinc-500 leading-relaxed font-light">{s.desc}</p>
                {s.pill && <span className="mt-2 inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-white/4 border border-white/8 text-zinc-600">{s.pill}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Productos() {
  const items = [
    { badge: "Solo automatización", badgeCls: "bg-white/5 border-white/10 text-zinc-400", name: "Fluxia Auto", tagline: "Para negocios que ya tienen web o no la necesitan.", feats: ["Asistente WhatsApp con IA 24/7", "Reservas y confirmaciones automáticas", "Recordatorios y gestión de cancelaciones", "Respuestas a preguntas frecuentes", "Respuesta automática a reseñas de Google"], from: "Desde", price: "€49", period: "/mes", featured: false, cta: "Ver planes Auto" },
    { badge: "⭐ Pack completo", badgeCls: "bg-emerald-950/40 border-emerald-500/25 text-emerald-400", name: "Fluxia Pro", tagline: "Web profesional + automatización + IA. Todo en uno.", feats: ["Todo lo de Fluxia Auto incluido", "Web profesional diseñada para tu negocio", "Dominio y hosting incluidos", "SEO local optimizado", "Integración web + WhatsApp unificada"], from: "Setup desde", price: "€799", period: " + €49/mes", featured: true, cta: "Ver planes Pro" },
  ];
  return (
    <section className="bg-[#0D0D0D] py-24 px-12 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <Label>Productos</Label>
          <h2 className="font-serif text-4xl text-white tracking-tight mb-3">Elige el pack <em className="italic text-emerald-400">que necesitas.</em></h2>
          <p className="text-zinc-400 font-light">Solo automatización, o el pack completo con web incluida.</p>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {items.map((p) => (
            <div key={p.name} className={`rounded-2xl p-10 border flex flex-col gap-5 ${p.featured ? "bg-emerald-950/10 border-emerald-500/20" : "bg-white/[0.02] border-white/8"}`}>
              <span className={`inline-block text-[11px] font-medium px-3 py-1 rounded-full border w-fit ${p.badgeCls}`}>{p.badge}</span>
              <div><p className="text-2xl font-medium text-white">{p.name}</p><p className="text-sm text-zinc-500 mt-1 font-light">{p.tagline}</p></div>
              <ul className="flex flex-col gap-2.5">{p.feats.map((f) => <li key={f} className="flex items-start gap-2 text-[13.5px] text-zinc-400"><Check />{f}</li>)}</ul>
              <div className="mt-auto pt-5 border-t border-white/6">
                <p className="text-[11px] uppercase tracking-wider text-zinc-600">{p.from}</p>
                <p className="text-3xl font-medium text-white tracking-tight">{p.price}<span className="text-sm font-normal text-zinc-400">{p.period}</span></p>
              </div>
              <button className={`w-full py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${p.featured ? "bg-emerald-600 text-white hover:bg-emerald-700" : "border border-white/15 text-zinc-400 hover:border-white/25 hover:text-white bg-transparent"}`}>
                {p.cta} <Arrow />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sectores() {
  const [tab, setTab] = useState<SectorKey>("r");
  const s = SECTORES[tab];
  return (
    <section className="bg-[#0A0A0A] py-24 px-12 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <Label>Sectores</Label>
          <h2 className="font-serif text-4xl text-white tracking-tight mb-3">Hecho para <em className="italic text-emerald-400">tu tipo de negocio.</em></h2>
          <p className="text-zinc-400 font-light">Cada sector tiene sus propios flujos. Fluxia se adapta desde el primer día.</p>
        </div>
        <div className="flex gap-1 bg-white/3 border border-white/8 rounded-lg p-1 w-fit mb-7">
          {(["r", "p", "h"] as SectorKey[]).map((k) => (
            <button key={k} onClick={() => setTab(k)} className={`px-5 py-2 rounded-md text-sm font-medium transition-all cursor-pointer border ${tab === k ? "bg-emerald-950/40 border-emerald-500/25 text-emerald-400" : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300"}`}>
              {SECTORES[k].label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-7">
          <div>
            <p className="font-serif text-3xl text-white leading-snug mb-2">{s.title}<br /><em className="italic text-emerald-400">{s.italic}</em></p>
            <p className="text-sm text-zinc-400 font-light leading-relaxed mb-5">{s.desc}</p>
            <ul className="flex flex-col gap-2.5">{s.feats.map((f) => <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-zinc-400"><Check />{f}</li>)}</ul>
          </div>
          <div className="bg-white/[0.02] border border-white/8 rounded-xl p-5 flex flex-col gap-2.5">
            <p className="text-[11px] tracking-widest uppercase text-zinc-600 mb-1">Ejemplo real</p>
            {s.chat.map((m, i) => (
              <p key={i} className={`text-[13px] px-3.5 py-2 rounded-2xl max-w-[86%] leading-snug ${m.in ? "bg-white/5 border border-white/8 text-zinc-400 self-start rounded-bl-sm" : "bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 self-end rounded-br-sm"}`}>{m.text}</p>
            ))}
            <p className="text-[11px] text-zinc-700 text-right mt-1">{s.ts}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Precios() {
  const [annual, setAnnual] = useState(false);
  return (
    <section className="bg-[#0D0D0D] py-24 px-12 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <Label>Precios</Label>
          <h2 className="font-serif text-4xl text-white tracking-tight mb-3">Claro, sin <em className="italic text-emerald-400">letra pequeña.</em></h2>
          <p className="text-zinc-400 font-light">14 días de prueba gratuita. Sin tarjeta de crédito. Sin permanencia.</p>
        </div>
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm transition-colors ${!annual ? "text-white font-medium" : "text-zinc-500"}`}>Mensual</span>
          <button onClick={() => setAnnual(!annual)} className={`relative w-11 h-6 rounded-full border transition-all cursor-pointer ${annual ? "bg-emerald-600 border-emerald-500" : "bg-white/5 border-white/15"}`}>
            <span className={`absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full transition-all ${annual ? "left-[22px]" : "left-[3px]"}`} />
          </button>
          <span className={`text-sm transition-colors ${annual ? "text-white font-medium" : "text-zinc-500"}`}>Anual</span>
          <span className="text-[11px] bg-emerald-950/40 border border-emerald-500/25 text-emerald-400 px-2.5 py-0.5 rounded-full">–15%</span>
        </div>
        <p className="text-xs tracking-widest uppercase text-zinc-600 mb-3">Fluxia Auto — Solo automatización</p>
        <div className="grid grid-cols-3 gap-3 mb-12">
          {AUTO_PLANS.map((p) => <PlanCard key={p.name} plan={p} annual={annual} cta="Empezar gratis" />)}
        </div>
        <p className="text-xs tracking-widest uppercase text-zinc-600 mb-3">Fluxia Pro — Web + Automatización</p>
        <div className="grid grid-cols-3 gap-3">
          {PRO_PLANS.map((p) => <PlanCard key={p.name} plan={p} annual={annual} cta="Solicitar demo" />)}
        </div>
        <p className="text-center text-sm text-zinc-600 mt-5"><span className="text-zinc-400 font-medium">14 días de prueba gratuita</span> en todos los planes. Sin tarjeta de crédito.</p>
      </div>
    </section>
  );
}

// ─── SECCIÓN 8: DEMO BOT ──────────────────────────────────────────────────────
type Message = { role: "user" | "assistant"; content: string };

function Demo() {
  const [sector, setSector] = useState<DemoSector>("restaurante");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);
  const data = DEMO_SECTORS[sector];

  useEffect(() => {
    setMessages([]);
  }, [sector]);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, system: data.system }),
      });
      const json = await res.json();
      setMessages([...next, { role: "assistant", content: json.reply }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Lo siento, hubo un problema. Inténtalo de nuevo." }]);
    }
    setLoading(false);
  }

  return (
    <section id="demo" className="bg-[#0A0A0A] py-24 px-12 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Label>Demo en vivo</Label>
          <h2 className="font-serif text-4xl text-white tracking-tight mb-3">Habla con Fluxia <em className="italic text-emerald-400">ahora mismo.</em></h2>
          <p className="text-zinc-400 font-light max-w-md mx-auto">Prueba el asistente con preguntas reales. Esto es exactamente lo que verán tus clientes en tu WhatsApp.</p>
        </div>

        {/* Selector de sector interactivo en la Demo */}
        <div className="flex gap-1 bg-white/3 border border-white/8 rounded-lg p-1 w-fit mx-auto mb-8">
          {(["restaurante", "peluqueria", "hookah"] as DemoSector[]).map((k) => (
            <button key={k} onClick={() => setSector(k)} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border ${sector === k ? "bg-emerald-950/40 border-emerald-500/25 text-emerald-400" : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300"}`}>
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </button>
          ))}
        </div>

        <div className="max-w-[520px] mx-auto bg-white/[0.02] border border-white/8 rounded-2xl overflow-hidden">
          {/* Barra superior de la ventana del chat */}
          <div className="bg-white/[0.03] border-b border-white/8 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 110 20A10 10 0 0112 2z"/>
                <path d="M8 12h.01M12 12h.01M16 12h.01"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{data.name}</p>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                En línea
              </p>
            </div>
          </div>

          {/* Historial de Mensajes */}
          <div ref={msgsRef} className="h-[350px] overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-white/10">
            {/* Mensaje de bienvenida inicial */}
            <div className="bg-white/5 border border-white/8 text-zinc-300 text-[13px] px-3.5 py-2 rounded-2xl rounded-bl-sm max-w-[85%] self-start leading-snug">
              {data.welcome}
            </div>

            {/* Renderizar conversación */}
            {messages.map((m, i) => (
              <div key={i} className={`text-[13px] px-3.5 py-2 rounded-2xl max-w-[85%] leading-snug ${m.role === "user" ? "bg-emerald-600 text-white self-end rounded-br-sm" : "bg-white/5 border border-white/8 text-zinc-300 self-start rounded-bl-sm"}`}>
                {m.content}
              </div>
            ))}

            {/* Animación de carga cuando la IA responde */}
            {loading && (
              <div className="bg-white/5 border border-white/8 text-zinc-400 text-[13px] px-3.5 py-2 rounded-2xl rounded-bl-sm max-w-[85%] self-start flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
              </div>
            )}
          </div>

          {/* Botones de sugerencia rápida */}
          <div className="px-4 pb-3 flex gap-1.5 flex-wrap">
            {data.sugs.map((sug) => (
              <button key={sug} onClick={() => send(sug)} disabled={loading} className="text-[11px] bg-white/5 hover:bg-white/10 border border-white/8 text-zinc-400 hover:text-white px-2.5 py-1 rounded-full transition-colors cursor-pointer disabled:opacity-50">
                {sug}
              </button>
            ))}
          </div>

          {/* Input de texto inferior */}
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-white/8 p-3 flex gap-2 bg-white/[0.01]">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe un mensaje..." disabled={loading} className="flex-1 bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50" />
            <button type="submit" disabled={loading || !input.trim()} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 flex items-center justify-center">
              Enviar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ─── RENDERIZADO PRINCIPAL DE LA PÁGINA ─────────────────────────────────────────
export default function Page() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen text-white selection:bg-emerald-500/30">
      <Hero />
      <Problema />
      <Solucion />
      <ComoFunciona />
      <Productos />
      <Sectores />
      <Precios />
      <Demo />
    </main>
  );
}