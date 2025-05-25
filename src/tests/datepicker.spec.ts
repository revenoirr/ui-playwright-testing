// tests/date-picker.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Date Picker Page', () => {
  test('should allow selecting a date and display it correctly', async ({ page }) => {
    await page.goto('https://demoqa.com/date-picker');

    const dateInput = page.locator('#datePickerMonthYearInput');
    const testDate = '08/12/2025'; // формат MM/DD/YYYY

    // Очистим поле и введем дату
    await dateInput.fill('');
    await dateInput.type(testDate);
    await dateInput.press('Enter');

    // Проверим, что поле содержит нужную дату
    await expect(dateInput).toHaveValue(testDate);
  });
});
