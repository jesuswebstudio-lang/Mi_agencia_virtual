
# Fluxia — Documento de Proyecto Completo

## Identidad de Marca

| Elemento | Definición |
|---|---|
| **Nombre** | Fluxia |
| **Tagline** | *"El sistema que gestiona tu negocio mientras tú lo haces crecer."* |
| **Propuesta de valor** | Automatización de reservas, atención al cliente y tareas repetitivas vía WhatsApp e IA para pequeños negocios en España. Sin complicaciones técnicas, funcionando en 48 horas. |
| **Mercado objetivo** | Restaurantes, peluquerías y hookahs en España |
| **Posicionamiento** | Consultor experto en automatización |
| **Tono de marca** | Formal y profesional en estructura, con cercanía estratégica. Sin tecnicismos, siempre orientado a resultados de negocio. |
| **CTA principal** | *"Solicitar demo gratuita"* |

---

## Productos

### Fluxia Auto — Solo Automatización
Sistema de automatización vía WhatsApp + reservas + IA. Para negocios que ya tienen web o no la necesitan.

### Fluxia Pro — Web + Automatización
Pack completo: web profesional + sistema de automatización + IA. Todo en uno.

---

## Estructura de la Web

```
1. Hero          — Tagline + propuesta de valor + CTA "Solicitar demo gratuita"
2. Problema      — Los 6 dolores del negocio
3. Solución      — Los 3 pilares de Fluxia
4. Cómo funciona — 4 pasos simples
5. Productos     — Fluxia Auto vs Fluxia Pro
6. Sectores      — Restaurantes / Peluquerías / Hookahs
7. Precios       — Planes separados por producto
8. Demo          — Bot interactivo en vivo
9. Contacto      — Formulario + WhatsApp
```

---

## Contenido por Sección

### Sección 2 — El Problema
Los dolores que identificamos en estos negocios:

1. Pierdes reservas porque no puedes contestar el WhatsApp a todas horas
2. Tus trabajadores están sirviendo mesas y no pueden atender llamadas al mismo tiempo
3. Tu equipo pierde tiempo respondiendo siempre las mismas preguntas
4. Los clientes se van a la competencia si no reciben respuesta inmediata
5. Gestionas citas y reservas a mano, con margen de error constante
6. No tienes tiempo para hacer crecer el negocio porque estás apagando fuegos

---

### Sección 3 — La Solución
Tres pilares de Fluxia:

| Pilar | Título | Descripción |
|---|---|---|
| 🤖 | **Atención 24/7** | Un asistente inteligente por WhatsApp que responde, reserva y gestiona sin intervención humana |
| 📅 | **Reservas automáticas** | El sistema confirma, recuerda y gestiona cancelaciones solo, sin que nadie tenga que intervenir |
| 📈 | **Tu negocio siempre activo** | Mientras tu equipo se centra en dar el mejor servicio, Fluxia se encarga del resto |

---

### Sección 4 — Cómo Funciona
Cuatro pasos simples:

| Paso | Título | Descripción |
|---|---|---|
| 0️⃣ | **Tu presencia online** | ¿No tienes web o necesitas renovarla? Creamos una web profesional adaptada a tu negocio como parte del pack *(opcional, solo Fluxia Pro)* |
| 1️⃣ | **Cuéntanos tu negocio** | Analizamos tu negocio y diseñamos el sistema adaptado a tus necesidades en una llamada de 30 minutos |
| 2️⃣ | **Configuramos todo** | Nuestro equipo instala y configura Fluxia en tu WhatsApp sin que tengas que hacer nada técnico |
| 3️⃣ | **Tu negocio en piloto automático** | En menos de 48 horas tu asistente ya está atendiendo clientes, gestionando reservas y trabajando por ti |

---

### Sección 6 — Sectores

#### 🍽️ Restaurantes
- Reservas automáticas por WhatsApp sin intervención del personal
- Gestión de lista de espera en tiempo real
- Respuestas automáticas a preguntas frecuentes (carta, horarios, alergias)
- Respuesta automática a reseñas de Google
- Recordatorio de reserva al cliente 24h antes

#### ✂️ Peluquerías
- Reserva de cita eligiendo empleado y servicio por WhatsApp
- Recordatorio automático 24h antes para reducir no-shows
- Lista de espera si no hay hueco disponible
- Seguimiento post-visita para fidelizar clientes
- Promociones automáticas a clientes inactivos

#### 💨 Hookahs
- Reserva de cabina o zona para grupos por WhatsApp
- Información automática sobre sabores, precios y normas
- Gestión de lista de espera en tiempo real
- Confirmación de asistencia para grupos grandes
- Promociones automáticas para grupos y eventos

---

### Sección 7 — Precios

> **14 días de prueba gratuita en todos los planes. Sin tarjeta de crédito.**

#### Fluxia Auto — Solo Automatización

| Plan | Mensual | Anual (-15%) | Incluye |
|---|---|---|---|
| **Starter** | €49/mes | €41/mes | WhatsApp bot + reservas automáticas + FAQ |
| **Pro** ⭐ *Más popular* | €89/mes | €75/mes | Todo lo anterior + recordatorios + respuesta reseñas Google |
| **Elite** | €149/mes | €126/mes | Todo lo anterior + analytics + soporte prioritario 24/7 |

