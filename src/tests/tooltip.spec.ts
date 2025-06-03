import { test, expect, Browser, Page } from '@playwright/test';
import { ToolTipsPage } from '../page-objects/ToolTipsPage';
//TODO remove locators to the Page Object
test.describe('Tooltips tests', () => {
  let browser: Browser;
  let page: Page;
  let toolTipsPage: ToolTipsPage;

  test.beforeAll(async ({ browser: testBrowser }) => {
    browser = testBrowser;
  });

  test.beforeEach(async () => {
    // Increase timeout for this test suite
    test.setTimeout(60000);

    try {
      page = await browser.newPage();

      // Set viewport
      await page.setViewportSize({ width: 1280, height: 720 });

      toolTipsPage = new ToolTipsPage(page);
      await toolTipsPage.navigate();

      // Wait for page load with better error handling
      await page.waitForLoadState('domcontentloaded', { timeout: 30000 });

      // Remove blocking elements
      await page.evaluate(() => {
        const banner = document.querySelector('#fixedban');
        if (banner) banner.remove();

        const ads = document.querySelectorAll('[id*="google_ads"], [class*="ad"]');
        ads.forEach(ad => ad.remove());
      });

      // Small delay to ensure page is ready
      await page.waitForTimeout(1000);

    } catch (error) {
      console.error('Setup failed:', error);
      if (page) {
        await page.close();
      }
      throw error;
    }
  });

  test.afterEach(async ({}, testInfo) => {
    try {
      if (testInfo.status !== testInfo.expectedStatus && page) {
        await page.screenshot({
          path: `screenshots/tooltip-${testInfo.title.replace(/\s+/g, '_')}-${Date.now()}.png`
        });
      }
    } catch (error) {
      console.log('Could not take screenshot:', error);
    }

    try {
      if (page) {
        await page.close();
      }
    } catch (error) {
      console.log('Could not close page:', error);
    }
  });

  test('Hover over "Contrary" text shows correct tooltip', async () => {
    try {
      // Wait for the contrary text element to be available
      const contrarySelector = 'a[href="javascript:void(0)"]';
      await page.waitForSelector(contrarySelector, { timeout: 10000 });

      const contraryElements = await page.locator(contrarySelector).all();
      let contraryElement = null;

      // Find the element that contains "Contrary" text
      for (const element of contraryElements) {
        const text = await element.textContent();
        if (text && text.includes('Contrary')) {
          contraryElement = element;
          break;
        }
      }

      if (!contraryElement) {
        // Try alternative selector
        contraryElement = page.locator('text=Contrary').first();
        await contraryElement.waitFor({ timeout: 5000 });
      }

      // Scroll element into view
      await contraryElement.scrollIntoViewIfNeeded();

      // Hover over the element
      await contraryElement.hover();

      // Wait for tooltip to appear
      await page.waitForSelector('.tooltip', { timeout: 5000 });

      // Verify tooltip content
      const tooltipText = await page.locator('.tooltip').textContent();
      expect(tooltipText).toContain('You hovered over the Contrary'); // Fixed expected text

    } catch (error) {
      console.error('Tooltip test failed:', error);
      await page.screenshot({ path: `tooltip-test-debug-${Date.now()}.png` });
      throw error;
    }
  });

  // Add more tooltip tests
  test('Hover over button shows tooltip', async () => {
    try {
      const buttonSelector = '#toolTipButton';
      await page.waitForSelector(buttonSelector, { timeout: 10000 });

      const button = page.locator(buttonSelector);
      await button.scrollIntoViewIfNeeded();
      await button.hover();

      // Wait for tooltip
      await page.waitForSelector('[role="tooltip"]', { timeout: 5000 });

      const tooltip = page.locator('[role="tooltip"]');
      const tooltipText = await tooltip.textContent();
      expect(tooltipText).toBeTruthy();

    } catch (error) {
      console.error('Button tooltip test failed:', error);
      await page.screenshot({ path: `button-tooltip-debug-${Date.now()}.png` });
      throw error;
    }
  });

  test('Hover over text field shows tooltip', async () => {
    try {
      const textFieldSelector = '#toolTipTextField';
      await page.waitForSelector(textFieldSelector, { timeout: 10000 });

      const textField = page.locator(textFieldSelector);
      await textField.scrollIntoViewIfNeeded();
      await textField.hover();

      // Wait for tooltip
      await page.waitForSelector('[role="tooltip"]', { timeout: 5000 });

      const tooltip = page.locator('[role="tooltip"]');
      const tooltipText = await tooltip.textContent();
      expect(tooltipText).toBeTruthy();

    } catch (error) {
      console.error('Text field tooltip test failed:', error);
      await page.screenshot({ path: `textfield-tooltip-debug-${Date.now()}.png` });
      throw error;
    }
  });
});
