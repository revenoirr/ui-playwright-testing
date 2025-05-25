import { Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { config } from '../config'; // проверь путь, если структура другая

export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to a specific page
   * @param url The URL to navigate to
   */
 async navigate(path: string): Promise<void> {
  await this.page.goto(`https://demoqa.com${path}`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
}


  /**
   * Get the title of the current page
   * @returns The page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for an element to be visible
   * @param selector The selector for the element
   * @param timeout Optional timeout in milliseconds
   */
  async waitForElement(selector: string, timeout = 5000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Click on an element
   * @param selector The selector for the element
   */
  async click(selector: string): Promise<void> {
  await this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
  await this.page.click(selector);
}


  /**
   * Fill a form field
   * @param selector The selector for the form field
   * @param value The value to fill in
   */
  async fill(selector: string, value: string): Promise<void> {
    await this.waitForElement(selector);
    await this.page.fill(selector, value);
  }

  /**
   * Get text from an element
   * @param selector The selector for the element
   * @returns The text content of the element
   */
  async getText(selector: string): Promise<string> {
    await this.waitForElement(selector);
    return await this.page.textContent(selector) || '';
  }

  /**
   * Check if an element is visible
   * @param selector The selector for the element
   * @returns True if the element is visible, false otherwise
   */
  async isVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout: 3000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Take a screenshot and save it to the screenshots directory
   * @param testName The name of the test
   */
  async takeScreenshot(testName: string): Promise<void> {
    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    
    // Create screenshots directory if it doesn't exist
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const screenshotPath = path.join(
      screenshotsDir,
      `${testName}_${timestamp}.png`
    );
    
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved to: ${screenshotPath}`);
  }

  /**
   * Hover over an element
   * @param selector The selector for the element
   */
  async hover(selector: string): Promise<void> {
    await this.waitForElement(selector);
    await this.page.hover(selector);
  }

  /**
   * Select an option from a dropdown
   * @param selector The selector for the dropdown
   * @param option The option to select
   */
  async selectOption(selector: string, option: string): Promise<void> {
    await this.waitForElement(selector);
    await this.page.selectOption(selector, option);
  }

  /**
   * Get the value of an input element
   * @param selector The selector for the input element
   * @returns The value of the input element
   */
  async getValue(selector: string): Promise<string> {
    await this.waitForElement(selector);
    return await this.page.inputValue(selector);
  }

  /**
   * Check if an element is enabled
   * @param selector The selector for the element
   * @returns True if the element is enabled, false otherwise
   */
  async isEnabled(selector: string): Promise<boolean> {
    await this.waitForElement(selector);
    return await this.page.isEnabled(selector);
  }
}