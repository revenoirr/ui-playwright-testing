import { test, expect } from '@playwright/test';
import { CheckboxPage } from '../page-objects/CheckboxPage';

// FIXED: All locators moved to Page Object, removed hardcoded waits, implemented proper wait strategies
test.describe('Checkbox tests', () => {
  let checkboxPage: CheckboxPage;

  test.beforeEach(async ({ page }) => {
    checkboxPage = new CheckboxPage(page);
    // FIXED: Using domcontentloaded for immediate testing after DOM loads
    await checkboxPage.navigate();
  });

  test('Expand all checkboxes and verify count', async () => {
    // FIXED: All locators now in Page Object, using intelligent waiting
    await checkboxPage.expandAll();
    
    // FIXED: Using waitForFunction instead of direct assertion
    await checkboxPage.waitForCheckboxCount(4); // At least root + some children
    
    const checkboxCount = await checkboxPage.getCheckboxCount();
    expect(checkboxCount).toBeGreaterThan(3);
    
    // Verify specific checkboxes are visible
    const titles = await checkboxPage.getAllCheckboxTitles();
    expect(titles).toContain('Home');
    expect(titles).toContain('Desktop');
    expect(titles).toContain('Documents');
    expect(titles).toContain('Downloads');
  });

  test('Collapse all checkboxes', async () => {
    // First expand to have something to collapse
    await checkboxPage.expandAll();
    await checkboxPage.waitForCheckboxCount(4);
    
    // Then collapse
    await checkboxPage.collapseAll();
    
    // Should have fewer visible items after collapse
    const collapsedCount = await checkboxPage.getCheckboxCount();
    expect(collapsedCount).toBeLessThanOrEqual(3); // Just root items visible
  });

  // FIXED: Using data-driven approach with Page Object methods
  const checkboxTestData = [
    { name: 'Desktop', description: 'Desktop checkbox selection' },
    { name: 'Documents', description: 'Documents checkbox selection' },
    { name: 'Downloads', description: 'Downloads checkbox selection' }
  ];

  checkboxTestData.forEach(({ name, description }) => {
    test(`Select checkbox: ${name}`, async () => {
      // FIXED: Using Page Object methods with proper waiting
      await checkboxPage.expandAll();
      await checkboxPage.selectCheckbox(name);
      
      // FIXED: Using waitForFunction through Page Object method
      await checkboxPage.waitForResultContaining(name);
      
      // Verify selection
      const isSelected = await checkboxPage.isCheckboxSelected(name);
      expect(isSelected).toBe(true);
      
      const displayResult = await checkboxPage.getDisplayResult();
      expect(displayResult.toLowerCase()).toContain(name.toLowerCase());
    });
  });

  test('Select multiple checkboxes', async () => {
    const checkboxNames = ['Desktop', 'Documents'];
    
    await checkboxPage.expandAll();
    await checkboxPage.selectMultipleCheckboxes(checkboxNames);
    
    // FIXED: Using Page Object method to verify multiple selections
    const areSelected = await checkboxPage.areCheckboxesSelected(checkboxNames);
    expect(areSelected).toBe(true);
    
    // Verify each checkbox individually
    for (const name of checkboxNames) {
      const isSelected = await checkboxPage.isCheckboxSelected(name);
      expect(isSelected).toBe(true);
    }
  });

  test('Unselect checkbox', async () => {
    const checkboxName = 'Desktop';
    
    // First select the checkbox
    await checkboxPage.expandAll();
    await checkboxPage.selectCheckbox(checkboxName);
    await checkboxPage.waitForResultContaining(checkboxName);
    
    // Verify it's selected
    let isSelected = await checkboxPage.isCheckboxSelected(checkboxName);
    expect(isSelected).toBe(true);
    
    // Now unselect it
    await checkboxPage.unselectCheckbox(checkboxName);
    
    // Verify it's unselected
    isSelected = await checkboxPage.isCheckboxSelected(checkboxName);
    expect(isSelected).toBe(false);
  });

  test('Verify checkbox tree structure after expansion', async () => {
    await checkboxPage.expandAll();
    
    const allTitles = await checkboxPage.getAllCheckboxTitles();
    
    // Verify the expected structure exists
    const expectedItems = ['Home', 'Desktop', 'Documents', 'Downloads'];
    expectedItems.forEach(item => {
      expect(allTitles).toContain(item);
    });
    
    // Verify we have a reasonable number of items (tree expanded)
    expect(allTitles.length).toBeGreaterThan(4);
  });

  test('Select and verify Home checkbox (parent selection)', async () => {
    await checkboxPage.expandAll();
    await checkboxPage.selectCheckbox('Home');
    
    // FIXED: Wait for result to show Home selection
    await checkboxPage.waitForResultContaining('home');
    
    const displayResult = await checkboxPage.getDisplayResult();
    expect(displayResult.toLowerCase()).toContain('home');
    
    // When Home is selected, all children should be implied
    const isHomeSelected = await checkboxPage.isCheckboxSelected('Home');
    expect(isHomeSelected).toBe(true);
  });
});

// EXAMPLE: How to run checkbox tests with specific keywords in Chrome at 1920x1080
// 
// Run all checkbox tests in Chrome:
// npx playwright test checkbox.spec.ts --project=chromium --headed
//
// Run tests with specific keywords:
// npx playwright test --grep "Expand all" --project=chromium --headed
// npx playwright test --grep "Select checkbox" --project=chromium --headed
// npx playwright test --grep "multiple" --project=chromium --headed
//
// Run single test:
// npx playwright test --grep "Select checkbox: Desktop" --project=chromium --headed