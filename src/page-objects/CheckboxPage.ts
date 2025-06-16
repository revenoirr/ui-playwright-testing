import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckboxPage extends BasePage {
  // FIXED: All locators moved to Page Object as requested
  private readonly expandAllButton: Locator;
  private readonly collapseAllButton: Locator;
  private readonly checkboxTree: Locator;
  private readonly displayResult: Locator;
  private readonly checkboxTitles: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize all locators
    this.expandAllButton = this.page.locator('button[title="Expand all"]');
    this.collapseAllButton = this.page.locator('button[title="Collapse all"]');
    this.checkboxTree = this.page.locator('.rct-node');
    this.displayResult = this.page.locator('.display-result');
    this.checkboxTitles = this.page.locator('span.rct-title');
  }

  /**
   * Navigate to checkbox page and wait for content to load
   */
  async navigate(): Promise<void> {
    await this.page.goto('/checkbox');
    
    // FIXED: Use domcontentloaded for immediate testing after DOM loads
    await this.page.waitForLoadState('domcontentloaded');
    
    // FIXED: Use waitFor instead of waitForSelector with timeout
    await this.expandAllButton.waitFor({ state: 'visible' });
  }

  /**
   * Click expand all button and wait for tree to expand
   */
  async expandAll(): Promise<void> {
    await this.expandAllButton.waitFor({ state: 'visible' });
    await this.expandAllButton.click();
    
    // FIXED: Use waitForFunction instead of hardcoded timeout
    await this.page.waitForFunction(
      () => {
        const titles = document.querySelectorAll('span.rct-title');
        return titles.length > 3; // More than just the root nodes
      },
      { timeout: 10000 }
    );
  }

  /**
   * Click collapse all button
   */
  async collapseAll(): Promise<void> {
    await this.collapseAllButton.waitFor({ state: 'visible' });
    await this.collapseAllButton.click();
    
    // FIXED: Use waitForFunction to ensure collapse completed
    await this.page.waitForFunction(
      () => {
        const expandedNodes = document.querySelectorAll('.rct-node-expanded');
        return expandedNodes.length === 0;
      },
      { timeout: 5000 }
    );
  }

  /**
   * Get all visible checkbox titles
   */
  async getAllCheckboxTitles(): Promise<string[]> {
    await this.checkboxTitles.first().waitFor({ state: 'visible' });
    return await this.checkboxTitles.allTextContents();
  }

  /**
   * Get count of visible checkboxes
   */
  async getCheckboxCount(): Promise<number> {
    return await this.checkboxTitles.count();
  }

  /**
   * Select a checkbox by name
   */
  async selectCheckbox(name: string): Promise<void> {
    // FIXED: More robust selector for checkbox selection
    const checkboxLabel = this.page.locator(`.rct-node span.rct-title:text-is("${name}")`);
    
    await checkboxLabel.waitFor({ state: 'visible' });
    await checkboxLabel.scrollIntoViewIfNeeded();
    await checkboxLabel.click();
    
    // FIXED: Wait for the selection to be processed using waitForFunction
    await this.page.waitForFunction(
      (checkboxName) => {
        const result = document.querySelector('.display-result');
        return result && result.textContent && 
               result.textContent.toLowerCase().includes(checkboxName.toLowerCase());
      },
      name,
      { timeout: 5000 }
    );
  }

  /**
   * Check if a checkbox is selected by checking the display result
   */
  async isCheckboxSelected(name: string): Promise<boolean> {
    try {
      await this.displayResult.waitFor({ state: 'visible', timeout: 2000 });
      const resultText = await this.displayResult.textContent();
      return resultText?.toLowerCase().includes(name.toLowerCase()) || false;
    } catch {
      return false;
    }
  }

  /**
   * Get the display result text
   */
  async getDisplayResult(): Promise<string> {
    try {
      await this.displayResult.waitFor({ state: 'visible', timeout: 5000 });
      return await this.displayResult.textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Unselect a checkbox by name (click again to uncheck)
   */
  async unselectCheckbox(name: string): Promise<void> {
    const checkboxLabel = this.page.locator(`.rct-node span.rct-title:text-is("${name}")`);
    
    await checkboxLabel.waitFor({ state: 'visible' });
    await checkboxLabel.scrollIntoViewIfNeeded();
    await checkboxLabel.click();
    
    // FIXED: Wait for the unselection to be processed
    await this.page.waitForFunction(
      (checkboxName) => {
        const result = document.querySelector('.display-result');
        return !result || !result.textContent || 
               !result.textContent.toLowerCase().includes(checkboxName.toLowerCase());
      },
      name,
      { timeout: 5000 }
    );
  }

  /**
   * Select multiple checkboxes
   */
  async selectMultipleCheckboxes(names: string[]): Promise<void> {
    for (const name of names) {
      await this.selectCheckbox(name);
    }
  }

  /**
   * Verify if multiple checkboxes are selected
   */
  async areCheckboxesSelected(names: string[]): Promise<boolean> {
    const displayResult = await this.getDisplayResult();
    const lowerResult = displayResult.toLowerCase();
    
    return names.every(name => lowerResult.includes(name.toLowerCase()));
  }

  /**
   * FIXED: Wait for specific number of checkboxes to be visible
   */
  async waitForCheckboxCount(expectedCount: number): Promise<void> {
    await this.page.waitForFunction(
      (count) => {
        const titles = document.querySelectorAll('span.rct-title');
        return titles.length >= count;
      },
      expectedCount,
      { timeout: 10000 }
    );
  }

  /**
   * FIXED: Wait for display result to contain specific text
   */
  async waitForResultContaining(text: string): Promise<void> {
    await this.page.waitForFunction(
      (searchText) => {
        const result = document.querySelector('.display-result');
        return result && result.textContent && 
               result.textContent.toLowerCase().includes(searchText.toLowerCase());
      },
      text,
      { timeout: 10000 }
    );
  }
}