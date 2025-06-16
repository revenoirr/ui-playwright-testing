import { test, expect } from '@playwright/test';
import { RadioButtonPage } from '../page-objects/RadioButtonPage';

// FIXED: All locators moved to Page Object, removed hardcoded waits, implemented proper wait strategies
test.describe('Radio Button tests', () => {
  let radioPage: RadioButtonPage;

  test.beforeEach(async ({ page }) => {
    radioPage = new RadioButtonPage(page);
    // FIXED: Using domcontentloaded for immediate testing after DOM loads
    await radioPage.navigate();
  });

  // FIXED: Using data-driven approach with Page Object methods
  const radioButtonTestData = [
    { label: 'Yes', description: 'Yes radio button selection' },
    { label: 'Impressive', description: 'Impressive radio button selection' }
  ];

  radioButtonTestData.forEach(({ label, description }) => {
    test(`Select "${label}" radio button`, async () => {
      // FIXED: Using Page Object methods with proper waiting
      await radioPage.selectRadio(label);
      
      // FIXED: Using waitForFunction through Page Object method
      await radioPage.waitForResultContaining(label);
      
      // Verify selection
      const result = await radioPage.getResult();
      expect(result).toBe(label);
      
      // Additional verification using Page Object method
      const isSelected = await radioPage.isRadioSelected(label);
      expect(isSelected).toBe(true);
    });
  });

  test('Verify available radio button options', async () => {
    // FIXED: Using Page Object method to get available options
    const availableOptions = await radioPage.getAvailableOptions();
    
    // Should have at least Yes and Impressive (No is typically disabled)
    expect(availableOptions).toContain('Yes');
    expect(availableOptions).toContain('Impressive');
    expect(availableOptions.length).toBeGreaterThanOrEqual(2);
  });

  test('Verify radio button clickability', async () => {
    // Test that Yes and Impressive are clickable
    const yesClickable = await radioPage.isRadioClickable('Yes');
    const impressiveClickable = await radioPage.isRadioClickable('Impressive');
    
    expect(yesClickable).toBe(true);
    expect(impressiveClickable).toBe(true);
    
    // No radio button is typically disabled
    const noClickable = await radioPage.isRadioClickable('No');
    expect(noClickable).toBe(false);
  });

  test('Select Yes radio button and verify result', async () => {
    await radioPage.selectRadio('Yes');
    
    // FIXED: Wait for result using Page Object method
    await radioPage.waitForResultContaining('Yes');
    
    const result = await radioPage.getResult();
    expect(result).toBe('Yes');
    
    // Verify the selection persists
    const isSelected = await radioPage.isRadioSelected('Yes');
    expect(isSelected).toBe(true);
  });

  test('Select Impressive radio button and verify result', async () => {
    await radioPage.selectRadio('Impressive');
    
    // FIXED: Wait for result using Page Object method
    await radioPage.waitForResultContaining('Impressive');
    
    const result = await radioPage.getResult();
    expect(result).toBe('Impressive');
    
    // Verify the selection persists
    const isSelected = await radioPage.isRadioSelected('Impressive');
    expect(isSelected).toBe(true);
  });

  test('Switch between radio button selections', async () => {
    // First select Yes
    await radioPage.selectRadio('Yes');
    await radioPage.waitForResultContaining('Yes');
    
    let result = await radioPage.getResult();
    expect(result).toBe('Yes');
    
    // Then select Impressive (should deselect Yes)
    await radioPage.selectRadio('Impressive');
    await radioPage.waitForResultContaining('Impressive');
    
    result = await radioPage.getResult();
    expect(result).toBe('Impressive');
    
    // Verify Yes is no longer selected
    const yesSelected = await radioPage.isRadioSelected('Yes');
    expect(yesSelected).toBe(false);
    
    // Verify Impressive is selected
    const impressiveSelected = await radioPage.isRadioSelected('Impressive');
    expect(impressiveSelected).toBe(true);
  });

  test('Verify radio button behavior with disabled option', async () => {
    // Try to interact with No radio button (typically disabled)
    const noClickable = await radioPage.isRadioClickable('No');
    expect(noClickable).toBe(false);
    
    // FIXED: Verify that attempting to select No throws an error due to disabled state
    await expect(async () => {
      await radioPage.selectRadio('No');
    }).rejects.toThrow('Radio button "No" is not clickable (likely disabled)');
    
    // Verify that no result is shown when trying to select disabled button
    const result = await radioPage.getResult();
    expect(result).not.toBe('No');
  });
});

// EXAMPLE: How to run radio button tests with specific keywords in Chrome
// 
// Run all radio button tests in Chrome:
// npx playwright test radiobutton.spec.ts --project=chromium --headed
//
// Run tests with specific keywords:
// npx playwright test --grep "Select.*radio button" --project=chromium --headed
// npx playwright test --grep "Yes" --project=chromium --headed
// npx playwright test --grep "Impressive" --project=chromium --headed
// npx playwright test --grep "Switch between" --project=chromium --headed
//
// Run single test:
// npx playwright test --grep "Select \"Yes\" radio button" --project=chromium --headed