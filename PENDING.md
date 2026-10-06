# Pendientes del Tech Demo

Este documento detalla los requerimientos faltantes para completar con éxito las condiciones del reto "Tech demo: App de cover letter con split brain".

## ❌ Lo que hace falta (Action Required)



### 3. Una API de IA Adicional (`APIs Adicionales`)
- **Requisito:** *"Además del modelo en la nube, integra dos APIs adicionales: una de IA (...) y una de cualquier otro tipo."*
- **Estado Actual:** Contamos con el modelo principal en la nube (Gemini Pro) y dos APIs de "otro tipo" (Serper y Proxycurl). **Falta una API de IA secundaria**.
- **Acción:** Seleccionar e integrar un servicio de IA adicional. Ideas:
  - API de Text-to-Speech (ej. ElevenLabs o Google TTS) para "escuchar" la carta de presentación.
  - API de generación de imágenes para crear un fondo creativo o avatar basado en el rol.
  - Un modelo pequeño/edge local para análisis de tono o traducción.

### 4. Documentación Detallada de las APIs (`Entregables`)
- **Requisito:** *"Para cada API documenta cómo se autentica y dónde vive la credencial, qué pasa si falla o tarda, cuánto cuesta y qué datos le envías."*
- **Estado Actual:** El archivo `README.md` explica la arquitectura y el flujo de datos de forma general, pero omite los detalles técnicos requeridos.
- **Acción:** Actualizar el `README.md` para incluir una sección dedicada a cada API (Gemini, Serper, Proxycurl, y la nueva API de IA). Documentar explícitamente:
  - Autenticación y ubicación de credenciales.
  - Manejo de fallos / Timeouts.
  - Costo de las llamadas.
  - Qué datos se incluyen en los payloads.
  - **Extra:** Documentar también cómo ejecutar las pruebas automatizadas de privacidad.

### 5. Artículo (`Entregables`)
- **Requisito:** *"Un artículo enfocado en un área... Enseña lo que aprendiste a alguien que nunca ha oído de split brain..."*
- **Estado Actual:** Entregable externo (Substack, Medium). Requiere que la app esté terminada y tener capturas de pantalla listas.
- **Acción:** Redactar y publicar el artículo de forma personal.

---

## ✅ Lo que ya está completado
- **Funcionamiento Sin Conexión:** Se implementaron *fallbacks* (interceptando fallas de API locales o de red) para continuar operando offline. La app genera una carta de presentación estática genérica e informa si la expectativa salarial es realista evaluando un incremento menor al 20% dentro del estándar local.
- **Pruebas Automatizadas de Privacidad:** Se implementó una prueba End-to-End con Playwright que intercepta la red para demostrar irrefutablemente que el salario actual y el nombre nunca salen del dispositivo.
- **Generación de Carta y Nota de Negociación:** La app funciona, pide franqueza en los datos y devuelve los dos entregables de forma útil.
- **Arquitectura Split Brain:** Lógica separada correctamente (heurística local mediante regex para salarios, modelo en la nube para generación de texto).
- **Justificaciones Válidas:** Se justifica por privacidad (nombres/salarios no salen de local) y costo/latencia (evitando llamar al LLM para extracción de datos).
- **Modelo en la Nube:** Gemini Pro integrado.
- **API Adicional (Otro tipo):** Serper y Proxycurl integrados exitosamente.
