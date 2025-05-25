import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class AlertsPage extends BasePage {
  // Selectors
  private alertButton = '#alertButton';
  private timerAlertButton = '#timerAlertButton';
  private confirmButton = '#confirmButton';
  private promptButton = '#promtButton'; // Note: typo is on the site itself
  private confirmResult = '#confirmResult';
  private promptResult = '#promptResult';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the alerts page
   */
  async navigate(): Promise<void> {
    await super.navigate('/alerts');
  }

  /**
   * Click on the simple alert button
   */
  async clickAlertButton(): Promise<void> {
    await this.click(this.alertButton);
  }

  /**
   * Click on the timed alert button
   */
  async clickTimerAlertButton(): Promise<void> {
    await this.click(this.timerAlertButton);
  }

  /**
   * Click on the confirm box button
   */
  async clickConfirmButton(): Promise<void> {
    await this.click(this.confirmButton);
  }

  /**
   * Click on the prompt box button
   */
  async clickPromptButton(): Promise<void> {
    await this.click(this.promptButton);
  }

  /**
   * Get the confirm result text
   * @returns The confirm result text
   */
  async getConfirmResult(): Promise<string> {
    return await this.getText(this.confirmResult);
  }

  /**
   * Get the prompt result text
   * @returns The prompt result text
   */
  async getPromptResult(): Promise<string> {
    return await this.getText(this.promptResult);
  }
}
