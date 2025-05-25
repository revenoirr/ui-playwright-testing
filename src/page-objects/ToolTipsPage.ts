import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class ToolTipsPage extends BasePage {
  // Selectors
  private hoverButton = '#toolTipButton';
  private hoverInputField = '#toolTipTextField';
  private contraryText = '#texToolTopContainer a:first-child';
  private sectionText = '#texToolTopContainer a:last-child';
  private tooltip = '.tooltip-inner';

  constructor(page: Page) {
    super(page);
  }

 async navigate(): Promise<void> {
  await super.navigate('/tool-tips');
  await this.waitForElement(this.hoverButton); 
}

  /**
   * Hover over the button
   */
  async hoverOverButton(): Promise<void> {
    await this.hover(this.hoverButton);
    // Short delay to ensure tooltip appears
    await this.page.waitForTimeout(500);
  }

  /**
   * Hover over the input field
   */
  async hoverOverInputField(): Promise<void> {
    await this.hover(this.hoverInputField);
    // Short delay to ensure tooltip appears
    await this.page.waitForTimeout(500);
  }

  /**
   * Hover over the contrary text
   */
  async hoverOverContraryText(): Promise<void> {
    await this.hover(this.contraryText);
    // Short delay to ensure tooltip appears
    await this.page.waitForTimeout(500);
  }

  /**
   * Hover over the section text
   */
  async hoverOverSectionText(): Promise<void> {
    await this.hover(this.sectionText);
    // Short delay to ensure tooltip appears
    await this.page.waitForTimeout(500);
  }

  /**
   * Get the tooltip text
   * @returns The text content of the tooltip
   */
  async getTooltipText(): Promise<string> {
    // Wait for the tooltip to be visible
    await this.waitForElement(this.tooltip);
    return await this.getText(this.tooltip);
  }

  /**
   * Check if the tooltip is visible
   * @returns True if the tooltip is visible, false otherwise
   */
  async isTooltipVisible(): Promise<boolean> {
    return await this.isVisible(this.tooltip);
  }
}