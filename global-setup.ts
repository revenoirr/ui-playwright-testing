import { chromium } from '@playwright/test';

async function globalSetup() {
  console.log('Starting global setup...');
  
  // You can add any global setup logic here
  // For example, checking if the test site is accessible
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Checking if demoqa.com is accessible...');
    await page.goto('https://demoqa.com', { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');
    console.log('demoqa.com is accessible');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn('Warning: demoqa.com may be slow or inaccessible:', errorMessage);
  } finally {
    await browser.close();
  }
  
  console.log('Global setup completed');
}

export default globalSetup;