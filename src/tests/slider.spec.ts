import { test, expect } from '@playwright/test';
import { SliderPage } from '../page-objects/SliderPage';

test.describe('Slider tests', () => {
  let sliderPage: SliderPage;

  test.beforeEach(async ({ page }) => {
    sliderPage = new SliderPage(page);
    await sliderPage.navigate();
  });

  test('should move slider to specific value', async () => {
    const targetValue = 50;  // пример значения, можно заменить на любое нужное
    await sliderPage.setSliderValue(targetValue);

    const actualValue = await sliderPage.getSliderValue();
    expect(actualValue).toBe(targetValue);
  });
});
