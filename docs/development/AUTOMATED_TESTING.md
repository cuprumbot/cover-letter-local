# Pruebas Automatizadas (Automated Testing)

Este documento detalla cómo está configurado el entorno de pruebas para la aplicación, centrándose específicamente en verificar la arquitectura *Split-Brain* y las garantías de privacidad de los datos sensibles de la persona usuaria.

## Por qué usamos Playwright

Para cumplir con el requerimiento de demostrar que el **salario actual y el nombre nunca salen del dispositivo**, escogimos **Playwright** (un framework de pruebas End-to-End).

### La ventaja de E2E sobre Pruebas Unitarias
Las pruebas unitarias tradicionales (con Jest o Vitest) requieren crear un "mock" o simulación de la función `fetch`. Eso solo demuestra que el componente React *intenta* no enviar los datos, pero no es garantía real de lo que el navegador transmite por internet (ya que Next.js podría tener fugas por Server Actions u otros mecanismos).

Playwright nos permite levantar el navegador real (Chromium), interactuar con la interfaz de usuario como lo haría un humano, e **interceptar el tráfico de red real**. Esto nos permite demostrar irrefutablemente que el JSON que sale del navegador hacia el backend NO contiene los datos sensibles.

---

## Cómo ejecutar las pruebas

Sigue estos pasos para correr la prueba automatizada que verifica la privacidad del *Split-Brain*.

### Requisitos previos
1. Instalar dependencias de desarrollo y navegadores:
   ```bash
   npm install -D @playwright/test
   npx playwright install chromium
   ```

2. Levantar el servidor local (la prueba corre contra `localhost:3000`):
   ```bash
   npm run dev
   ```

### Correr la prueba

Abre una nueva terminal en el directorio del proyecto y ejecuta:

```bash
npx playwright test
```

Verás una salida similar a esta, indicando que la prueba de privacidad pasó:
```bash
Running 1 test using 1 worker

  ✓  1 e2e/privacy.spec.ts:3:5 › Sensitive data (salary and name) never leaves the device in the payload (2.5s)

  1 passed (3.0s)
```

Si deseas ver la prueba ejecutándose visualmente en el navegador (para entender cómo interactúa con el formulario), puedes usar:

```bash
npx playwright test --ui
```
o
```bash
npx playwright test --headed
```

---

## 🛡️ Anatomía de la Prueba de Privacidad

La prueba principal vive en `e2e/privacy.spec.ts`. Funciona en 3 pasos:

1. **Preparación (Interceptor de red):** Se añade un "listener" al objeto `page` que escucha cada petición HTTP (`POST`) saliente hacia `/api/`. Guarda el *payload* real (el cuerpo JSON) en un arreglo.
2. **Acción (UI Interaction):** El bot de pruebas navega a la raíz (`/`), llena todos los campos, incluyendo los campos sensibles (`currentSalary`, `desiredSalary`, `name`), y hace clic en "Crear carta".
3. **Afirmación (Assertions):** Una vez que el backend responde, el bot inspecciona los *payloads* que capturó en el paso 1. Utiliza `expect(payload.currentSalary).toBeUndefined()` para garantizar matemáticamente que en ninguna petición HTTP viajó esa información.
