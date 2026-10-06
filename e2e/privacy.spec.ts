import { test, expect } from '@playwright/test';

test('Sensitive data (salary and name) never leaves the device in the payload', async ({ page }) => {
  // 1. Preparación: Interceptar peticiones de red hacia nuestras APIs locales
  const apiRequests: any[] = [];
  
  page.on('request', request => {
    // Escuchar todas las peticiones POST que van hacia nuestro backend Next.js
    if (request.method() === 'POST' && request.url().includes('/api/')) {
      apiRequests.push({ url: request.url(), payload: request.postDataJSON() });
    }
  });

  // 2. Acción: Navegar a la página principal
  await page.goto('/');

  // Llenar el formulario principal
  await page.fill('input[name="jobTitle"]', 'Desarrollador Full Stack');
  await page.fill('input[name="company"]', 'Tech Corp');
  await page.fill('input[name="experienceYears"]', '5');
  
  // DATOS SENSIBLES
  await page.fill('input[name="currentSalary"]', '15000'); 
  await page.fill('input[name="desiredSalary"]', '25000'); 

  // Abrir detalles opcionales
  await page.click('button:has-text("Más detalles")');
  
  // DATOS SENSIBLES
  await page.fill('input[name="name"]', 'Juan Pérez'); 

  // Enviar el formulario
  await page.click('button:has-text("Crear carta")');

  // Esperar a que la primera petición a la API termine
  await page.waitForResponse(response => response.url().includes('/api/salary') && response.status() === 200);

  // 3. Afirmación (Assert): Revisar los payloads capturados en la red
  expect(apiRequests.length).toBeGreaterThan(0);

  for (const req of apiRequests) {
    const payload = req.payload;
    
    // VERIFICACIÓN CRÍTICA: Los datos sensibles NO deben existir en el payload que viaja por internet
    expect(payload.currentSalary).toBeUndefined();
    expect(payload.desiredSalary).toBeUndefined();
    expect(payload.name).toBeUndefined();

    // Verificación de cordura: los datos no-sensibles SÍ deben existir
    expect(payload.jobTitle).toBe('Desarrollador Full Stack');
    expect(payload.company).toBe('Tech Corp');
  }
});
