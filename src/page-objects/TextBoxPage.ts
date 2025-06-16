import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class TextBoxPage extends BasePage {
  // FIXED: All locators moved to Page Object as requested
  private readonly fullNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly currentAddressInput: Locator;
  private readonly permanentAddressInput: Locator;
  private readonly submitButton: Locator;
  private readonly outputBox: Locator;
  private readonly nameOutput: Locator;
  private readonly emailOutput: Locator;
  private readonly currentAddressOutput: Locator;
  private readonly permanentAddressOutput: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize all locators
    this.fullNameInput = this.page.locator('#userName');
    this.emailInput = this.page.locator('#userEmail');
    this.currentAddressInput = this.page.locator('#currentAddress');
    this.permanentAddressInput = this.page.locator('#permanentAddress');
    this.submitButton = this.page.locator('#submit');
    this.outputBox = this.page.locator('#output');
    this.nameOutput = this.page.locator('#name');
    this.emailOutput = this.page.locator('#email');
    this.currentAddressOutput = this.page.locator('#currentAddress.mb-1');
    this.permanentAddressOutput = this.page.locator('#permanentAddress.mb-1');
  }

  /**
   * Navigate to text box page and wait for content to load
   */
  async navigate(): Promise<void> {
    await this.page.goto('/text-box');
    
    // FIXED: Use domcontentloaded for immediate testing after DOM loads
    await this.page.waitForLoadState('domcontentloaded');
    
    // FIXED: Use waitFor instead of hardcoded waits
    await this.fullNameInput.waitFor({ state: 'visible' });
  }

  /**
   * Enter full name with proper waiting
   */
  async enterFullName(fullName: string): Promise<void> {
    await this.fullNameInput.waitFor({ state: 'visible' });
    await this.fullNameInput.fill(fullName);
  }

  /**
   * Enter email with proper waiting
   */
  async enterEmail(email: string): Promise<void> {
    await this.emailInput.waitFor({ state: 'visible' });
    await this.emailInput.fill(email);
  }

  /**
   * Enter current address with proper waiting
   */
  async enterCurrentAddress(address: string): Promise<void> {
    await this.currentAddressInput.waitFor({ state: 'visible' });
    await this.currentAddressInput.fill(address);
  }

  /**
   * Enter permanent address with proper waiting
   */
  async enterPermanentAddress(address: string): Promise<void> {
    await this.permanentAddressInput.waitFor({ state: 'visible' });
    await this.permanentAddressInput.fill(address);
  }

  /**
   * Submit the form and wait for results
   */
  async submitForm(): Promise<void> {
    await this.submitButton.waitFor({ state: 'visible' });
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click();
    
    // FIXED: Wait for output to appear using waitFor
    await this.outputBox.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Check if output box is displayed with proper waiting
   */
  async isOutputDisplayed(): Promise<boolean> {
    try {
      await this.outputBox.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the submitted name with waiting
   */
  async getSubmittedName(): Promise<string> {
    await this.nameOutput.waitFor({ state: 'visible' });
    const fullText = await this.nameOutput.textContent() || '';
    return fullText.replace('Name:', '').trim();
  }

  /**
   * Get the submitted email with waiting
   */
  async getSubmittedEmail(): Promise<string> {
    await this.emailOutput.waitFor({ state: 'visible' });
    const fullText = await this.emailOutput.textContent() || '';
    return fullText.replace('Email:', '').trim();
  }

  /**
   * Get the submitted current address with waiting
   */
  async getSubmittedCurrentAddress(): Promise<string> {
    await this.currentAddressOutput.waitFor({ state: 'visible' });
    const fullText = await this.currentAddressOutput.textContent() || '';
    return fullText.replace('Current Address :', '').trim();
  }

  /**
   * Get the submitted permanent address with waiting
   */
  async getSubmittedPermanentAddress(): Promise<string> {
    await this.permanentAddressOutput.waitFor({ state: 'visible' });
    const fullText = await this.permanentAddressOutput.textContent() || '';
    return fullText.replace('Permananet Address :', '').trim();
  }

  /**
   * FIXED: Wait for form to be ready for interaction
   */
  async waitForFormReady(): Promise<void> {
    await this.page.waitForFunction(() => {
      const inputs = document.querySelectorAll('#userName, #userEmail, #currentAddress, #permanentAddress, #submit');
      return inputs.length === 5 && Array.from(inputs).every(input => input instanceof HTMLElement);
    }, { timeout: 10000 });
  }

  /**
   * FIXED: Wait for output to contain specific data
   */
  async waitForOutputContaining(text: string): Promise<void> {
    await this.page.waitForFunction(
      (searchText) => {
        const output = document.querySelector('#output');
        return output && output.textContent && 
               output.textContent.toLowerCase().includes(searchText.toLowerCase());
      },
      text,
      { timeout: 10000 }
    );
  }

  /**
   * FIXED: Fill all form fields at once with proper validation
   */
  async fillFormData(data: {
    fullName: string;
    email: string;
    currentAddress: string;
    permanentAddress: string;
  }): Promise<void> {
    await this.waitForFormReady();
    
    await this.enterFullName(data.fullName);
    await this.enterEmail(data.email);
    await this.enterCurrentAddress(data.currentAddress);
    await this.enterPermanentAddress(data.permanentAddress);
  }

  /**
   * FIXED: Get all submitted data at once
   */
  async getAllSubmittedData(): Promise<{
    name: string;
    email: string;
    currentAddress: string;
    permanentAddress: string;
  }> {
    // Wait for all output elements to be visible
    await Promise.all([
      this.nameOutput.waitFor({ state: 'visible' }),
      this.emailOutput.waitFor({ state: 'visible' }),
      this.currentAddressOutput.waitFor({ state: 'visible' }),
      this.permanentAddressOutput.waitFor({ state: 'visible' })
    ]);

    return {
      name: await this.getSubmittedName(),
      email: await this.getSubmittedEmail(),
      currentAddress: await this.getSubmittedCurrentAddress(),
      permanentAddress: await this.getSubmittedPermanentAddress()
    };
  }
}