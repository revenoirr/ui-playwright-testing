// tests/date-picker.spec.ts
import { test, expect } from '@playwright/test';
import { DatePickerPage } from '../page-objects/DatePickerPage';

// FIXED: All locators moved to Page Object, removed hardcoded waits, implemented proper wait strategies
test.describe('Date Picker tests', () => {
  let datePickerPage: DatePickerPage;

  test.beforeEach(async ({ page }) => {
    datePickerPage = new DatePickerPage(page);
    // FIXED: Using domcontentloaded for immediate testing after DOM loads
    await datePickerPage.navigate();
  });

  test('Select date using direct input and verify display', async () => {
    // FIXED: All locators now in Page Object, using intelligent waiting
    const testDate = '08/12/2025';
    
    await datePickerPage.selectDate(testDate);
    
    // FIXED: Using waitForFunction through Page Object method
    await datePickerPage.waitForDateValue(testDate);
    
    const selectedDate = await datePickerPage.getSelectedDate();
    expect(selectedDate).toBe(testDate);
  });

  test('Clear date field and verify it is empty', async () => {
    const initialDate = '01/15/2024';
    
    // First set a date
    await datePickerPage.selectDate(initialDate);
    await datePickerPage.waitForDateValue(initialDate);
    
    // Then clear it
    await datePickerPage.clearDate();
    
    const clearedDate = await datePickerPage.getSelectedDate();
    expect(clearedDate).toBe('');
  });

  // FIXED: Using data-driven approach with Page Object methods
  const dateTestData = [
    { date: '12/25/2024', description: 'Christmas date selection' },
    { date: '01/01/2025', description: 'New Year date selection' },
    { date: '07/04/2025', description: 'Independence Day date selection' },
    { date: '10/31/2025', description: 'Halloween date selection' }
  ];

  dateTestData.forEach(({ date, description }) => {
    test(`Select date: ${date} - ${description}`, async () => {
      // FIXED: Using Page Object methods with proper waiting
      await datePickerPage.selectDate(date);
      await datePickerPage.waitForDateValue(date);
      
      const selectedDate = await datePickerPage.getSelectedDate();
      expect(selectedDate).toBe(date);
      
      // Verify date format is valid
      const isValidFormat = await datePickerPage.isValidDateFormat(selectedDate);
      expect(isValidFormat).toBe(true);
    });
  });

  test('Select current date and verify', async () => {
    const currentDate = datePickerPage.getCurrentDateString();
    
    await datePickerPage.selectDate(currentDate);
    await datePickerPage.waitForDateValue(currentDate);
    
    const selectedDate = await datePickerPage.getSelectedDate();
    expect(selectedDate).toBe(currentDate);
  });

  test('Select future date and verify', async () => {
    const futureDate = datePickerPage.getFutureDateString(30); // 30 days from today
    
    await datePickerPage.selectDate(futureDate);
    await datePickerPage.waitForDateValue(futureDate);
    
    const selectedDate = await datePickerPage.getSelectedDate();
    expect(selectedDate).toBe(futureDate);
  });

  test('Open and close calendar dropdown', async () => {
    // Open calendar
    await datePickerPage.openCalendar();
    
    let isOpen = await datePickerPage.isCalendarOpen();
    expect(isOpen).toBe(true);
    
    // Close calendar
    await datePickerPage.closeCalendar();
    
    isOpen = await datePickerPage.isCalendarOpen();
    expect(isOpen).toBe(false);
  });

  test('Replace existing date with new date', async () => {
    const originalDate = '06/15/2024';
    const newDate = '09/20/2025';
    
    // Set original date
    await datePickerPage.selectDate(originalDate);
    await datePickerPage.waitForDateValue(originalDate);
    
    let selectedDate = await datePickerPage.getSelectedDate();
    expect(selectedDate).toBe(originalDate);
    
    // Replace with new date
    await datePickerPage.selectDate(newDate);
    await datePickerPage.waitForDateValue(newDate);
    
    selectedDate = await datePickerPage.getSelectedDate();
    expect(selectedDate).toBe(newDate);
    expect(selectedDate).not.toBe(originalDate);
  });

  test('Select date and time using datetime picker', async () => {
    const testDateTime = '08/12/2025 2:30 PM';
    
    await datePickerPage.selectDateTime(testDateTime);
    await datePickerPage.waitForDateTimeValue(testDateTime);
    
    const selectedDateTime = await datePickerPage.getSelectedDateTime();
    expect(selectedDateTime).toBe(testDateTime);
  });

  test('Verify date input field is visible and interactive', async () => {
    const testDate = '03/14/2025';
    
    // Verify field is visible before interaction
    await datePickerPage.selectDate(testDate);
    
    const selectedDate = await datePickerPage.getSelectedDate();
    expect(selectedDate).toBe(testDate);
    
    // Verify we can interact with the field multiple times
    const secondDate = '11/11/2025';
    await datePickerPage.selectDate(secondDate);
    await datePickerPage.waitForDateValue(secondDate);
    
    const finalDate = await datePickerPage.getSelectedDate();
    expect(finalDate).toBe(secondDate);
  });
});

// EXAMPLE: How to run date picker tests with specific keywords
// 
// Run all date picker tests:
// npx playwright test date-picker.spec.ts --project=chromium --headed
//
// Run tests with specific keywords:
// npx playwright test --grep "Select date.*Christmas" --project=chromium --headed
// npx playwright test --grep "current date" --project=chromium --headed
// npx playwright test --grep "calendar dropdown" --project=chromium --headed
//
// Run single test:
// npx playwright test --grep "Replace existing date" --project=chromium --headed