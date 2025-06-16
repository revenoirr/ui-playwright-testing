import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RadioButtonPage extends BasePage {
  // FIXED: All locators moved to Page Object as requested
  private readonly yesRadioLabel: Locator;
  private readonly impressiveRadioLabel: Locator;
  private readonly noRadioLabel: Locator;
  private readonly radioButtons: Locator;
  private readonly resultText: Locator;
  private readonly mainHeader: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize all locators
    this.yesRadioLabel = this.page.locator('label[for="yesRadio"]');
    this.impressiveRadioLabel = this.page.locator('label[for="impressiveRadio"]');
    this.noRadioLabel = this.page.locator('label[for="noRadio"]');
    this.radioButtons = this.page.locator('input[type="radio"]');
    this.resultText = this.page.locator('.text-success');
    this.mainHeader = this.page.locator('.main-header');
  }

  /**
   * Navigate to radio button page and wait for content to load
   */
  async navigate(): Promise<void> {
    console.log('Attempting to navigate to radio button page...');
    
    try {
      // FIXED: Use domcontentloaded for immediate testing after DOM loads
      await this.page.goto('https://demoqa.com/radio-button', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      // FIXED: Use waitFor instead of waitForSelector with timeout
      await this.radioButtons.first().waitFor({ state: 'visible' });
      
      console.log('Direct navigation succeeded');
      return;
      
    } catch (error) {
      console.log('Direct navigation failed, trying alternative approach...');
      
      // Strategy 2: Manual navigation through menu
      try {
        await this.page.goto('https://demoqa.com/', { 
          waitUntil: 'domcontentloaded',
          timeout: 30000 
        });
        
        // Wait for and click Elements
        const elementsLink = this.page.locator('text=Elements');
        await elementsLink.waitFor({ state: 'visible' });
        await elementsLink.click();
        
        // FIXED: Use waitForFunction instead of hardcoded timeout
        await this.page.waitForFunction(
          () => document.querySelector('text=Radio Button') !== null,
          { timeout: 10000 }
        );
        
        // Wait for and click Radio Button
        const radioButtonLink = this.page.locator('text=Radio Button');
        await radioButtonLink.waitFor({ state: 'visible' });
        await radioButtonLink.click();
        
        // Wait for radio button elements to appear
        await this.radioButtons.first().waitFor({ state: 'visible' });
        
        console.log('Manual navigation succeeded');
        return;
        
      } catch (manualError) {
        console.log('Manual navigation also failed');
        throw new Error(`Could not navigate to radio button page. Original error: ${error}`);
      }
    }
  }

  /**
   * Select a radio button by label
   */
  async selectRadio(buttonLabel: string): Promise<void> {
    console.log(`Selecting radio button: ${buttonLabel}`);
    
    let targetLocator: Locator;
    
    // FIXED: Use specific locators instead of multiple selector attempts
    switch (buttonLabel.toLowerCase()) {
      case 'yes':
        targetLocator = this.yesRadioLabel;
        break;
      case 'impressive':
        targetLocator = this.impressiveRadioLabel;
        break;
      case 'no':
        targetLocator = this.noRadioLabel;
        break;
      default:
        throw new Error(`Unknown radio button label: ${buttonLabel}`);
    }
    
    // FIXED: Check if radio button is clickable before attempting to select
    const isClickable = await this.isRadioClickable(buttonLabel);
    if (!isClickable) {
      throw new Error(`Radio button "${buttonLabel}" is not clickable (likely disabled)`);
    }
    
    // Wait for element to be visible and clickable
    await targetLocator.waitFor({ state: 'visible' });
    await targetLocator.scrollIntoViewIfNeeded();
    await targetLocator.click();
    
    // FIXED: Use waitForFunction to wait for selection to register
    await this.page.waitForFunction(
      (label) => {
        const result = document.querySelector('.text-success');
        return result && result.textContent && 
               result.textContent.trim() === label;
      },
      buttonLabel,
      { timeout: 5000 }
    );
    
    console.log(`Successfully selected radio button: ${buttonLabel}`);
  }

  /**
   * Get the result text after radio button selection
   */
  async getResult(): Promise<string> {
    try {
      // FIXED: Use waitFor instead of waitForSelector
      await this.resultText.waitFor({ state: 'visible', timeout: 5000 });
      const result = await this.resultText.textContent();
      return result?.trim() || '';
    } catch (error) {
      console.log('No result found');
      return '';
    }
  }

  /**
   * Check if a specific radio button is selected
   */
  async isRadioSelected(buttonLabel: string): Promise<boolean> {
    const result = await this.getResult();
    return result === buttonLabel;
  }

  /**
   * Get all available radio button options
   */
  async getAvailableOptions(): Promise<string[]> {
    const options: string[] = [];
    
    // Check which radio buttons are enabled
    const yesEnabled = await this.yesRadioLabel.isEnabled();
    const impressiveEnabled = await this.impressiveRadioLabel.isEnabled();
    const noEnabled = await this.noRadioLabel.isEnabled();
    
    if (yesEnabled) options.push('Yes');
    if (impressiveEnabled) options.push('Impressive');
    if (noEnabled) options.push('No');
    
    return options;
  }

  /**
   * FIXED: Wait for result to contain specific text
   */
  async waitForResultContaining(text: string): Promise<void> {
    await this.page.waitForFunction(
      (searchText) => {
        const result = document.querySelector('.text-success');
        return result && result.textContent && 
               result.textContent.trim() === searchText;
      },
      text,
      { timeout: 10000 }
    );
  }

  /**
   * Verify radio button is clickable
   */
  async isRadioClickable(buttonLabel: string): Promise<boolean> {
    let targetLocator: Locator;
    
    switch (buttonLabel.toLowerCase()) {
      case 'yes':
        targetLocator = this.yesRadioLabel;
        break;
      case 'impressive':
        targetLocator = this.impressiveRadioLabel;
        break;
      case 'no':
        targetLocator = this.noRadioLabel;
        break;
      default:
        return false;
    }
    
    try {
      await targetLocator.waitFor({ state: 'visible', timeout: 3000 });
      return await targetLocator.isEnabled();
    } catch {
      return false;
    }
  }
}