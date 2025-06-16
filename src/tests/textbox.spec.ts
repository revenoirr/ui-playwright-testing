import { test, expect } from '@playwright/test';
import { TextBoxPage } from '../page-objects/TextBoxPage';
import { faker } from '@faker-js/faker';

// FIXED: All locators moved to Page Object, removed hardcoded waits, implemented proper wait strategies
test.describe('Text Box form tests', () => {
  let textBoxPage: TextBoxPage;
  let generatedData: {
    fullName: string;
    email: string;
    currentAddress: string;
    permanentAddress: string;
  };

  test.beforeEach(async ({ page }) => {
    textBoxPage = new TextBoxPage(page);
    // FIXED: Using domcontentloaded for immediate testing after DOM loads
    await textBoxPage.navigate();

    generatedData = {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      currentAddress: faker.location.streetAddress({ useFullAddress: true }),
      permanentAddress: faker.location.streetAddress({ useFullAddress: true }),
    };
  });

  test('Submit form with random generated data and verify output', async () => {
    // FIXED: Using Page Object method for filling all data at once
    await textBoxPage.fillFormData(generatedData);
    await textBoxPage.submitForm();

    // FIXED: Using waitFor instead of direct assertion
    const isDisplayed = await textBoxPage.isOutputDisplayed();
    expect(isDisplayed).toBe(true);

    // FIXED: Using Page Object method to get all data at once with proper waiting
    const submittedData = await textBoxPage.getAllSubmittedData();

    // Verify all submitted data matches input
    expect(submittedData.name).toBe(generatedData.fullName);
    expect(submittedData.email).toBe(generatedData.email);
    expect(submittedData.currentAddress).toBe(generatedData.currentAddress);
    expect(submittedData.permanentAddress).toBe(generatedData.permanentAddress);
  });

  // FIXED: Using data-driven approach with Page Object methods
  const formTestData = [
    {
      scenario: 'specified values',
      data: {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        currentAddress: '123 Main St, City',
        permanentAddress: '456 Elm St, City',
      }
    },
    {
      scenario: 'different user data',
      data: {
        fullName: 'Jane Smith',
        email: 'jane.smith@test.com',
        currentAddress: '789 Oak Ave, Town',
        permanentAddress: '321 Pine St, Village',
      }
    }
  ];

  formTestData.forEach(({ scenario, data }) => {
    test(`Submit form with ${scenario}`, async () => {
      // FIXED: Using Page Object methods with proper waiting
      await textBoxPage.fillFormData(data);
      await textBoxPage.submitForm();

      // FIXED: Using waitForFunction through Page Object method
      await textBoxPage.waitForOutputContaining(data.fullName);

      // Verify output is displayed
      expect(await textBoxPage.isOutputDisplayed()).toBe(true);

      // Get and verify all submitted data
      const submittedData = await textBoxPage.getAllSubmittedData();
      
      expect(submittedData.name).toBe(data.fullName);
      expect(submittedData.email).toBe(data.email);
      expect(submittedData.currentAddress).toBe(data.currentAddress);
      expect(submittedData.permanentAddress).toBe(data.permanentAddress);
    });
  });

  test('Verify form fields are ready for interaction', async () => {
    // FIXED: Using Page Object method to verify form readiness
    await textBoxPage.waitForFormReady();
    
    // Test that all form fields are accessible
    await textBoxPage.enterFullName('Test Name');
    await textBoxPage.enterEmail('test@example.com');
    await textBoxPage.enterCurrentAddress('Test Current Address');
    await textBoxPage.enterPermanentAddress('Test Permanent Address');
    
    // Verify form submission works
    await textBoxPage.submitForm();
    
    const isDisplayed = await textBoxPage.isOutputDisplayed();
    expect(isDisplayed).toBe(true);
  });

  test('Verify individual field submissions', async () => {
    const testCases = [
      { field: 'fullName', value: 'Individual Test Name' },
      { field: 'email', value: 'individual@test.com' },
      { field: 'currentAddress', value: 'Test Current Address Only' },
      { field: 'permanentAddress', value: 'Test Permanent Address Only' }
    ];

    for (const testCase of testCases) {
      // Fill only the current field being tested
      const testData = {
        fullName: testCase.field === 'fullName' ? testCase.value : '',
        email: testCase.field === 'email' ? testCase.value : '',
        currentAddress: testCase.field === 'currentAddress' ? testCase.value : '',
        permanentAddress: testCase.field === 'permanentAddress' ? testCase.value : ''
      };

      await textBoxPage.fillFormData(testData);
      await textBoxPage.submitForm();

      // FIXED: Wait for output to contain the specific field value
      if (testCase.value) {
        await textBoxPage.waitForOutputContaining(testCase.value);
      }

      const isDisplayed = await textBoxPage.isOutputDisplayed();
      expect(isDisplayed).toBe(true);

      // Refresh page for next test
      await textBoxPage.navigate();
    }
  });

  test('Verify output format and content structure', async () => {
    const testData = {
      fullName: 'Format Test User',
      email: 'format@test.com',
      currentAddress: 'Format Test Current Address',
      permanentAddress: 'Format Test Permanent Address'
    };

    await textBoxPage.fillFormData(testData);
    await textBoxPage.submitForm();

    // FIXED: Wait for all output to be ready
    const submittedData = await textBoxPage.getAllSubmittedData();

    // Verify output format and content
    expect(submittedData.name).toBe(testData.fullName);
    expect(submittedData.email).toBe(testData.email);
    expect(submittedData.currentAddress).toBe(testData.currentAddress);
    expect(submittedData.permanentAddress).toBe(testData.permanentAddress);

    // Verify output is not empty
    expect(submittedData.name).not.toBe('');
    expect(submittedData.email).not.toBe('');
    expect(submittedData.currentAddress).not.toBe('');
    expect(submittedData.permanentAddress).not.toBe('');
  });
});

// EXAMPLE: How to run text box tests with specific keywords
// 
// Run all text box tests:
// npx playwright test textbox.spec.ts --project=chromium --headed
//
// Run tests with specific keywords:
// npx playwright test --grep "random generated data" --project=chromium --headed
// npx playwright test --grep "specified values" --project=chromium --headed
// npx playwright test --grep "individual field" --project=chromium --headed
//
// Run single test:
// npx playwright test --grep "Submit form with random generated data" --project=chromium --headed