#### Fluxia Pro — Web + Automatización

| Plan | Setup único | Mensual | Anual (-15%) | Incluye |
|---|---|---|---|---|
| **Starter** | €799 | €49/mes | €41/mes | Web profesional + Fluxia Auto Starter |
| **Pro** ⭐ *Más popular* | €1.199 | €89/mes | €75/mes | Web premium + Fluxia Auto Pro |
| **Elite** | €1.799 | €149/mes | €126/mes | Web a medida + Fluxia Auto Elite |

---

## Stack Técnico

| Herramienta | Función | Coste aprox. |
|---|---|---|
| **n8n** | Automatización central de flujos | €20/mes |
| **Twilio / 360dialog** | WhatsApp Business API | €10/mes |
| **Claude API / GPT-4o** | Inteligencia del bot | ~€20/mes |
| **Supabase** | Base de datos | Gratis |
| **Cal.com** | Gestión de citas | Gratis |
| **Vercel** | Hosting web | Gratis |
| **Next.js + Tailwind** | Frontend web | — |
| **Total estimado** | | **~€50/mes** |

---

## Flujo del Sistema de Automatización

```
Cliente manda WhatsApp
        ↓
IA entiende la intención
(reservar / cancelar / preguntar / queja)
        ↓
    ¿Es reserva?
    /          \
  Sí            No
  ↓              ↓
Comprueba    Responde con
disponibilidad   FAQ del negocio
  ↓
Confirma y guarda en base de datos
  ↓
Recordatorio automático 24h antes
```

---

## Hoja de Ruta

```
FASE 1 — Construcción de la web        (en curso)
  ├── Hero
  ├── Problema
  ├── Solución
  ├── Cómo funciona
  ├── Productos
  ├── Sectores
  ├── Precios
  ├── Demo interactiva del bot
  └── Contacto

FASE 2 — Sistema de automatización
  ├── Configuración WhatsApp API
  ├── Flujos n8n por sector
  ├── Integración Claude API
  └── Conexión con Supabase + Cal.com

FASE 3 — Primeros clientes
  ├── Demo funcional lista
  ├── Visitas en persona a negocios
  ├── 3-5 clientes piloto (gratis o precio reducido)
  └── Casos de éxito reales

FASE 4 — Escalar
  ├── Automatización del onboarding
  ├── Automatización de ventas
  └── Expansión a nuevos sectores
```

---

## Stack de Herramientas Gratuitas

### Desarrollo de la Web
| Programa | Para qué | Coste |
|---|---|---|
| **VS Code** | Editor de código | ✅ Gratis |
| **Next.js + Tailwind** | Framework web | ✅ Gratis |
| **Vercel** | Hosting web | ✅ Tier gratuito |
| **GitHub** | Guardar y versionar código | ✅ Gratis |

### Automatización e IA
| Programa | Para qué | Coste |
|---|---|---|
| **n8n** | Automatización de flujos | ✅ Self-hosted gratis |
| **Claude API** | Inteligencia del bot | ✅ Créditos iniciales |
| **Supabase** | Base de datos | ✅ Tier gratuito |
| **Cal.com** | Gestión de citas | ✅ Gratis |

### WhatsApp
| Programa | Para qué | Coste |
|---|---|---|
| **Meta Business Suite** | Crear cuenta WhatsApp Business | ✅ Gratis |
| **360dialog** | Conectar WhatsApp a n8n | ✅ Primeros 30 días |
| **Twilio** | Alternativa a 360dialog | ✅ Créditos de prueba |

### Diseño
| Programa | Para qué | Coste |
|---|---|---|
| **Figma** | Diseñar antes de programar | ✅ Tier gratuito |
| **Canva** | Logos y materiales de venta | ✅ Tier gratuito |
| **Lucide Icons** | Iconos para la web | ✅ Gratis |
| **Unsplash** | Fotos sin licencia | ✅ Gratis |

### Gestión y Ventas
| Programa | Para qué | Coste |
|---|---|---|
| **Notion** | Organizar el proyecto | ✅ Tier gratuito |
| **Google Workspace** | Email, Drive, Docs | ✅ Gmail básico gratis |
| **Calendly** | Agendar demos con clientes | ✅ Tier gratuito |
| **WhatsApp Business** | Canal de ventas directo | ✅ Gratis |

---

## Estrategia Demo → Traspaso

### Cómo funciona

```
DEMO (todo gratis)
├── Web en Vercel gratis          → fluxia-demo.vercel.app
├── Bot en n8n self-hosted        → servidor propio
├── Base de datos Supabase gratis → proyecto temporal
├── WhatsApp con Twilio trial     → número de prueba
└── Citas con Cal.com gratis      → calendario temporal

        ↓ Cliente decide comprar

TRASPASO (el cliente paga)
├── Dominio propio                → restauranteX.com
├── Vercel conectado al dominio   → 5 minutos
├── Supabase nuevo proyecto       → datos migrados
├── 360dialog cuenta propia       → su número de WhatsApp real
├── Cal.com cuenta propia         → su calendario real
└── n8n apuntando a lo nuevo      → 1 hora de trabajo
```

