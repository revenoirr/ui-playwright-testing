import { test, expect, Dialog } from '@playwright/test';

// Extend the Window interface to include our custom property
declare global {
  interface Window {
    dialogHandled: boolean;
  }
}

test.describe('Alerts page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demoqa.com/alerts');
    
    // Use domcontentloaded instead of networkidle - more reliable
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for the main content to be visible instead of networkidle
    await page.waitForSelector('.main-header', { timeout: 15000 }).catch(() => {
      console.log('Main header not found, continuing...');
    });

    await page.evaluate(() => {
      const selectorsToRemove = [
        '#fixedban',
        '[id*="google_ads"]',
        '[class*="ad"]',
        '.advertisement',
        '[id*="banner"]',
        '.popup',
        '.modal',
        '[class*="overlay"]'
      ];

      selectorsToRemove.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });

      const style = document.createElement('style');
      style.textContent = `
        * { pointer-events: auto !important; }
        body { overflow: visible !important; }
      `;
      document.head.appendChild(style);
    });

    // Reduced wait time
    await page.waitForTimeout(1000);
  });

  test('Prompt alert - input and accept', async ({ page }) => {
    const promptButtonSelector = '#promtButton';

    await page.waitForSelector(promptButtonSelector, { state: 'visible', timeout: 10000 });
    await page.locator(promptButtonSelector).scrollIntoViewIfNeeded();

    // Set up dialog handler BEFORE clicking
    let dialogHandled = false;
    const dialogHandler = async (dialog: Dialog) => {
      if (!dialogHandled) {
        dialogHandled = true;
        expect(dialog.message()).toBe('Please enter your name');
        await dialog.accept('Playwright');
      }
    };
    
    page.on('dialog', dialogHandler);

    try {
      await page.click(promptButtonSelector, { force: true, timeout: 5000 });
    } catch (clickError) {
      console.log('Regular click failed, trying alternative methods...');
      await page.evaluate((selector) => {
        const button = document.querySelector(selector);
        if (button instanceof HTMLElement) {
          button.click();
        }
      }, promptButtonSelector);
    }

    // Wait for the result element to appear with better error handling
    try {
      await page.waitForSelector('#promptResult', { timeout: 10000 });
      await expect(page.locator('#promptResult')).toHaveText('You entered Playwright');
    } catch (error) {
      console.log('Prompt result not found, taking screenshot for debugging');
      await page.screenshot({ path: 'debug-prompt-accept.png' });
      throw error;
    } finally {
      page.off('dialog', dialogHandler);
    }
  });

  test('Prompt alert - dismiss', async ({ page }) => {
    const promptButtonSelector = '#promtButton';

    await page.waitForSelector(promptButtonSelector, { state: 'visible', timeout: 10000 });
    await page.locator(promptButtonSelector).scrollIntoViewIfNeeded();

    // Set up dialog handler BEFORE clicking
    let dialogHandled = false;
    const dialogHandler = async (dialog: Dialog) => {
      if (!dialogHandled) {
        dialogHandled = true;
        expect(dialog.message()).toBe('Please enter your name');
        await dialog.dismiss();
      }
    };
    
    page.on('dialog', dialogHandler);

    try {
      await page.click(promptButtonSelector, { force: true, timeout: 5000 });
    } catch (clickError) {
      await page.evaluate((selector) => {
        const button = document.querySelector(selector);
        if (button instanceof HTMLElement) {
          button.click();
        }
      }, promptButtonSelector);
    }

    // Wait for the result element to appear with better error handling
    try {
      // Try multiple approaches to wait for the result
      await Promise.race([
        page.waitForSelector('#promptResult', { timeout: 10000 }),
        page.waitForFunction(() => {
          const result = document.querySelector('#promptResult');
          return result && result.textContent && result.textContent.trim() !== '';
        }, { timeout: 10000 })
      ]);
      
      await expect(page.locator('#promptResult')).toHaveText('You entered nothing or dismiss the dialog');
    } catch (error) {
      console.log('Prompt result not found, debugging...');
      await page.screenshot({ path: 'debug-prompt-dismiss.png' });
      
      // Check what's actually on the page
      const pageContent = await page.evaluate(() => {
        const result = document.querySelector('#promptResult');
        return {
          resultExists: !!result,
          resultText: result?.textContent,
          resultHTML: result?.innerHTML,
          allResults: Array.from(document.querySelectorAll('[id*="result"], [class*="result"]')).map(el => ({
            tagName: el.tagName,
            id: el.id,
            className: el.className,
            text: el.textContent
          }))
        };
      });
      
      console.log('Page debug info:', pageContent);
      throw error;
    } finally {
      page.off('dialog', dialogHandler);
    }
  });

  test('Simple alert', async ({ page }) => {
    await page.waitForSelector('#alertButton', { state: 'visible', timeout: 10000 });
    
    // Set up dialog handler BEFORE clicking
    let dialogHandled = false;
    const dialogHandler = async (dialog: Dialog) => {
      if (!dialogHandled) {
        dialogHandled = true;
        expect(dialog.message()).toBe('You clicked a button');
        await dialog.accept();
      }
    };
    
    page.on('dialog', dialogHandler);

    try {
      await page.click('#alertButton', { force: true, timeout: 5000 });
    } catch (clickError) {
      await page.evaluate(() => {
        const button = document.querySelector('#alertButton');
        if (button instanceof HTMLElement) {
          button.click();
        }
      });
    }

    // Wait a moment for dialog to be processed
    await page.waitForTimeout(1000);

    page.off('dialog', dialogHandler);
  });

  test('Confirmation alert - accept', async ({ page }) => {
    await page.waitForSelector('#confirmButton', { state: 'visible', timeout: 10000 });
    
    // Set up dialog handler BEFORE clicking
    let dialogHandled = false;
    const dialogHandler = async (dialog: Dialog) => {
      if (!dialogHandled) {
        dialogHandled = true;
        expect(dialog.message()).toBe('Do you confirm action?');
        await dialog.accept();
      }
    };
    
    page.on('dialog', dialogHandler);

    try {
      await page.click('#confirmButton', { force: true, timeout: 5000 });
    } catch (clickError) {
      await page.evaluate(() => {
        const button = document.querySelector('#confirmButton');
        if (button instanceof HTMLElement) {
          button.click();
        }
      });
    }

    // Wait for result and verify
    await page.waitForSelector('#confirmResult', { timeout: 10000 });
    await expect(page.locator('#confirmResult')).toHaveText('You selected Ok');

    page.off('dialog', dialogHandler);
  });

  test('Confirmation alert - dismiss', async ({ page }) => {
    await page.waitForSelector('#confirmButton', { state: 'visible', timeout: 10000 });
    
    // Set up dialog handler BEFORE clicking
    let dialogHandled = false;
    const dialogHandler = async (dialog: Dialog) => {
      if (!dialogHandled) {
        dialogHandled = true;
        expect(dialog.message()).toBe('Do you confirm action?');
        await dialog.dismiss();
      }
    };
    
    page.on('dialog', dialogHandler);

    try {
      await page.click('#confirmButton', { force: true, timeout: 5000 });
    } catch (clickError) {
      await page.evaluate(() => {
        const button = document.querySelector('#confirmButton');
        if (button instanceof HTMLElement) {
          button.click();
        }
      });
    }

    // Wait for result and verify
    await page.waitForSelector('#confirmResult', { timeout: 10000 });
    await expect(page.locator('#confirmResult')).toHaveText('You selected Cancel');

    page.off('dialog', dialogHandler);
  });
});