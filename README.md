# Generador de Cartas de Presentación — Arquitectura *Split Brain*

Genera cartas de presentación altamente persuasivas para aplicar a ofertas laborales, sin comprometer tu privacidad. A diferencia de un ChatGPT genérico, la aplicación utiliza una arquitectura *split brain* ("cerebro dividido") para asegurar que tu información sensible nunca llegue a los modelos de inteligencia artificial externos, mientras te ofrece retroalimentación valiosa en tiempo real.

## Qué hace la aplicación

Ingresas los datos del puesto al que aplicas, la empresa, tus años de experiencia y tus expectativas salariales. También puedes, opcionalmente, ingresar tu nombre, perfil de LinkedIn y más información. La aplicación:
1. Evalúa si tu expectativa salarial es realista comparándola con datos reales de la empresa en Glassdoor, dándote consejos de negociación.
2. Extrae tu experiencia relevante desde tu LinkedIn (si lo provees).
3. Escribe una carta de presentación persuasiva, adaptada a la oferta, usando Gemini Pro.

## Arquitectura Split Brain en pocas palabras

**Qué es.** La aplicación reparte el trabajo entre la computadora del usuario (el navegador web) y un backend conectado a la nube. En nuestra implementación, lo que exige razonamiento y redacción se delega a modelos grandes de lenguaje en la nube (Gemini Pro), mientras que la manipulación de datos sensibles y las reglas matemáticas o de negocio se manejan localmente o en rutas controladas, usando expresiones regulares o lógica tradicional.

**Por qué dividir.**

| Razón | En esta app |
| --- | --- |
| **Privacidad** | El salario deseado, salario actual y nombre del usuario **nunca** son enviados a Gemini ni a Serper. |
| **Latencia** | El análisis salarial utiliza reglas rápidas locales (regex) para parsear los datos devueltos por Serper, de modo que el usuario puede ver los tips salariales al instante mientras espera que se termine de escribir la carta. |
| **Calidad** | Gemini Pro redacta la carta creativa, y el código tradicional asegura que la ortografía de los nombres o números sea exacta reemplazándolos y restaurándolos localmente. |
| **Seguridad** | Las claves de las APIs externas nunca están en el cliente; todas las llamadas pasan por el servidor (Next.js Route Handlers). |

### Los cerebros en el proceso

| Qué sucede | Cerebro | Por qué ahí |
| --- | --- | --- |
| Formulario de captura | Local (Navegador) | Interacción inmediata con el usuario. |
| Sanitización de datos (Quitar nombres) | Servidor (Node.js) | El servidor controla y asegura que la data a la nube no contenga nombres antes de enviar a Gemini o Enrich Layer. |
| Consulta a Glassdoor / Serper | Servidor (Node.js) | Requiere de la API key de Serper (privada). |
| Consulta a LinkedIn / Enrich Layer | Servidor (Node.js) | Requiere de la API key de Proxycurl/Enrich Layer (privada). |
| Análisis de texto de salarios (Regex) | Local (Navegador) | Lógica matemática y parseo rápido sin necesidad de LLM y latencia extra. |
| Creación de la carta de presentación | Nube (Gemini) | Requiere creatividad avanzada para conectar la experiencia con la oferta. |
| Restauración del nombre del usuario | Local (Navegador) | El nombre real solo existe localmente para firmar la carta terminada. |

[PLACEHOLDER: SCREENSHOTS DE LA APP AQUÍ]

---

## Arquitectura

![Arquitectura Split Brain](docs/diagrams/architecture.png)

### Heurísticas locales: Análisis Salarial sin LLM

Extraer el salario mensual desde textos desordenados de Glassdoor no utiliza IA en absoluto. Para evitar alucinaciones, la extracción se hace localmente utilizando `Regex` y heurísticas matemáticas:

| Lógica | Por qué se hace con código |
| --- | --- |
| Regex para capturar montos, monedas (`USD`, `GTQ`) y modificadores (`K`). | Extracción precisa sin malentendidos (ej: un número K siempre es * 1000). |
| Determinar tipo de salario mensual vs anual y tasa de conversión local (`1 USD = 7.8 GTQ`). | Reglas matemáticas deterministas, a prueba de fallos, instantáneo. |
| Priorizar datos locales en GTQ antes que dólares convertidos. | Evita enviar instrucciones complejas a un modelo, el código toma la mejor decisión según existencia de arrays. |
| Decisión de Negociación (Matriz de porcentajes). | Genera una nota privada específica ("Estás un 30% por debajo") que un modelo podría calcular mal o sesgar. |

