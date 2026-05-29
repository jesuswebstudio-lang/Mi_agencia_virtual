Aquí tienes todo el contenido estructurado en formato Markdown para que puedas copiarlo, pegarlo directamente en un archivo llamado `GUIA.md` (o el nombre que prefieras) y revisarlo con calma en tu editor de código:

```markdown
# Guía de Arquitectura e Implementación: Bot de WhatsApp con Next.js, Twilio y Gemini API

Este documento técnico recopila toda la información discutida para el desarrollo, depuración y optimización de tu bot de WhatsApp. Utiliza esta guía para revisar tu código actual, corregir los problemas de cuotas (tokens) y reintentos, y estructurar la persistencia de datos.

---

## 1. Arquitectura del Sistema y Flujo de Datos

El bot opera bajo una arquitectura dirigida por eventos (*Event-Driven*) basada en Webhooks y funciones Serverless (Vercel).


```

[Usuario (WhatsApp)]
│ (Envía mensaje)
▼
[Twilio WhatsApp Gateway]
│ (HTTP POST - application/x-www-form-urlencoded)
▼
[Vercel Serverless Function] (api/chat/whatsapp)
│ (Extrae 'Body' y valida firma)
├─► [Base de Datos] (Opcional: Consulta/Guarda Historial)
│
│ (Petición segura con GEMINI_API_KEY en servidor)
▼
[Google Gemini API]
│ (Retorna texto generado)
▼
[Vercel Serverless Function]
│ (Genera TwiML XML )
▼
[Twilio WhatsApp Gateway]
│ (Renderiza y entrega)
▼
[Usuario (WhatsApp)]

```

---

## 2. Diagnóstico de Problemas Actuales

### A. El "Muro" de los Tokens por Minuto (TPM)
* **Síntoma:** El bot funciona bien 3 o 4 veces y de repente deja de responder o arroja un error `429 (Quota Exceeded)`.
* **Causa:** El plan gratuito (*Free Tier*) de Gemini limita severamente los **Tokens por Minuto (32,000 TPM)**. Aunque no estés enviando un array de historial de forma explícita, si tus instrucciones del sistema (*System Instructions*) son densas o extensas, cada mensaje consume miles de tokens de golpe. Al interactuar rápidamente, superas el límite por minuto.
* **Solución temporal:** Esperar 60 segundos exactos para que el contador de tokens flotante regrese a cero.
* **Solución definitiva:** Migrar al plan **Pay-as-you-go** de Google AI Studio. Con el modelo `gemini-2.5-flash`, el límite sube a 4,000,000 TPM y el costo es marginal (aprox. $0.075 USD por millón de tokens de entrada).

### B. El Bucle de Preguntas Repetidas e Inexistencia de Memoria
* **Problema de Memoria:** Las rutas de API en Vercel son *Serverless*. No retienen estado en memoria RAM entre ejecuciones. Cualquier variable global (`let memoria = []`) se destruye inmediatamente después de enviar la respuesta HTTP.
* **Problema de Reintentos de Twilio:** **Twilio tiene un timeout estricto de 4.9 segundos**. Si Gemini tarda más de ese tiempo en responder, Twilio asume que el paquete se perdió y **vuelve a enviar el mismo mensaje hasta 3 veces**. Tu servidor de Vercel procesa cada reintento como un mensaje nuevo, duplicando el consumo de tokens y haciendo que el bot repita las mismas preguntas de forma caótica.

---

## 3. Especificaciones del Código (Next.js API Route)

Al revisar tu archivo en `api/chat/whatsapp`, asegúrate de implementar las siguientes correcciones estructurales:

### Manejo del Cuerpo de la Petición (`FormData`)
Twilio **no** envía datos en formato JSON (`application/json`). Envía los datos codificados como un formulario web (`application/x-www-form-urlencoded`). Tu código debe procesar la petición usando `request.formData()` en lugar de `request.json()`.

### Plantilla de Código Sugerida (App Router)

A continuación se detalla la estructura correcta y segura para tu endpoint empleando el SDK oficial de Gemini (`@google/genai`):

```javascript
// app/api/chat/whatsapp/route.js
import { GoogleGenAI } from '@google/genai';

// Inicialización segura usando la variable de entorno configurada en Vercel
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    // 1. CRÍTICO: Leer los datos en formato Form Data (Requerido por Twilio)
    const formData = await request.formData();
    
    const mensajeUsuario = formData.get('Body'); // Mensaje entrante
    const telefonoUsuario = formData.get('From'); // Identificador único (ej: whatsapp:+549...)

    if (!mensajeUsuario) {
      return new Response('Missing Body parameter', { status: 400 });
    }

    /* 2. REVISIÓN DE MEMORIA (Estrategia recomendada para producción):
       - Aquí deberías consultar tu Base de Datos (Supabase, Redis, MongoDB) usando 'telefonoUsuario'.
       - Recuperar los últimos X mensajes del historial.
       - Construir el array estructurado para Gemini.
    */
    
    // Ejemplo de estructura de historial que espera recibir la API:
    // const historial = [
    //   { role: 'user', parts: [{ text: 'Hola' }] },
    //   { role: 'model', parts: [{ text: '¡Hola! ¿En qué te ayudo?' }] }
    // ];

    // 3. Ejecución de Gemini usando el modelo optimizado de baja latencia
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Indispensable usar Flash para no superar los 4.9s de Twilio
      contents: mensajeUsuario,   // Si tienes historial, pasa el array aquí en lugar del string simple
      /*
      config: {
        systemInstruction: "Sé un asistente breve y conciso.", // Mantén esto corto en desarrollo
      }
      */
    });

    const respuestaBot = response.text;

    // 4. Construcción de la respuesta TwiML (XML) que Twilio requiere
    const twimlResponse = `
      <Response>
        <Message>${respuestaBot}</Message>
      </Response>
    `;

    // 5. Retorno de la respuesta con el Content-Type correcto
    return new Response(twimlResponse, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });

  } catch (error) {
    console.error("Error crítico en el webhook del bot:", error);
    
    // Devolver un XML vacío previene que Twilio se quede intentando indefinidamente
    return new Response('<Response></Response>', {
      status: 500,
      headers: { 'Content-Type': 'text/xml' },
    });
  }
}

```

---

## 4. Lista de Verificación para Producción (Vercel & Seguridad)

* [ ] **Variables de Entorno en Vercel:** Comprobar que la clave `GEMINI_API_KEY` esté dada de alta en el panel de control de tu proyecto (*Settings > Environment Variables*) y asignada al entorno de *Production*.
* [ ] **Filtro de Git (`.gitignore`):** Verificar que tu archivo `.env` o `.env.local` local nunca se suba a GitHub.
* [ ] **Ejecución estricta en Servidor:** Asegurarse de que ninguna sección del frontend de la app web intente importar el SDK de Gemini o leer `process.env.GEMINI_API_KEY`, exponiendo la clave en el navegador.
* [ ] **Selección de Modelo:** Forzar el uso de `gemini-2.5-flash` para mantener los tiempos de procesamiento por debajo del umbral de desconexión de Twilio.
* [ ] **Validación de Firma (Seguridad Avanzada):** Implementar en el futuro la verificación de la cabecera `X-Twilio-Signature` utilizando el SDK de Twilio para asegurar que nadie pueda realizar peticiones HTTP maliciosas directamente a tu URL de Vercel.

```

```