### Costes reales por cliente

| Servicio | Demo | Cliente al comprar |
|---|---|---|
| Hosting web | Gratis | €0 (Vercel gratis) |
| Base de datos | Gratis | €0 (Supabase gratis) |
| WhatsApp API | Trial gratis | ~€10/mes |
| IA (Claude API) | Créditos gratis | ~€20/mes |
| n8n | Self-hosted gratis | Incluido en el servicio |
| Dominio | No aplica | ~€12/año (el cliente) |

**Coste real por cliente activo: ~€30/mes**
**Precio mínimo cobrado: €49/mes**
**Margen desde el primer cliente: ~€19/mes mínimo**

### El traspaso paso a paso

Cuando un cliente decide comprar, el proceso completo es:

1. Crear las cuentas en Supabase, Vercel y 360dialog a nombre del cliente
2. Copiar el código del repositorio GitHub y conectarlo a su dominio
3. Migrar los datos de la demo a su base de datos nueva
4. Actualizar las variables en n8n con sus nuevas credenciales
5. Probar que todo funciona antes de la entrega final

**Tiempo estimado por traspaso: 2 a 4 horas**

> La demo que se le enseña al cliente ya es el producto real, no un prototipo. El traspaso es básicamente cambiar credenciales y apuntar al dominio del cliente.

---

## Sistema de Ventas Automatizado

El propio negocio de Fluxia opera con un sistema de ventas automatizado. Mientras se construye el producto, este sistema trabaja captando clientes en paralelo sin intervención manual.

### Herramientas del sistema

| Herramienta | Función | Estado |
|---|---|---|
| **n8n** | Orquestador central del flujo | ✅ Ya en stack |
| **Claude API** | Agente que toma decisiones | ✅ Ya en stack |
| **FireCrawl** | Buscar prospectos en Google Maps y web | 🆕 Añadir |
| **Gmail** | Outreach automatizado y personalizado | 🆕 Añadir |
| **Cal.com** | Agendar demos automáticamente | ✅ Ya en stack |
| **Airtable** | CRM y pipeline de ventas en tiempo real | 🆕 Añadir |
| **Stripe** | Cobros automáticos + webhooks de pago | 🆕 Añadir |

### Flujo completo

```
SCHEDULE (cada noche, trigger automático)
        ↓
CLAUDE busca negocios sin automatización
en Google Maps y web por sector
(restaurantes, peluquerías, hookahs)
        ↓
Genera email personalizado por sector
("Hola, vi que tu restaurante gestiona
reservas manualmente...")
        ↓
Gmail envía automáticamente
        ↓
¿Respondió el prospecto?
    /                    \
   Sí                     No
   ↓                       ↓
Claude clasifica        Seguimiento
la intención            automático a los 3 días
   ↓
¿INTERESTED / OBJECTION / NO REPLY?
   ↓                    ↓
INTERESTED          OBJECTION
Cal.com agenda      Claude genera respuesta
demo automática     para rebatir la objeción
   ↓
Tú haces la demo → cliente paga por Stripe
        ↓
Stripe webhook → n8n detecta el pago
        ↓
Airtable actualiza estado a PAID
        ↓
Inicio automático del onboarding
```

### Lógica de clasificación automática

Cuando un prospecto responde al email, Claude lee la respuesta y clasifica:

- **INTERESTED** → agenda llamada en Cal.com automáticamente y confirma por email
- **OBJECTION** → detecta el tipo de objeción ("muy caro", "no lo necesito") y genera respuesta personalizada para rebatirla
- **NO REPLY** → programa seguimiento automático a los 3 días con mensaje diferente

### Pipeline en Airtable

```
AA PROSPECT          STATUS       AMOUNT
─────────────────────────────────────────
Restaurante X        PAID         €890
Peluquería Y         PAID         €390
Hookah Z             PAID         €400
Negocio A            PROPOSAL     —
Negocio B            DECLINED     —
Negocio C            NO REPLY     —
```

Todo actualizado automáticamente por Claude vía n8n. Cero intervención manual.

### Stripe + Webhooks

Cuando un cliente paga:

1. Stripe lanza un webhook a n8n
2. n8n detecta el evento `payment_intent.succeeded`
3. Claude actualiza Airtable con estado PAID
4. Se dispara automáticamente el flujo de onboarding del cliente

### Referencia

Sistema inspirado en el experimento de **@lasthumannode** — $1,240 recaudados en 6 días usando Claude + FireCrawl + Gmail + Cal.com + Airtable + Stripe, con cero intervención manual tras la configuración inicial.

---

## Notas de Construcción

- La web se construye en **Next.js + Tailwind CSS**
- La demo interactiva del bot se integra directamente en la web
- Cada sector tiene su propia subsección con dolores y soluciones específicas
- El plan Pro se destaca visualmente como "Más popular" en la tabla de precios
- El tono de todos los textos es formal con cercanía, sin tecnicismos
- Siempre orientar el copy a resultados de negocio, nunca a tecnologí