**Dónde sucede el split brain:**
En el cliente, los datos se recogen, pero la decisión de qué va a la nube recae en el servidor que orquesta todo en `src/app/api/generate/route.ts`. Antes de pedirle a Gemini que genere la carta, se ejecuta una función sanitizadora:

```typescript
// Sanitize linkedinData to ensure no names or PII are passed to the prompt
let sanitizedLinkedinData = null;
if (linkedinData) {
  sanitizedLinkedinData = JSON.parse(JSON.stringify(linkedinData));
  
  if (sanitizedLinkedinData.name) delete sanitizedLinkedinData.name;
  if (sanitizedLinkedinData.first_name) delete sanitizedLinkedinData.first_name;
  if (sanitizedLinkedinData.last_name) delete sanitizedLinkedinData.last_name;
}
```

---

## Integración con APIs, Costos y Privacidad

| API | Uso | Costo | Autenticación | Si falla... | Privacidad (Qué se envía) |
| --- | --- | --- | --- | --- | --- |
| **Serper (Google Search)** | Extraer snippets de Glassdoor | ~$0.001 por llamada | Route handler con `X-API-KEY`. | Se usan datos locales precargados de simulación o fallback lógico (verificación de incremento salarial +20%). | Título del puesto, empresa y país ("Guatemala"). |
| **Proxycurl / Enrich Layer** | Extraer experiencia del perfil de LinkedIn | ~$0.015 por llamada | Route handler con token `Bearer`. | Se utiliza el campo "Acerca de mí" ingresado por el usuario, sin perfil extendido. | **Únicamente la URL** del perfil de LinkedIn. |
| **Gemini Pro (Google AI)** | Generar la carta usando `gemini-3.8-flash` | Varía (Free tier a veces) | Route handler, usando `@google/genai` con `GEMINI_API_KEY`. | Retorna una carta mock en caso de ausencia de API o falla. | Resumen personal, Puesto, Empresa, Años Exp, URL de Job (Sin PII, sin nombre, sin salarios). |

### Los Prompts de Gemini

En la ruta `api/generate/route.ts`, la instrucción enviada al modelo es clara sobre su rol y sus restricciones, en formato *few-shot* pero concisa:

```text
You are an expert career coach and copywriter. Your task is to write a highly compelling, professional, and modern cover letter for a candidate.

**IMPORTANT RULES:**
1. The output MUST be entirely in SPANISH.
2. DO NOT include the candidate's name or any placeholder for a signature at the end. The application will handle the name locally.
3. Be persuasive, highlighting the candidate's value based on the provided information.
4. Keep it concise (3-4 short paragraphs). No fluff.
```
A este prompt se le adjuntan, serializados, los años de experiencia, la empresa, y la trayectoria de LinkedIn anonimizada.

---

## Estructura del Proyecto

```
c:\Users\luisr\cover-letter-local
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/route.ts   (Orquestador y Gemini)
│   │   │   ├── linkedin/route.ts   (Enrich Layer proxy)
│   │   │   └── salary/route.ts     (Serper/Glassdoor proxy)
│   │   └── page.tsx                (Frontend del generador y UI)
├── docs/
│   ├── diagrams/                   (Imágenes de arquitectura)
├── AGENTS.md                       (Reglas de comportamiento IA)
├── SPEC.md                         (Especificaciones del producto)
├── PROMPTS.md                      (Flujo de desarrollo original)
└── LOCAL_BRAIN.md                  (Lógica regex de salarios)
```

## Cómo Configurar y Ejecutar

1. **Clonar e Instalar:**
   ```bash
   npm install
   ```

2. **Variables de Entorno:**
   Copiar `.env.example` a `.env.local` y agregar tus API Keys. Ninguna de estas claves llega al navegador.
   ```env
   GEMINI_API_KEY=tu_gemini_key
   PROXYCURL_API_KEY=tu_proxycurl_key
   SERPER_API_KEY=tu_serper_key
   ```
   *(Nota: si dejas las llaves en blanco, los endpoints utilizarán datos precargados ("Mocks") para que puedas evaluar el UI y la lógica de análisis).*

3. **Desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en el navegador.
