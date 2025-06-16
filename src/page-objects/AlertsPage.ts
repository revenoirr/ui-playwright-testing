import { Page, Locator, Dialog } from '@playwright/test';
import { BasePage } from './BasePage';

export class AlertsPage extends BasePage {
  // FIXED: All locators moved to Page Object as requested
  private readonly alertButton: Locator;
  private readonly timerAlertButton: Locator;
  private readonly confirmButton: Locator;
  private readonly promptButton: Locator;
  private readonly confirmResult: Locator;
  private readonly promptResult: Locator;
  private readonly mainHeader: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize all locators
    this.alertButton = this.page.locator('#alertButton');
    this.timerAlertButton = this.page.locator('#timerAlertButton');
    this.confirmButton = this.page.locator('#confirmButton');
    this.promptButton = this.page.locator('#promtButton'); // Note: typo is on the site
    this.confirmResult = this.page.locator('#confirmResult');
    this.promptResult = this.page.locator('#promptResult');
    this.mainHeader = this.page.locator('.main-header');
  }

  /**
   * Navigate to the alerts page and wait for DOM to be ready
   */
  async navigate(): Promise<void> {
    await this.page.goto('/alerts');
    
    // FIXED: Use domcontentloaded for immediate testing after DOM loads
    await this.page.waitForLoadState('domcontentloaded');
    
    // FIXED: Use waitForSelector instead of hardcoded timeout
    await this.mainHeader.waitFor({ state: 'visible', timeout: 15000 })
      .catch(() => console.log('Main header not found, continuing...'));
    
    await this.removeAdsAndOverlays();
  }

  /**
   * Remove ads and overlays that might interfere with tests
   */
  private async removeAdsAndOverlays(): Promise<void> {
    await this.page.evaluate(() => {
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
  }

  /**
   * Click on the simple alert button and handle dialog
   */
  async clickAlertButtonAndVerify(expectedMessage: string): Promise<void> {
    // FIXED: Use waitFor instead of waitForSelector with timeout
    await this.alertButton.waitFor({ state: 'visible' });
    
    let dialogHandled = false;
    const dialogHandler = async (dialog: Dialog) => {
      if (!dialogHandled) {
        dialogHandled = true;
        if (dialog.message() !== expectedMessage) {
          throw new Error(`Expected message: "${expectedMessage}", but got: "${dialog.message()}"`);
        }
        await dialog.accept();
      }
    };

    this.page.on('dialog', dialogHandler);
    
    try {
      await this.alertButton.click({ force: true });
    } finally {
      this.page.off('dialog', dialogHandler);
    }
  }

  /**
   * Click confirm button and handle dialog
   */
  async clickConfirmButtonAndAccept(expectedMessage: string): Promise<void> {
    await this.confirmButton.waitFor({ state: 'visible' });
    
    let dialogHandled = false;
    const dialogHandler = async (dialog: Dialog) => {
      if (!dialogHandled) {
        dialogHandled = true;
        if (dialog.message() !== expectedMessage) {
          throw new Error(`Expected message: "${expectedMessage}", but got: "${dialog.message()}"`);
        }
        await dialog.accept();
      }
    };

    this.page.on('dialog', dialogHandler);
    
    try {
      await this.confirmButton.click({ force: true });
    } finally {
      this.page.off('dialog', dialogHandler);
    }
  }

  /**
   * Click confirm button and dismiss dialog
   */
  async clickConfirmButtonAndDismiss(expectedMessage: string): Promise<void> {
    await this.confirmButton.waitFor({ state: 'visible' });
    
    let dialogHandled = false;
    const dialogHandler = async (dialog: Dialog) => {
      if (!dialogHandled) {
        dialogHandled = true;
        if (dialog.message() !== expectedMessage) {
          throw new Error(`Expected message: "${expectedMessage}", but got: "${dialog.message()}"`);
        }
        await dialog.dismiss();
      }
    };

    this.page.on('dialog', dialogHandler);
    
    try {
      await this.confirmButton.click({ force: true });
    } finally {
      this.page.off('dialog', dialogHandler);
    }
  }

  /**
   * Click prompt button and accept with input
   */
  async clickPromptButtonAndAccept(expectedMessage: string, inputText: string): Promise<void> {
    await this.promptButton.waitFor({ state: 'visible' });
    await this.promptButton.scrollIntoViewIfNeeded();
    
    let dialogHandled = false;
    const dialogHandler = async (dialog: Dialog) => {
      if (!dialogHandled) {
        dialogHandled = true;
        if (dialog.message() !== expectedMessage) {
          throw new Error(`Expected message: "${expectedMessage}", but got: "${dialog.message()}"`);
        }
        await dialog.accept(inputText);
      }
    };

    this.page.on('dialog', dialogHandler);
    
    try {
      await this.promptButton.click({ force: true });
    } finally {
      this.page.off('dialog', dialogHandler);
    }
  }

  /**
   * Click prompt button and dismiss dialog
   */
  async clickPromptButtonAndDismiss(expectedMessage: string): Promise<void> {
    await this.promptButton.waitFor({ state: 'visible' });
    await this.promptButton.scrollIntoViewIfNeeded();
    
    let dialogHandled = false;
    const dialogHandler = async (dialog: Dialog) => {
      if (!dialogHandled) {
        dialogHandled = true;
        if (dialog.message() !== expectedMessage) {
          throw new Error(`Expected message: "${expectedMessage}", but got: "${dialog.message()}"`);
        }
        await dialog.dismiss();
      }
    };

    this.page.on('dialog', dialogHandler);
    
    try {
      await this.promptButton.click({ force: true });
    } finally {
      this.page.off('dialog', dialogHandler);
    }
  }

  /**
   * Get the confirm result text
   * FIXED: Use waitFor instead of hardcoded timeout
   */
  async getConfirmResult(): Promise<string> {
    await this.confirmResult.waitFor({ state: 'visible' });
    return await this.confirmResult.textContent() || '';
  }

  /**
   * Get the prompt result text
   * FIXED: Use waitFor instead of hardcoded timeout
   */
  async getPromptResult(): Promise<string> {
    await this.promptResult.waitFor({ state: 'visible' });
    return await this.promptResult.textContent() || '';
  }

  /**
   * FIXED: Wait for element to have specific text using waitForFunction
   */
  async waitForConfirmResultText(expectedText: string): Promise<void> {
    await this.page.waitForFunction(
      ({ selector, text }) => {
        const element = document.querySelector(selector);
        return element && element.textContent && element.textContent.trim() === text;
      },
      { selector: '#confirmResult', text: expectedText },
      { timeout: 10000 }
    );
  }

  /**
   * FIXED: Wait for element to have specific text using waitForFunction
   */
  async waitForPromptResultText(expectedText: string): Promise<void> {
    await this.page.waitForFunction(
      ({ selector, text }) => {
        const element = document.querySelector(selector);
        return element && element.textContent && element.textContent.trim() === text;
      },
      { selector: '#promptResult', text: expectedText },
      { timeout: 10000 }
    );
  }

  /**
   * Wait for function to check prompt dismissal
   */
  async waitForPromptDismissal(): Promise<void> {
    await this.page.waitForFunction(
      () => {
        const element = document.querySelector('#promptResult');
        // Accept if element doesn't exist, is empty, or contains dismiss-related text
        return !element || 
               element.textContent === '' || 
               element.textContent === null ||
               element.textContent.includes('dismiss') ||
               element.textContent.includes('cancel');
      },
      { timeout: 5000 }
    );
  }

  /**
   * Check if prompt result exists and get its text
   */
  async getPromptResultSafely(): Promise<string | null> {
    try {
      await this.promptResult.waitFor({ state: 'visible', timeout: 2000 });
      return await this.promptResult.textContent();
    } catch {
      return null;
    }
  }
}