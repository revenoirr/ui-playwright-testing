import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class TextBoxPage extends BasePage {
  private fullNameInput = '#userName';
  private emailInput = '#userEmail';
  private currentAddressInput = '#currentAddress';
  private permanentAddressInput = '#permanentAddress';
  private submitButton = '#submit';
  private outputBox = '#output';
  private nameOutput = '#name';
  private emailOutput = '#email';
  private currentAddressOutput = '#currentAddress.mb-1';
  private permanentAddressOutput = '#permanentAddress.mb-1';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the text box page
   */
  async navigate(): Promise<void> {
    await super.navigate('/text-box');
  }

  /**
   * Enter full name
   * @param fullName The full name to enter
   */
  async enterFullName(fullName: string): Promise<void> {
    await this.fill(this.fullNameInput, fullName);
  }

  /**
   * Enter email
   * @param email The email to enter
   */
  async enterEmail(email: string): Promise<void> {
    await this.fill(this.emailInput, email);
  }

  /**
   * Enter current address
   * @param address The current address to enter
   */
  async enterCurrentAddress(address: string): Promise<void> {
    await this.fill(this.currentAddressInput, address);
  }

  /**
   * Enter permanent address
   * @param address The permanent address to enter
   */
  async enterPermanentAddress(address: string): Promise<void> {
    await this.fill(this.permanentAddressInput, address);
  }

  /**
   * Submit the form
   */
  async submitForm(): Promise<void> {
    await this.click(this.submitButton);
  }

  /**
   * Check if output box is displayed
   * @returns True if the output box is displayed, false otherwise
   */
  async isOutputDisplayed(): Promise<boolean> {
    return await this.isVisible(this.outputBox);
  }

  /**
   * Get the submitted name
   * @returns The submitted name
   */
  async getSubmittedName(): Promise<string> {
    const fullText = await this.getText(this.nameOutput);
    // Extract name from "Name:John Doe"
    return fullText.replace('Name:', '').trim();
  }

  /**
   * Get the submitted email
   * @returns The submitted email
   */
  async getSubmittedEmail(): Promise<string> {
    const fullText = await this.getText(this.emailOutput);
    // Extract email from "Email:john.doe@example.com"
    return fullText.replace('Email:', '').trim();
  }

  /**
   * Get the submitted current address
   * @returns The submitted current address
   */
  async getSubmittedCurrentAddress(): Promise<string> {
    const fullText = await this.getText(this.currentAddressOutput);
    // Extract address from "Current Address :123 Main St"
    return fullText.replace('Current Address :', '').trim();
  }

  /**
   * Get the submitted permanent address
   * @returns The submitted permanent address
   */
  async getSubmittedPermanentAddress(): Promise<string> {
    const fullText = await this.getText(this.permanentAddressOutput);
    // Extract address from "Permananet Address :456 Second St"
    return fullText.replace('Permananet Address :', '').trim();
  }
}