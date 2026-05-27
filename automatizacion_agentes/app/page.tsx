"use client";
import { useState, useEffect, useRef } from "react";

// ─── SVG ICONS (Native, no external libraries) ────────────────────────────────

function CheckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function BoltIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function BrainIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

function RocketIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function SparklesIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

function MessageIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CalendarIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function DatabaseIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}

function MenuIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function XIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

// ─── HEADER / NAV ─────────────────────────────────────────────────────────────

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2 group">
          <span className="text-2xl font-serif tracking-tight text-foreground">
            Flux<span className="text-emerald-400">ia</span>
          </span>
          <span className="hidden sm:inline-flex bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium uppercase tracking-wider">
            IA Agency
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {['Soluciones', 'Demo IA', 'Planes', 'Contacto'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="#contacto"
            className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-background font-semibold text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-all duration-200 hover:scale-105"
          >
            Agendar Demo
            <ArrowRightIcon className="w-4 h-4" />
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {isMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <nav className="flex flex-col p-6 gap-4">
            {['Soluciones', 'Demo IA', 'Planes', 'Contacto'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground py-2 border-b border-border last:border-0"
              >
                {item}
              </a>
            ))}
            <a
              href="#contacto"
              className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-background font-semibold text-sm px-5 py-3 rounded-lg"
            >
              Agendar Demo
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Gradient Orbs */}
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-glow" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Sistema activo en 48 horas
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif tracking-tight text-foreground mb-6 leading-[1.1]">
          Automatiza tu negocio con{' '}
          <span className="block mt-2 gradient-text">
            Agentes de IA
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Diseñamos, entrenamos e integramos delegados autónomos que optimizan tus operaciones, capturan leads y atienden clientes las 24 horas.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <a
            href="#demo-ia"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-background font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all duration-200 hover:scale-105"
          >
            <SparklesIcon className="w-5 h-5" />
            Probar Demo En Vivo
          </a>
          <a
            href="#soluciones"
            className="inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground font-medium text-base px-8 py-4 rounded-xl hover:bg-muted transition-all duration-200"
          >
            Ver Soluciones
            <ArrowRightIcon className="w-4 h-4" />
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 text-center">
          {[
            { value: '24/7', label: 'Atención continua' },
            { value: '< 5s', label: 'Tiempo respuesta' },
            { value: '99.9%', label: 'Uptime garantizado' },
          ].map((stat) => (
            <div key={stat.label} className="px-4">
              <p className="text-3xl sm:text-4xl font-serif gradient-text mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-2 bg-emerald-400 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES / NODES SECTION ─────────────────────────────────────────────────

const NODES = [
  {
    id: 1,
    icon: BoltIcon,
    title: 'Nodo de Activación',
    subtitle: 'Trigger',
    description: 'Detecta eventos en tiempo real: un email entrante, un nuevo mensaje en WhatsApp o un lead registrado en tu CRM.',
    color: 'emerald',
  },
  {
    id: 2,
    icon: BrainIcon,
    title: 'Cerebro de Procesamiento',
    subtitle: 'LLM Core',
    description: 'El agente interpreta la intención del usuario usando modelos de lenguaje avanzados, extrayendo datos clave.',
    color: 'cyan',
  },
  {
    id: 3,
    icon: RocketIcon,
    title: 'Nodo de Acción',
    subtitle: 'Execution',
    description: 'Ejecuta tareas reales: agenda reuniones en Calendly, actualiza bases de datos o envía presupuestos automáticos.',
    color: 'teal',
  },
];

function FeaturesSection() {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const getColorClasses = (color: string, isHovered: boolean) => {
    const colors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
      emerald: {
        bg: isHovered ? 'bg-emerald-500/20' : 'bg-emerald-500/10',
        border: isHovered ? 'border-emerald-500/50' : 'border-emerald-500/20',
        text: 'text-emerald-400',
        glow: 'shadow-emerald-500/20',
      },
      cyan: {
        bg: isHovered ? 'bg-cyan-500/20' : 'bg-cyan-500/10',
        border: isHovered ? 'border-cyan-500/50' : 'border-cyan-500/20',
        text: 'text-cyan-400',
        glow: 'shadow-cyan-500/20',
      },
      teal: {
        bg: isHovered ? 'bg-teal-500/20' : 'bg-teal-500/10',
        border: isHovered ? 'border-teal-500/50' : 'border-teal-500/20',
        text: 'text-teal-400',
        glow: 'shadow-teal-500/20',
      },
    };
    return colors[color] || colors.emerald;
  };

  return (
    <section id="soluciones" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-xs font-medium tracking-[3px] uppercase text-emerald-400 mb-4">
            Arquitectura Inteligente
          </p>
          <h2 className="text-4xl sm:text-5xl font-serif text-foreground mb-4">
            Estructura de Flujo{' '}
            <span className="gradient-text">Inteligente</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Nuestros agentes no son simples bots; se estructuran mediante arquitecturas de nodos lógicos interconectados.
          </p>
        </div>

        {/* Nodes Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {NODES.map((node) => {
            const isHovered = hoveredNode === node.id;
            const colors = getColorClasses(node.color, isHovered);
            const Icon = node.icon;

            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`relative bg-card border ${colors.border} rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
                  isHovered ? `shadow-xl ${colors.glow}` : ''
                }`}
              >
                {/* Node Number */}
                <div className={`absolute top-4 right-4 w-8 h-8 rounded-lg ${colors.bg} ${colors.border} border flex items-center justify-center ${colors.text} text-sm font-bold`}>
                  {node.id}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-6 transition-all duration-300 ${
                  isHovered ? 'scale-110' : ''
                }`}>
                  <Icon className={`w-7 h-7 ${colors.text}`} />
                </div>

                {/* Content */}
                <p className={`text-xs font-medium tracking-wider uppercase ${colors.text} mb-2`}>
                  {node.subtitle}
                </p>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {node.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {node.description}
                </p>

                {/* Connection Line (visual) */}
                {node.id < 3 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-px bg-gradient-to-r from-border to-transparent z-10" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── INTERACTIVE CHAT DEMO ────────────────────────────────────────────────────

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

const SAMPLE_QUESTIONS = [
  {
    question: '¿Cómo automatizo la entrada de leads?',
    answer: 'Conectamos un webhook a tus canales de entrada (Meta Ads, Web). La IA lee cada solicitud, califica el lead según tus criterios en menos de 5 segundos, lo introduce filtrado en tu CRM y envía un aviso inmediato por Slack o email a tu equipo.',
  },
  {
    question: '¿Se puede conectar con mi calendario?',
    answer: 'Por supuesto. El agente analiza la disponibilidad real de tu equipo mediante integraciones con Google Calendar o Calendly, y gestiona de forma autónoma la conversación con el cliente para cerrar el día y hora que mejor convenga a ambas partes.',
  },
  {
    question: '¿Qué pasa si el agente no sabe responder?',
    answer: 'El sistema detecta automáticamente consultas fuera de su dominio de conocimiento. En estos casos, escala la conversación a un agente humano de tu equipo via Slack, WhatsApp o email, adjuntando todo el contexto de la conversación.',
  },
];

function ChatDemoSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: '¡Hola! Soy el agente inteligente de Fluxia. ¿Qué proceso de tu negocio te gustaría automatizar hoy?' },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleQuestionClick = (question: string, answer: string) => {
    if (isTyping) return;

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setIsTyping(true);

    // Scroll to bottom
    setTimeout(() => {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);

    // Simulate AI response after delay
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', text: answer }]);
      setIsTyping(false);

      // Scroll to bottom again
      setTimeout(() => {
        chatContainerRef.current?.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }, 1500);
  };

  return (
    <section id="demo-ia" className="relative py-32 px-6 bg-card/50">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-medium tracking-[3px] uppercase text-cyan-400 mb-4">
            Demo Interactiva
          </p>
          <h2 className="text-4xl sm:text-5xl font-serif text-foreground mb-4">
            Interactúa con{' '}
            <span className="gradient-text">Nuestro Agente</span>
          </h2>
          <p className="text-muted-foreground">
            Haz clic en una pregunta para ver cómo razona e interactúa la IA en tiempo real.
          </p>
        </div>

        {/* Chat Window */}
        <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
          {/* Terminal Header */}
          <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-muted-foreground font-mono ml-4">
              fluxia-agent-terminal v2.0.0
            </span>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-400">En línea</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="p-6 min-h-[350px] max-h-[400px] overflow-y-auto space-y-4"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-background font-medium rounded-br-sm'
                      : 'bg-card border border-border text-foreground rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-card border border-border text-muted-foreground max-w-[80%] rounded-2xl rounded-bl-sm px-5 py-3 text-sm flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  <span className="ml-2">Fluxia está pensando...</span>
                </div>
              </div>
            )}
          </div>

          {/* Sample Questions */}
          <div className="p-4 bg-card/80 border-t border-border">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">
              Preguntas frecuentes:
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              {SAMPLE_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuestionClick(q.question, q.answer)}
                  disabled={isTyping}
                  className={`flex-1 text-left text-xs bg-background border border-border text-muted-foreground p-3 rounded-lg transition-all duration-200 ${
                    isTyping
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:border-emerald-500/40 hover:text-foreground hover:bg-emerald-500/5'
                  }`}
                >
                  <span className="text-emerald-400 mr-1">→</span> {q.question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PRODUCTOS SECTION ────────────────────────────────────────────────────────

const PRODUCTOS = [
  {
    badge: "Solo automatización",
    badgeCls: "bg-white/5 border-white/10 text-zinc-400",
    name: "Fluxia Auto",
    tagline: "Para negocios que ya tienen web o no la necesitan.",
    feats: [
      "Asistente WhatsApp con IA 24/7",
      "Reservas y confirmaciones automáticas",
      "Recordatorios y gestión de cancelaciones",
      "Respuestas a preguntas frecuentes",
      "Respuesta automática a reseñas de Google",
    ],
    from: "Desde",
    price: "€49",
    period: "/mes",
    featured: false,
    cta: "Ver planes Auto",
  },
  {
    badge: "Pack completo",
    badgeCls: "bg-emerald-950/40 border-emerald-500/25 text-emerald-400",
    name: "Fluxia Pro",
    tagline: "Web profesional + automatización + IA. Todo en uno.",
    feats: [
      "Todo lo de Fluxia Auto incluido",
      "Web profesional diseñada para tu negocio",
      "Dominio y hosting incluidos",
      "SEO local optimizado",
      "Integración web + WhatsApp unificada",
    ],
    from: "Setup desde",
    price: "€799",
    period: " + €49/mes",
    featured: true,
    cta: "Ver planes Pro",
  },
];

function ProductosSection() {
  return (
    <section id="planes" className="relative py-24 px-6 lg:px-12 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-medium tracking-[3px] uppercase text-emerald-400 mb-4">
            Productos
          </p>
          <h2 className="text-4xl sm:text-5xl font-serif text-foreground mb-3">
            Elige el pack{' '}
            <em className="italic text-emerald-400">que necesitas.</em>
          </h2>
          <p className="text-muted-foreground font-light">
            Solo automatización, o el pack completo con web incluida.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {PRODUCTOS.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl p-10 border flex flex-col gap-5 transition-all duration-300 hover:scale-[1.02] ${
                p.featured
                  ? "bg-emerald-950/10 border-emerald-500/20"
                  : "bg-white/[0.02] border-white/10"
              }`}
            >
              {/* Badge */}
              <span
                className={`inline-block text-[11px] font-medium px-3 py-1 rounded-full border w-fit ${p.badgeCls}`}
              >
                {p.featured && <span className="mr-1">&#11088;</span>}
                {p.badge}
              </span>

              {/* Name & Tagline */}
              <div>
                <p className="text-2xl font-medium text-foreground">{p.name}</p>
                <p className="text-sm text-muted-foreground mt-1 font-light">
                  {p.tagline}
                </p>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2.5">
                {p.feats.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-[13.5px] text-muted-foreground"
                  >
                    <CheckIcon className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Pricing */}
              <div className="mt-auto pt-5 border-t border-white/10">
                <p className="text-[11px] uppercase tracking-wider text-zinc-600">
                  {p.from}
                </p>
                <p className="text-3xl font-medium text-foreground tracking-tight">
                  {p.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    {p.period}
                  </span>
                </p>
              </div>

              {/* CTA Button */}
              <a
                href="#contacto"
                className={`w-full py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                  p.featured
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "border border-white/15 text-muted-foreground hover:border-white/25 hover:text-foreground bg-transparent"
                }`}
              >
                {p.cta} <ArrowRightIcon className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT SECTION ──────────────────────────────────────────────────────────

function ContactSection() {
  const [formState, setFormState] = useState({
    negocio: '',
    nombre: '',
    contacto: '',
    sector: '',
    mensaje: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('[v0] Form submitted:', formState);
  };

  return (
    <section id="contacto" className="relative py-32 px-6 bg-card/50">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column - Info */}
          <div>
            <p className="text-xs font-medium tracking-[3px] uppercase text-emerald-400 mb-4">
              Contacto
            </p>
            <h2 className="text-4xl sm:text-5xl font-serif text-foreground mb-6 leading-tight">
              ¿Listo para{' '}
              <span className="gradient-text">automatizar</span>
              <br />tu negocio?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Cuéntanos tu negocio y en menos de 24 horas te preparamos una demo personalizada. Sin compromiso, sin tecnicismos.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              {[
                { icon: MessageIcon, label: 'WhatsApp disponible', value: '+34 600 000 000' },
                { icon: CalendarIcon, label: 'Agenda una llamada', value: 'calendly.com/fluxia' },
                { icon: DatabaseIcon, label: 'Email directo', value: 'hola@fluxia.es' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-emerald-500/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-foreground font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: 'negocio', label: 'Nombre del negocio', placeholder: 'Restaurante La Mar...', type: 'text' },
              { name: 'nombre', label: 'Tu nombre', placeholder: 'María García', type: 'text' },
              { name: 'contacto', label: 'WhatsApp o email', placeholder: '+34 600 000 000', type: 'text' },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-xs text-muted-foreground font-medium mb-2 block">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formState[field.name as keyof typeof formState]}
                  onChange={(e) => setFormState({ ...formState, [field.name]: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            ))}

            {/* Sector Select */}
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-2 block">
                Sector
              </label>
              <select
                value={formState.sector}
                onChange={(e) => setFormState({ ...formState, sector: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-muted-foreground outline-none focus:border-emerald-500/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="">¿A qué te dedicas?</option>
                <option value="restaurante">Restaurante</option>
                <option value="peluqueria">Peluquería</option>
                <option value="ecommerce">E-commerce</option>
                <option value="saas">SaaS / Tech</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-2 block">
                ¿Qué quieres automatizar? (opcional)
              </label>
              <textarea
                rows={4}
                placeholder="Cuéntanos cómo gestionas ahora las tareas que quieres automatizar..."
                value={formState.mensaje}
                onChange={(e) => setFormState({ ...formState, mensaje: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-emerald-500/50 transition-colors resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-background font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all duration-200 hover:scale-[1.02]"
            >
              Solicitar Demo Gratuita
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <span className="text-xl font-serif text-foreground">
          Flux<span className="text-emerald-400">ia</span>
        </span>

        {/* Links */}
        <div className="flex items-center gap-6">
          {['Aviso legal', 'Privacidad', 'Cookies'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Fluxia Agency. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function FluxiaPage() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ChatDemoSection />
      <ProductosSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
