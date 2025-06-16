import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ToolTipsPage extends BasePage {
  // FIXED: All locators moved to Page Object as requested
  private readonly hoverButton: Locator;
  private readonly hoverInputField: Locator;
  private readonly contraryText: Locator;
  private readonly sectionText: Locator;
  private readonly tooltip: Locator;
  private readonly tooltipRole: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize all locators
    this.hoverButton = this.page.locator('#toolTipButton');
    this.hoverInputField = this.page.locator('#toolTipTextField');
    this.contraryText = this.page.locator('#texToolTopContainer a:first-child');
    this.sectionText = this.page.locator('#texToolTopContainer a:last-child');
    this.tooltip = this.page.locator('.tooltip-inner, .tooltip');
    this.tooltipRole = this.page.locator('[role="tooltip"]');
  }

  /**
   * Navigate to tooltips page and wait for content to load
   */
  async navigate(): Promise<void> {
    await this.page.goto('/tool-tips');
    
    // FIXED: Use domcontentloaded for immediate testing after DOM loads
    await this.page.waitForLoadState('domcontentloaded');
    
    // FIXED: Use waitFor instead of waitForSelector with timeout
    await this.hoverButton.waitFor({ state: 'visible' });
  }

  /**
   * Hover over the button and wait for tooltip
   */
  async hoverOverButton(): Promise<void> {
    await this.hoverButton.waitFor({ state: 'visible' });
    await this.hoverButton.scrollIntoViewIfNeeded();
    await this.hoverButton.hover();
    
    // FIXED: Use waitForFunction instead of hardcoded timeout
    await this.page.waitForFunction(
      () => {
        const tooltip = document.querySelector('[role="tooltip"], .tooltip, .tooltip-inner');
        return tooltip && tooltip.textContent && tooltip.textContent.trim().length > 0;
      },
      { timeout: 5000 }
    );
  }

  /**
   * Hover over the input field and wait for tooltip
   */
  async hoverOverInputField(): Promise<void> {
    await this.hoverInputField.waitFor({ state: 'visible' });
    await this.hoverInputField.scrollIntoViewIfNeeded();
    await this.hoverInputField.hover();
    
    // FIXED: Use waitForFunction instead of hardcoded timeout
    await this.page.waitForFunction(
      () => {
        const tooltip = document.querySelector('[role="tooltip"], .tooltip, .tooltip-inner');
        return tooltip && tooltip.textContent && tooltip.textContent.trim().length > 0;
      },
      { timeout: 5000 }
    );
  }

  /**
   * Hover over the contrary text and wait for tooltip
   */
  async hoverOverContraryText(): Promise<void> {
    // FIXED: More robust selector for finding contrary text
    const contraryElement = await this.findContraryElement();
    
    await contraryElement.scrollIntoViewIfNeeded();
    await contraryElement.hover();
    
    // FIXED: Use waitForFunction to wait for specific tooltip content
    await this.page.waitForFunction(
      () => {
        const tooltip = document.querySelector('.tooltip, .tooltip-inner');
        return tooltip && tooltip.textContent && 
               tooltip.textContent.toLowerCase().includes('contrary');
      },
      { timeout: 5000 }
    );
  }

  /**
   * Hover over the section text and wait for tooltip
   */
  async hoverOverSectionText(): Promise<void> {
    await this.sectionText.waitFor({ state: 'visible' });
    await this.sectionText.scrollIntoViewIfNeeded();
    await this.sectionText.hover();
    
    // FIXED: Use waitForFunction instead of hardcoded timeout
    await this.page.waitForFunction(
      () => {
        const tooltip = document.querySelector('[role="tooltip"], .tooltip, .tooltip-inner');
        return tooltip && tooltip.textContent && tooltip.textContent.trim().length > 0;
      },
      { timeout: 5000 }
    );
  }

  /**
   * Get the tooltip text with proper waiting
   */
  async getTooltipText(): Promise<string> {
    // FIXED: Wait for tooltip to be visible before getting text
    await this.waitForTooltipVisible();
    
    // Try multiple selectors for tooltip
    const tooltipSelectors = ['.tooltip-inner', '.tooltip', '[role="tooltip"]'];
    
    for (const selector of tooltipSelectors) {
      try {
        const element = this.page.locator(selector);
        await element.waitFor({ state: 'visible', timeout: 2000 });
        const text = await element.textContent();
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      } catch {
        // Continue to next selector
      }
    }
    
    return '';
  }

  /**
   * Check if the tooltip is visible
   */
  async isTooltipVisible(): Promise<boolean> {
    try {
      // Check multiple possible tooltip selectors
      const tooltipSelectors = ['.tooltip-inner', '.tooltip', '[role="tooltip"]'];
      
      for (const selector of tooltipSelectors) {
        const element = this.page.locator(selector);
        const isVisible = await element.isVisible();
        if (isVisible) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * FIXED: Wait for tooltip to be visible using waitForFunction
   */
  async waitForTooltipVisible(): Promise<void> {
    await this.page.waitForFunction(
      () => {
        const tooltips = document.querySelectorAll('.tooltip, .tooltip-inner, [role="tooltip"]');
        return Array.from(tooltips).some(tooltip => {
          // FIXED: Cast to HTMLElement to access offsetParent
          const htmlElement = tooltip as HTMLElement;
          return htmlElement.offsetParent !== null && // Element is visible
            tooltip.textContent && 
            tooltip.textContent.trim().length > 0;
        });
      },
      { timeout: 10000 }
    );
  }

  /**
   * FIXED: Find contrary element with robust logic
   */
  private async findContraryElement(): Promise<Locator> {
    const contrarySelector = 'a[href="javascript:void(0)"]';
    await this.page.waitForSelector(contrarySelector, { timeout: 10000 });

    const contraryElements = await this.page.locator(contrarySelector).all();

    // Find the element that contains "Contrary" text
    for (const element of contraryElements) {
      const text = await element.textContent();
      if (text && text.includes('Contrary')) {
        return element;
      }
    }

    // Fallback to text selector
    const textElement = this.page.locator('text=Contrary').first();
    await textElement.waitFor({ timeout: 5000 });
    return textElement;
  }

  /**
   * FIXED: Wait for specific tooltip content
   */
  async waitForTooltipContaining(expectedText: string): Promise<void> {
    await this.page.waitForFunction(
      (text) => {
        const tooltips = document.querySelectorAll('.tooltip, .tooltip-inner, [role="tooltip"]');
        return Array.from(tooltips).some(tooltip => 
          tooltip.textContent && 
          tooltip.textContent.toLowerCase().includes(text.toLowerCase())
        );
      },
      expectedText,
      { timeout: 10000 }
    );
  }

  /**
   * FIXED: Verify tooltip contains expected text
   */
  async verifyTooltipContains(expectedText: string): Promise<boolean> {
    try {
      await this.waitForTooltipContaining(expectedText);
      const tooltipText = await this.getTooltipText();
      return tooltipText.toLowerCase().includes(expectedText.toLowerCase());
    } catch {
      return false;
    }
  }

  /**
   * FIXED: Add public method to move mouse (for test file access)
   */
  async moveMouse(x: number, y: number): Promise<void> {
    await this.page.mouse.move(x, y);
  }

  /**
   * FIXED: Add public method to wait for tooltip to disappear
   */
  async waitForTooltipToDisappear(): Promise<void> {
    await this.page.waitForFunction(
      () => {
        const tooltips = document.querySelectorAll('.tooltip, .tooltip-inner, [role="tooltip"]');
        return Array.from(tooltips).every(tooltip => {
          // FIXED: Cast to HTMLElement to access offsetParent
          const htmlElement = tooltip as HTMLElement;
          return htmlElement.offsetParent === null || // Element is hidden
            !tooltip.textContent ||
            tooltip.textContent.trim().length === 0;
        });
      },
      { timeout: 5000 }
    );
  }

  /**
   * FIXED: Add public method to remove blocking elements
   */
  async removeBlockingElements(): Promise<void> {
    await this.page.evaluate(() => {
      const banner = document.querySelector('#fixedban');
      if (banner) banner.remove();

      const ads = document.querySelectorAll('[id*="google_ads"], [class*="ad"]');
      ads.forEach(ad => ad.remove());
    });
  }
}