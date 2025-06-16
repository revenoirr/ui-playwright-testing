import { test, expect } from '@playwright/test';
import { SliderPage } from '../page-objects/SliderPage';

// FIXED: All locators moved to Page Object, removed hardcoded waits, implemented proper wait strategies
test.describe('Slider tests', () => {
  let sliderPage: SliderPage;

  test.beforeEach(async ({ page }) => {
    sliderPage = new SliderPage(page);
    // FIXED: Using domcontentloaded for immediate testing after DOM loads
    await sliderPage.navigate();
  });

  test('should move slider to specific value', async () => {
    const targetValue = 50;
    
    // FIXED: Using Page Object method with proper waiting
    await sliderPage.setSliderValue(targetValue);
    
    // FIXED: Using waitForFunction through Page Object method
    await sliderPage.waitForSliderValue(targetValue);
    
    const actualValue = await sliderPage.getSliderValue();
    expect(actualValue).toBe(targetValue);
  });

  test('should set slider to minimum value', async () => {
    await sliderPage.setToMinimum();
    
    const minValue = await sliderPage.getSliderMin();
    const actualValue = await sliderPage.getSliderValue();
    
    expect(actualValue).toBe(minValue);
  });

  test('should set slider to maximum value', async () => {
    await sliderPage.setToMaximum();
    
    const maxValue = await sliderPage.getSliderMax();
    const actualValue = await sliderPage.getSliderValue();
    
    expect(actualValue).toBe(maxValue);
  });

  test('should increment slider value using keyboard', async () => {
    // Start with a known value
    await sliderPage.setSliderValue(50);
    await sliderPage.waitForSliderValue(50);
    
    // Increment using keyboard
    await sliderPage.incrementSlider();
    
    const newValue = await sliderPage.getSliderValue();
    expect(newValue).toBeGreaterThan(50);
  });

  test('should move slider using drag action', async () => {
    const targetValue = 75;
    
    // FIXED: Using alternative drag method with proper waiting
    await sliderPage.dragSliderToValue(targetValue);
    
    const actualValue = await sliderPage.getSliderValue();
    // Allow small tolerance for drag operations
    expect(actualValue).toBeGreaterThanOrEqual(targetValue - 2);
    expect(actualValue).toBeLessThanOrEqual(targetValue + 2);
  });

  test('should verify slider is enabled and interactive', async () => {
    // Verify slider is enabled
    const isEnabled = await sliderPage.isSliderEnabled();
    expect(isEnabled).toBe(true);
    
    // Test that it responds to value changes
    await sliderPage.setSliderValue(30);
    const actualValue = await sliderPage.getSliderValue();
    expect(actualValue).toBe(30);
  });
});

// EXAMPLE: How to run slider tests with specific keywords
// 
// Run all slider tests:
// npx playwright test slider.spec.ts --project=chromium --headed
//
// Run tests with specific keywords:
// npx playwright test --grep "specific value" --project=chromium --headed
// npx playwright test --grep "minimum value" --project=chromium --headed
// npx playwright test --grep "keyboard" --project=chromium --headed
// npx playwright test --grep "drag action" --project=chromium --headed
//
// Run single test:
// npx playwright test --grep "should move slider to specific value" --project=chromium --headed
//
// Run tests in different browsers:
// npx playwright test slider.spec.ts --project=webkit --headed
// npx playwright test slider.spec.ts --project=firefox --headed