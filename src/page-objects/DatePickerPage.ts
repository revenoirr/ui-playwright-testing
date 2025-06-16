// pages/DatePickerPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DatePickerPage extends BasePage {
  // FIXED: All locators moved to Page Object as requested
  private readonly datePickerInput: Locator;
  private readonly dateTimePickerInput: Locator;
  private readonly calendarDropdown: Locator;
  private readonly monthDropdown: Locator;
  private readonly yearDropdown: Locator;
  private readonly timeInput: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize all locators
    this.datePickerInput = this.page.locator('#datePickerMonthYearInput');
    this.dateTimePickerInput = this.page.locator('#dateAndTimePickerInput');
    this.calendarDropdown = this.page.locator('.react-datepicker');
    this.monthDropdown = this.page.locator('.react-datepicker__month-select');
    this.yearDropdown = this.page.locator('.react-datepicker__year-select');
    this.timeInput = this.page.locator('.react-datepicker__time-input input');
  }

  /**
   * Navigate to date picker page and wait for content to load
   */
  async navigate(): Promise<void> {
    await this.page.goto('/date-picker');
    
    // FIXED: Use domcontentloaded for immediate testing after DOM loads
    await this.page.waitForLoadState('domcontentloaded');
    
    // FIXED: Use waitFor instead of waitForSelector with timeout
    await this.datePickerInput.waitFor({ state: 'visible' });
  }

  /**
   * Select a date using direct input (MM/DD/YYYY format)
   */
  async selectDate(date: string): Promise<void> {
    await this.datePickerInput.waitFor({ state: 'visible' });
    
    // Clear and fill the date
    await this.datePickerInput.clear();
    await this.datePickerInput.fill(date);
    await this.datePickerInput.press('Enter');
    
    // FIXED: Pass parameters as array
    await this.page.waitForFunction(
      ([inputSelector, expectedDate]) => {
        const input = document.querySelector(inputSelector) as HTMLInputElement;
        return input && input.value === expectedDate;
      },
      ['#datePickerMonthYearInput', date],
      { timeout: 5000 }
    );
  }

  /**
   * Get the selected date value
   */
  async getSelectedDate(): Promise<string> {
    await this.datePickerInput.waitFor({ state: 'visible' });
    return await this.datePickerInput.inputValue();
  }

  /**
   * Clear the date input field
   */
  async clearDate(): Promise<void> {
    await this.datePickerInput.waitFor({ state: 'visible' });
    await this.datePickerInput.clear();
    
    // FIXED: Pass parameter as array
    await this.page.waitForFunction(
      ([inputSelector]) => {
        const input = document.querySelector(inputSelector) as HTMLInputElement;
        return input && input.value === '';
      },
      ['#datePickerMonthYearInput'],
      { timeout: 3000 }
    );
  }

  /**
   * Select date and time using the datetime picker
   */
  async selectDateTime(dateTime: string): Promise<void> {
    await this.dateTimePickerInput.waitFor({ state: 'visible' });
    
    await this.dateTimePickerInput.clear();
    await this.dateTimePickerInput.fill(dateTime);
    await this.dateTimePickerInput.press('Enter');
    
    // FIXED: Pass parameters as array
    await this.page.waitForFunction(
      ([inputSelector, expectedDateTime]) => {
        const input = document.querySelector(inputSelector) as HTMLInputElement;
        return input && input.value === expectedDateTime;
      },
      ['#dateAndTimePickerInput', dateTime],
      { timeout: 5000 }
    );
  }

  /**
   * Get the selected date and time value
   */
  async getSelectedDateTime(): Promise<string> {
    await this.dateTimePickerInput.waitFor({ state: 'visible' });
    return await this.dateTimePickerInput.inputValue();
  }

  /**
   * Open calendar dropdown by clicking on date input
   */
  async openCalendar(): Promise<void> {
    await this.datePickerInput.waitFor({ state: 'visible' });
    await this.datePickerInput.click();
    
    // FIXED: Wait for calendar to appear using waitFor
    await this.calendarDropdown.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Close calendar dropdown
   */
  async closeCalendar(): Promise<void> {
    // Click outside to close calendar
    await this.page.keyboard.press('Escape');
    
    // FIXED: Wait for calendar to disappear
    await this.calendarDropdown.waitFor({ state: 'hidden', timeout: 3000 });
  }

  /**
   * Check if calendar dropdown is visible
   */
  async isCalendarOpen(): Promise<boolean> {
    try {
      await this.calendarDropdown.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Select a specific day from the calendar
   */
  async selectDayFromCalendar(day: number): Promise<void> {
    await this.openCalendar();
    
    const dayButton = this.page.locator(`.react-datepicker__day--0${day.toString().padStart(2, '0')}`);
    await dayButton.waitFor({ state: 'visible' });
    await dayButton.click();
    
    // FIXED: Wait for calendar to close after selection
    await this.page.waitForFunction(
      () => {
        const calendar = document.querySelector('.react-datepicker') as HTMLElement;
        return !calendar || calendar.style.display === 'none' || !calendar.offsetParent;
      },
      [],
      { timeout: 5000 }
    );
  }

  /**
   * Verify if a date is valid format (MM/DD/YYYY)
   */
  async isValidDateFormat(date: string): Promise<boolean> {
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    return dateRegex.test(date);
  }

  /**
   * FIXED: Wait for date input to have specific value
   */
  async waitForDateValue(expectedDate: string): Promise<void> {
    await this.page.waitForFunction(
      ([inputSelector, date]) => {
        const input = document.querySelector(inputSelector) as HTMLInputElement;
        return input && input.value === date;
      },
      ['#datePickerMonthYearInput', expectedDate],
      { timeout: 10000 }
    );
  }

  /**
   * FIXED: Wait for datetime input to have specific value
   */
  async waitForDateTimeValue(expectedDateTime: string): Promise<void> {
    await this.page.waitForFunction(
      ([inputSelector, dateTime]) => {
        const input = document.querySelector(inputSelector) as HTMLInputElement;
        return input && input.value === dateTime;
      },
      ['#dateAndTimePickerInput', expectedDateTime],
      { timeout: 10000 }
    );
  }

  /**
   * Get current date in MM/DD/YYYY format for testing
   */
  getCurrentDateString(): string {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();
    return `${month}/${day}/${year}`;
  }

  /**
   * Get future date for testing (days from today)
   */
  getFutureDateString(daysFromToday: number): string {
    const future = new Date();
    future.setDate(future.getDate() + daysFromToday);
    const month = (future.getMonth() + 1).toString().padStart(2, '0');
    const day = future.getDate().toString().padStart(2, '0');
    const year = future.getFullYear();
    return `${month}/${day}/${year}`;
  }
}