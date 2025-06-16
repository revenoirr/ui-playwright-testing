import { test, expect } from '@playwright/test';
import { ToolTipsPage } from '../page-objects/ToolTipsPage';

// FIXED: All locators moved to Page Object, removed hardcoded waits, implemented proper wait strategies
test.describe('Tooltips tests', () => {
  let toolTipsPage: ToolTipsPage;

  test.beforeEach(async ({ page }) => {
    toolTipsPage = new ToolTipsPage(page);
    
    // FIXED: Using domcontentloaded for immediate testing after DOM loads
    await toolTipsPage.navigate();

    // FIXED: Remove blocking elements using Page Object method
    await toolTipsPage.removeBlockingElements();
  });

  // FIXED: Using data-driven approach with Page Object methods
  const tooltipTestData = [
    {
      name: 'Button',
      action: 'hoverOverButton',
      description: 'Hover over button shows tooltip'
    },
    {
      name: 'Text Field',
      action: 'hoverOverInputField',
      description: 'Hover over text field shows tooltip'
    },
    {
      name: 'Section Text',
      action: 'hoverOverSectionText',
      description: 'Hover over section text shows tooltip'
    }
  ];

  tooltipTestData.forEach(({ name, action, description }) => {
    test(`${description}`, async () => {
      // FIXED: Using Page Object methods with proper waiting
      await (toolTipsPage as any)[action]();
      
      // FIXED: Using waitForFunction through Page Object method
      await toolTipsPage.waitForTooltipVisible();
      
      // Verify tooltip is visible
      const isVisible = await toolTipsPage.isTooltipVisible();
      expect(isVisible).toBe(true);
      
      // Verify tooltip has content
      const tooltipText = await toolTipsPage.getTooltipText();
      expect(tooltipText).toBeTruthy();
      expect(tooltipText.length).toBeGreaterThan(0);
    });
  });

  test('Hover over "Contrary" text shows correct tooltip', async () => {
    // FIXED: Using Page Object method with intelligent waiting
    await toolTipsPage.hoverOverContraryText();
    
    // FIXED: Wait for specific tooltip content using Page Object method
    await toolTipsPage.waitForTooltipContaining('contrary');
    
    // Verify tooltip content
    const tooltipText = await toolTipsPage.getTooltipText();
    expect(tooltipText.toLowerCase()).toContain('contrary');
    
    // FIXED: Using Page Object method for verification
    const containsExpectedText = await toolTipsPage.verifyTooltipContains('You hovered over the Contrary');
    expect(containsExpectedText).toBe(true);
  });

  test('Verify tooltip appears and disappears correctly', async () => {
    // Test tooltip appearance
    await toolTipsPage.hoverOverButton();
    await toolTipsPage.waitForTooltipVisible();
    
    let isVisible = await toolTipsPage.isTooltipVisible();
    expect(isVisible).toBe(true);
    
    // FIXED: Move mouse away using Page Object method
    await toolTipsPage.moveMouse(0, 0);
    
    // FIXED: Wait for tooltip to disappear using Page Object method
    await toolTipsPage.waitForTooltipToDisappear();
    
    isVisible = await toolTipsPage.isTooltipVisible();
    expect(isVisible).toBe(false);
  });

  test('Multiple tooltip interactions work correctly', async () => {
    const interactions = [
      { method: 'hoverOverButton', expectedContent: 'button' },
      { method: 'hoverOverInputField', expectedContent: 'field' },
      { method: 'hoverOverContraryText', expectedContent: 'contrary' }
    ];

    for (const interaction of interactions) {
      // FIXED: Using Page Object methods with proper waiting
      await (toolTipsPage as any)[interaction.method]();
      await toolTipsPage.waitForTooltipVisible();
      
      const tooltipText = await toolTipsPage.getTooltipText();
      expect(tooltipText).toBeTruthy();
      
      // FIXED: Move mouse away using Page Object method
      await toolTipsPage.moveMouse(0, 0);
      
      // FIXED: Wait for tooltip to disappear using Page Object method
      await toolTipsPage.waitForTooltipToDisappear();
    }
  });

  test('Tooltip content validation for all elements', async () => {
    const validationData = [
      {
        action: 'hoverOverButton',
        name: 'Button',
        validation: (text: string) => text.length > 0
      },
      {
        action: 'hoverOverInputField', 
        name: 'Input Field',
        validation: (text: string) => text.length > 0
      },
      {
        action: 'hoverOverContraryText',
        name: 'Contrary Text',
        validation: (text: string) => text.toLowerCase().includes('contrary')
      },
      {
        action: 'hoverOverSectionText',
        name: 'Section Text', 
        validation: (text: string) => text.length > 0
      }
    ];

    for (const { action, name, validation } of validationData) {
      // FIXED: Using Page Object methods with proper waiting
      await (toolTipsPage as any)[action]();
      await toolTipsPage.waitForTooltipVisible();
      
      const tooltipText = await toolTipsPage.getTooltipText();
      const isValid = validation(tooltipText);
      
      expect(isValid).toBe(true);
      expect(tooltipText).toBeTruthy();
      
      // FIXED: Reset for next iteration using Page Object method
      await toolTipsPage.moveMouse(0, 0);
      await toolTipsPage.waitForTooltipToDisappear();
    }
  });
});

// EXAMPLE: How to run tooltip tests with specific keywords
// 
// Run all tooltip tests:
// npx playwright test tooltip.spec.ts --project=chromium --headed
//
// Run tests with specific keywords:
// npx playwright test --grep "Contrary" --project=chromium --headed
// npx playwright test --grep "Button" --project=chromium --headed
// npx playwright test --grep "Multiple tooltip" --project=chromium --headed
//
// Run single test:
// npx playwright test --grep "Hover over button shows tooltip" --project=chromium --headed