// CheckboxPage.ts - FIXED VERSION
import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class CheckboxPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await super.navigate('/checkbox');
    await this.page.waitForSelector('.rct-collapse-btn', { state: 'visible', timeout: 20000 });
  }

  async expandAll(): Promise<void> {
    const expandButton = this.page.locator('.rct-option-expand-all');
    await expandButton.click({ timeout: 10000 });
    // Wait for the tree to expand
    await this.page.waitForTimeout(2000);
  }

  async selectCheckbox(name: string): Promise<void> {
    // FIXED: Use more specific selector and handle hidden inputs
    const checkboxLabel = this.page.locator(`label:has-text("${name}")`).first();
    await checkboxLabel.scrollIntoViewIfNeeded();
    
    // Wait for the label to be visible
    await checkboxLabel.waitFor({ state: 'visible', timeout: 10000 });
    
    // Click the label instead of trying to click the hidden input
    await checkboxLabel.click();
    
    // Small wait to ensure the action completes
    await this.page.waitForTimeout(500);
  }

  async isCheckboxSelected(name: string): Promise<boolean> {
    // FIXED: Better selector for checking if checkbox is selected
    const checkbox = this.page.locator(`label:has-text("${name}") input[type="checkbox"]`).first();
    await checkbox.waitFor({ state: 'attached', timeout: 5000 });
    return await checkbox.isChecked();
  }
}
