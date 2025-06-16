import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SliderPage extends BasePage {
  // FIXED: All locators moved to Page Object as requested
  private readonly slider: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locator
    this.slider = this.page.locator('input[type="range"]');
  }

  /**
   * Navigate to slider page and wait for content to load
   */
  async navigate(): Promise<void> {
    await this.page.goto('/slider');
    
    // FIXED: Use domcontentloaded for immediate testing after DOM loads
    await this.page.waitForLoadState('domcontentloaded');
    
    // FIXED: Use waitFor instead of hardcoded timeout
    await this.slider.waitFor({ state: 'visible' });
  }

  /**
   * Set slider to specific value using fill method
   */
  async setSliderValue(value: number): Promise<void> {
    await this.slider.waitFor({ state: 'visible' });
    await this.slider.scrollIntoViewIfNeeded();
    
    // Fill the slider with the target value
    await this.slider.fill(value.toString());
    
    // FIXED: Wait for the value to be updated using waitForFunction
    await this.page.waitForFunction(
      (targetValue) => {
        const slider = document.querySelector('input[type="range"]') as HTMLInputElement;
        return slider && parseInt(slider.value) === targetValue;
      },
      value,
      { timeout: 5000 }
    );
  }

  /**
   * Get current slider value
   */
  async getSliderValue(): Promise<number> {
    await this.slider.waitFor({ state: 'visible' });
    const value = await this.slider.inputValue();
    return parseInt(value, 10);
  }

  /**
   * Get slider minimum value
   */
  async getSliderMin(): Promise<number> {
    await this.slider.waitFor({ state: 'visible' });
    const min = await this.slider.getAttribute('min');
    return parseInt(min || '0', 10);
  }

  /**
   * Get slider maximum value
   */
  async getSliderMax(): Promise<number> {
    await this.slider.waitFor({ state: 'visible' });
    const max = await this.slider.getAttribute('max');
    return parseInt(max || '100', 10);
  }

  /**
   * Verify slider is interactive
   */
  async isSliderEnabled(): Promise<boolean> {
    try {
      await this.slider.waitFor({ state: 'visible' });
      const isDisabled = await this.slider.isDisabled();
      return !isDisabled;
    } catch {
      return false;
    }
  }

  /**
   * FIXED: Wait for slider value to reach specific target
   */
  async waitForSliderValue(expectedValue: number): Promise<void> {
    await this.page.waitForFunction(
      (target) => {
        const slider = document.querySelector('input[type="range"]') as HTMLInputElement;
        return slider && parseInt(slider.value) === target;
      },
      expectedValue,
      { timeout: 10000 }
    );
  }

  /**
   * Set slider to minimum value
   */
  async setToMinimum(): Promise<void> {
    const minValue = await this.getSliderMin();
    await this.setSliderValue(minValue);
  }

  /**
   * Set slider to maximum value
   */
  async setToMaximum(): Promise<void> {
    const maxValue = await this.getSliderMax();
    await this.setSliderValue(maxValue);
  }

  /**
   * Increment slider value by step
   */
  async incrementSlider(): Promise<void> {
    await this.slider.waitFor({ state: 'visible' });
    await this.slider.press('ArrowRight');
    
    // Wait for value change
    await this.page.waitForTimeout(100); // Small delay for UI update
  }

  /**
   * Set slider value using drag action
   */
  async dragSliderToValue(targetValue: number): Promise<void> {
    await this.slider.waitFor({ state: 'visible' });
    
    // Get slider properties
    const sliderBox = await this.slider.boundingBox();
    if (!sliderBox) throw new Error('Slider not found');
    
    const min = parseInt(await this.slider.getAttribute('min') || '0');
    const max = parseInt(await this.slider.getAttribute('max') || '100');
    
    // Calculate position percentage
    const percentage = (targetValue - min) / (max - min);
    const targetX = sliderBox.x + (sliderBox.width * percentage);
    
    // Drag to target position
    await this.slider.hover();
    await this.page.mouse.down();
    await this.page.mouse.move(targetX, sliderBox.y + sliderBox.height / 2);
    await this.page.mouse.up();
    
    // FIXED: Wait for the drag operation to complete
    await this.page.waitForFunction(
      (target) => {
        const slider = document.querySelector('input[type="range"]') as HTMLInputElement;
        const currentValue = parseInt(slider?.value || '0');
        // Allow small tolerance for drag operations
        return Math.abs(currentValue - target) <= 2;
      },
      targetValue,
      { timeout: 5000 }
    );
  }
}