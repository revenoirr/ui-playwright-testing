import { test, expect } from '@playwright/test';
//TODO remove locators to the Page Object
const BASE_URL = 'https://demoqa.com/checkbox';

test.describe('Checkbox tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Expand all checkboxes', async ({ page }) => {
    await page.click('button[title="Expand all"]');
    const checkboxes = await page.$$('span.rct-title');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  const checkboxNames = ['Desktop', 'Documents', 'Downloads'];

  for (const name of checkboxNames) {
    test(`Select checkbox: ${name}`, async ({ page }) => {
      await page.click('button[title="Expand all"]');

      const label = await page.locator(`.rct-node span.rct-title:text-is("${name}")`);
      await label.scrollIntoViewIfNeeded();
      await label.click();

      const checkboxState = await page.locator('.display-result').textContent();
      expect(checkboxState?.toLowerCase()).toContain(name.toLowerCase());
    });
  }
});
