# Pendientes del Tech Demo

Este documento detalla los requerimientos faltantes para completar con éxito las condiciones del reto "Tech demo: App de cover letter con split brain".

## ❌ Lo que hace falta (Action Required)




### 5. Artículo (`Entregables`)
- **Requisito:** *"Un artículo enfocado en un área... Enseña lo que aprendiste a alguien que nunca ha oído de split brain..."*
- **Estado Actual:** Entregable externo (Substack, Medium). Requiere que la app esté terminada y tener capturas de pantalla listas.
- **Acción:** Redactar y publicar el artículo de forma personal.

---

## ✅ Lo que ya está completado
- **API de IA Adicional (Omitida):** Se decidió omitir la implementación de una API de IA adicional (como TTS o Traducción) para mantener la pureza y simplicidad del demo técnico de *Split-Brain*.
- **Documentación Detallada de las APIs:** Se incluyó en el `README.md` una sección detallada y separada para cada API (Gemini, Serper, Proxycurl) explicando autenticación, manejo de errores, costos, y los payloads enviados.
- **Funcionamiento Sin Conexión:** Se implementaron *fallbacks* (interceptando fallas de API locales o de red) para continuar operando offline. La app genera una carta de presentación estática genérica e informa si la expectativa salarial es realista evaluando un incremento menor al 20% dentro del estándar local.
- **Pruebas Automatizadas de Privacidad:** Se implementó una prueba End-to-End con Playwright que intercepta la red para demostrar irrefutablemente que el salario actual y el nombre nunca salen del dispositivo.
- **Generación de Carta y Nota de Negociación:** La app funciona, pide franqueza en los datos y devuelve los dos entregables de forma útil.
- **Arquitectura Split Brain:** Lógica separada correctamente (heurística local mediante regex para salarios, modelo en la nube para generación de texto).
- **Justificaciones Válidas:** Se justifica por privacidad (nombres/salarios no salen de local) y costo/latencia (evitando llamar al LLM para extracción de datos).
- **Modelo en la Nube:** Gemini Pro integrado.
- **API Adicional (Otro tipo):** Serper y Proxycurl integrados exitosamente.
