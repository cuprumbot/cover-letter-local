import { test } from '@playwright/test';
import path from 'path';

test('take screenshot of diagram', async ({ page }) => {
  const filePath = path.join(process.cwd(), 'article', 'architecture.html');
  await page.goto(`file://${filePath}`);
  
  // Wait for the JS and animations to settle
  await page.waitForTimeout(1000);
  
  // Take screenshot
  await page.screenshot({ path: path.join(process.cwd(), 'article', 'architecture.png'), fullPage: true });
});
