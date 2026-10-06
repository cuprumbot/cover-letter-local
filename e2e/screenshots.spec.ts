import { test, expect } from '@playwright/test';
import path from 'path';

test('take screenshots for readme', async ({ page }) => {
  // Go to the app
  await page.goto('/');

  // Wait for the form to be visible
  await page.waitForSelector('form');
  
  // Take screenshot of the empty form
  await page.screenshot({ path: path.join(process.cwd(), 'docs', 'assets', 'form_screenshot.png'), fullPage: true });

  // Fill the form (no name)
  await page.fill('input[name="jobTitle"]', 'Desarrollador Full Stack');
  await page.fill('input[name="company"]', 'InnovateTech');
  await page.fill('input[name="experienceYears"]', '4');
  await page.fill('textarea[name="aboutYou"]', 'Soy un desarrollador apasionado por crear soluciones eficientes. Tengo amplia experiencia en React, Node.js y bases de datos relacionales.');
  
  // Use realistic salary values to trigger the "Realista" fallback
  await page.fill('input[name="currentSalary"]', '16000');
  await page.fill('input[name="desiredSalary"]', '18000');

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for the result to generate (wait for the "Carta de Presentación" header in the result section)
  await expect(page.locator('text="Carta de Presentación"')).toBeVisible({ timeout: 15000 });
  
  // Wait until the loading indicator is gone (if any)
  await expect(page.locator('text="Redactando con Inteligencia Artificial"')).toHaveCount(0, { timeout: 15000 });

  // Add a slight delay for any UI animations to settle
  await page.waitForTimeout(1000);

  // Take screenshot of the result
  await page.screenshot({ path: path.join(process.cwd(), 'docs', 'assets', 'result_screenshot.png'), fullPage: true });
});
