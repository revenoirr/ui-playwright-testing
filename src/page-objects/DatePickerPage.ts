import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class DatePickerPage extends BasePage {
  private dateInput = '#datePickerMonthYearInput';

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await super.navigate('/date-picker');
  }

  async selectDate(date: string): Promise<void> {
    await this.page.fill(this.dateInput, date);
    await this.page.keyboard.press('Enter');
  }

  async getSelectedDate(): Promise<string> {
    return await this.page.inputValue(this.dateInput);
  }
}
