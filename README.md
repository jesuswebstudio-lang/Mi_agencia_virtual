# Mi agencia — sistema operativo

> Stack: Next.js · Supabase · Tailwind · Vercel · Stripe  
> Mercado: pequeñas empresas en Madrid  
> Objetivo 2026: 2 clientes → colchón → autónomo

---

## Índice

- [Cómo usar este sistema](#cómo-usar-este-sistema)
- [Flujo de trabajo completo](#flujo-de-trabajo-completo)
- [Comando maestro](#comando-maestro)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Estado actual de clientes](#estado-actual-de-clientes)
- [Pipeline de prospección](#pipeline-de-prospección)
- [Precios de referencia](#precios-de-referencia)
- [Notas del sistema](#notas-del-sistema)

---

## Cómo usar este sistema

### Para un cliente nuevo (5 minutos)
1. Copia el [Comando maestro](#comando-maestro)
2. Pégalo en Claude con los datos de la empresa
3. Guarda el briefing generado en `/clientes/[nombre]/briefing.md`
4. Usa el speech generado para llamar o escribir ese mismo día

### Para preparar una reunión de discovery
1. Abre `/clientes/[nombre]/briefing.md`
2. Abre `/agentes/fase1-product-manager.md`
3. En Claude: pega el agente + el briefing + escribe "prepárame para esta reunión"
4. Toma notas durante la reunión en `/clientes/[nombre]/notas-discovery.md`

### Para generar una propuesta
1. Asegúrate de tener el briefing completo con notas de discovery
2. Abre `/agentes/fase1-sales.md`
3. En Claude: pega el agente + el briefing completo
4. Escribe: "genera la propuesta comercial lista para enviar"
5. Guarda en `/clientes/[nombre]/propuesta.md`

### Para desarrollo (una vez aceptada la propuesta)
1. Abre el briefing y la propuesta aceptada
2. Según lo que necesites, usa el agente de fase 2 correspondiente:
   - UI y componentes → `fase2-frontend.md`
   - APIs y base de datos → `fase2-backend.md`
   - Revisión antes de entregar → `fase2-qa.md`
   - SEO y copy → `fase2-seo.md`
3. En Cursor: abre el agente como contexto y trabaja

### Para un cliente SaaS (fase 3)
1. Usa los agentes de fase 3 según el momento:
   - Primer acceso del cliente → `fase3-onboarding.md`
   - Retención y renovación → `fase3-customer-success.md`
   - Decisiones de producto → `fase3-analytics.md`

---

## Flujo de trabajo completo
DÍA 1 — Encuentras un prospecto
└── Comando maestro en Claude con sus datos
└── Obtienes: análisis + preguntas + speech + briefing
└── Guardas briefing en /clientes/[empresa]/briefing.md
└── Llamas o escribes ese mismo día con el speech
DÍA 2-3 — Reunión de discovery
└── Agente Product Manager + briefing en Claude
└── Preparas las preguntas y el enfoque
└── Reunión de 20-30 minutos
└── Guardas notas en notas-discovery.md
DÍA 3 — Propuesta (mismo día de la reunión)
└── Agente Sales + briefing completo en Claude
└── Propuesta generada en 10 minutos
└── Enviada por email ese mismo día
└── Guardas en propuesta.md
DÍA 5-7 — Seguimiento
└── Si no hay respuesta: llamada de seguimiento
└── Objetivo: resolver dudas y confirmar
DÍA 7-21 — Desarrollo
└── Agentes de fase 2 según necesidad
└── Frontend + Backend + QA + SEO
└── Entrega y cobro final
DÍA 21+ — Mantenimiento
└── Propuesta de mantenimiento mensual (50-80€)
└── Empieza a construir MRR

---

## Comando maestro

Copia este bloque completo en Claude cuando tengas un cliente nuevo:
Actúa como mi sistema de agencia completo.
Voy a darte información sobre una empresa y quiero que
generes todo lo necesario para trabajar con ella.
Empresa

Nombre: [NOMBRE]
Sector: [SECTOR]
Ciudad: [CIUDAD]
Web actual: [URL o "no tiene"]
Cómo llegué a ellos: [frío / contacto / referido]
Contexto extra: [lo que sepas]

Genera en este orden:

ANÁLISIS PREVIO

Qué problemas detectas solo con estos datos
Qué preguntas críticas faltan por responder
Quién toma la decisión y cómo suele pensar alguien en ese rol


PREGUNTAS DE DISCOVERY

8 preguntas para la reunión inicial
Ordenadas de más importante a menos
Con el objetivo de cada pregunta entre paréntesis


SPEECH DE PRIMER CONTACTO

Versión llamada (60 segundos máximo)
Versión email (subject + cuerpo)
Versión WhatsApp (3 líneas máximo)


BRIEFING INICIAL

En formato markdown listo para guardar
Con todo lo que ya sé relleno
El resto marcado como PENDIENTE


PROPUESTA PRELIMINAR

Qué servicios tienen sentido para este cliente
Rango de precio justificado
Cómo estructurar el pitch en la reunión



Empieza con el análisis previo y ve en orden.

---

## Estructura del repositorio
mi-agencia/
│
├── README.md                          ← este archivo
│
├── agentes/
│   ├── fase1-product-manager.md
│   ├── fase1-copywriter.md
│   ├── fase1-sales.md
│   ├── fase2-frontend.md
│   ├── fase2-backend.md
│   ├── fase2-qa.md
│   ├── fase2-seo.md
│   ├── fase3-onboarding.md
│   ├── fase3-customer-success.md
│   └── fase3-analytics.md
│
├── plantillas/
│   ├── briefing-cliente.md
│   ├── propuesta-comercial.md
│   ├── email-seguimiento.md
│   └── scripts-llamada.md
│
├── prospeccion/
│   ├── lista-prospectos.md
│   └── sectores/
│       ├── restaurantes.md
│       ├── hookah.md
│       └── academias.md
│
└── clientes/
├── _plantilla/
│   ├── briefing.md
│   ├── propuesta.md
│   ├── notas-discovery.md
│   └── entregables.md
└── gruposervigur/
├── briefing.md
├── propuesta.md
├── notas-discovery.md
└── entregables.md

---

## Estado actual de clientes

| Cliente | Sector | Estado | Siguiente paso | Valor estimado |
|---|---|---|---|---|
| Gruposervigur | Seguridad privada | Esperando reunión | Confirmar con contacto | 1.200–1.800€ |

---

## Pipeline de prospección

| Semana | Prospectos añadidos | Llamadas | Emails | Reuniones | Propuestas | Cerrados |
|---|---|---|---|---|---|---|
| Semana 1 | 0 | 0 | 0 | 0 | 0 | 0 |

### Sectores activos
- Restaurantes y cafeterías — Madrid
- Hookah lounges — Madrid
- Academias — Madrid

### Búsquedas en Google Maps para esta semana
- "restaurante Madrid [barrio]"
- "hookah lounge Madrid"
- "academia inglés Madrid"
- "cafetería Madrid [barrio]"

---

## Precios de referencia

| Servicio | Precio | Tiempo estimado |
|---|---|---|
| Web informativa básica | 800–1.000€ | 5–7 días |
| Web con formulario de captación | 1.000–1.500€ | 7–10 días |
| Web con reservas online | 1.500–2.500€ | 10–15 días |
| Web + SEO local | 1.500–2.000€ | 10–14 días |
| Portal de clientes / dashboard | 2.000–3.500€ | 15–25 días |
| Mantenimiento mensual | 50–80€/mes | recurrente |
| Mini SaaS vertical | 3.500–8.000€ | 30–60 días |

### Regla de precio
> Nunca justifiques el precio con horas.  
> Justifícalo siempre con el valor que aporta al negocio.  
> Propón siempre 2 opciones: básica y completa.

---

## Notas del sistema

### Qué hacer cuando un cliente no responde
1. Día 3 sin respuesta: email de seguimiento corto
2. Día 5: llamada directa
3. Día 8: WhatsApp de cierre ("entiendo que quizás no es el momento...")
4. Si no hay respuesta: pasa a "en pausa" en el pipeline

### Qué NO hacer nunca
- No regalar el trabajo completo como "prueba"
- No bajar el precio sin quitar algo del scope
- No empezar a desarrollar sin contrato o señal mínima del 50%
- No tener más de 5 clientes activos en paralelo al principio

### Señal mínima antes de empezar
> Siempre pedir el 50% antes de empezar.  
> El resto al entregar.  
> Sin excepción.

### Métricas semanales a revisar
- Prospectos nuevos en el pipeline
- Tasa de respuesta a contactos en frío
- Tiempo medio desde primer contacto hasta propuesta
- Tasa de cierre de propuestas enviadas

---

*Última actualización: [fecha]*  
*Sistema construido con Claude + Cursor*
