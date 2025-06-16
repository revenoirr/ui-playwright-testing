import { test, expect } from '@playwright/test';
import { AlertsPage } from '../page-objects/AlertsPage';

// FIXED: All locators moved to Page Object, removed hardcoded waits, implemented proper wait strategies
test.describe('Alerts page', () => {
  let alertsPage: AlertsPage;

  test.beforeEach(async ({ page }) => {
    alertsPage = new AlertsPage(page);
    // FIXED: Using domcontentloaded as requested - for immediate testing after DOM loads
    await alertsPage.navigate();
  });

  test('Simple alert - verify message and accept', async () => {
    // FIXED: All locators now in Page Object, no hardcoded timeouts
    await alertsPage.clickAlertButtonAndVerify('You clicked a button');
  });

  test('Confirmation alert - accept', async () => {
    // FIXED: Using Page Object methods, intelligent waiting
    await alertsPage.clickConfirmButtonAndAccept('Do you confirm action?');
    
    // FIXED: Using waitForFunction instead of hardcoded timeout
    await alertsPage.waitForConfirmResultText('You selected Ok');
    
    const result = await alertsPage.getConfirmResult();
    expect(result).toBe('You selected Ok');
  });

  test('Confirmation alert - dismiss', async () => {
    // FIXED: Using Page Object methods with proper wait strategies
    await alertsPage.clickConfirmButtonAndDismiss('Do you confirm action?');
    
    // FIXED: Using waitForFunction for dynamic content
    await alertsPage.waitForConfirmResultText('You selected Cancel');
    
    const result = await alertsPage.getConfirmResult();
    expect(result).toBe('You selected Cancel');
  });

  test('Prompt alert - input and accept', async () => {
    // FIXED: All logic moved to Page Object, no hardcoded waits
    await alertsPage.clickPromptButtonAndAccept('Please enter your name', 'Playwright');
    
    // FIXED: Using waitForFunction to wait for specific text content
    await alertsPage.waitForPromptResultText('You entered Playwright');
    
    const result = await alertsPage.getPromptResult();
    expect(result).toBe('You entered Playwright');
  });

  test('Prompt alert - dismiss', async () => {
    // FIXED: Using Page Object approach with proper error handling
    await alertsPage.clickPromptButtonAndDismiss('Please enter your name');
    
    // For dismissed prompts, the result element might not appear or be empty
    // FIXED: Using Page Object method to check dismissal
    await test.step('Verify prompt was dismissed', async () => {
      try {
        // Wait for dismissal condition using Page Object method
        await alertsPage.waitForPromptDismissal();
        console.log('Prompt was dismissed as expected');
      } catch (error) {
        // If the wait fails, check if there's any result text
        const result = await alertsPage.getPromptResultSafely();
        if (result && result.trim() !== '') {
          throw new Error(`Expected empty result after dismiss, but got: "${result}"`);
        }
        // If no result or empty result, dismissal was successful
        console.log('No prompt result found - dismiss successful');
      }
    });
  });
});

// EXAMPLE: How to run specific tests with keywords in Chrome at 1920x1080
// Command line examples:
// 
// Run all alert tests in Chrome:
// npx playwright test alerts.spec.ts --project=chromium
//
// Run tests with specific keyword:
// npx playwright test --grep "Simple alert" --project=chromium
// npx playwright test --grep "Confirmation" --project=chromium  
// npx playwright test --grep "Prompt" --project=chromium
//
// Run with headed mode to see the 1920x1080 resolution:
// npx playwright test alerts.spec.ts --project=chromium --headed
//
// The resolution is configured in playwright.config.ts viewport settings