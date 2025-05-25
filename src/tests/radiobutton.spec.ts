import { test, expect } from '@playwright/test';
import { RadioButtonPage } from '../page-objects/RadioButtonPage';

test.describe('Radio Button Page', () => {
  let radioPage: RadioButtonPage;

  test.beforeEach(async ({ page }) => {
    radioPage = new RadioButtonPage(page);
    await radioPage.navigate();
  });

  const options: string[] = ['Yes', 'Impressive'];

  for (const label of options) {
    test(`select "${label}" radio button`, async () => {
      await radioPage.selectRadio(label);
      const result = await radioPage.getResult();
      expect(result).toBe(label);
    });
  }
});
