import { test, expect } from '@playwright/test';
import { FormPage } from '../page-objects/FormPage';

// BDD approach implemented with proper test structure and Page Object pattern
test.describe('Practice Form Page - BDD Implementation', () => {
  let formPage: FormPage;

  test.beforeEach(async ({ page }) => {
    // Reasonable timeout without excessive waits
    test.setTimeout(60000);

    // Set viewport size
    await page.setViewportSize({ width: 1280, height: 720 });

    formPage = new FormPage(page);
    
    // Using domcontentloaded for immediate testing after DOM loads
    await formPage.navigate();
    
    // Using Page Object method instead of hardcoded wait
    await formPage.waitForFormReady();

    // Remove blocking elements using Page Object method
    await formPage.removeBlockingElements();
  });

  // BDD: Given-When-Then structure for main form submission
  const formTestData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    gender: 'Male',
    mobile: '1234567890',
    dateOfBirth: '10 May 1990',
    subject: 'Maths',
    hobby: 'Sports',
    address: '123 Main St',
    state: 'NCR',
    city: 'Delhi'
  };

  test('Given user is on form page, When filling all fields and submitting, Then form should be submitted successfully', async ({ page }) => {
    // Given: User is on the form page (handled in beforeEach)
    
    // When: Filling all form fields
    await test.step('Given user fills basic information', async () => {
      await formPage.enterFirstName(formTestData.firstName);
      await formPage.enterLastName(formTestData.lastName);
      await formPage.enterEmail(formTestData.email);
    });

    await test.step('And user selects gender', async () => {
      await formPage.selectGender(formTestData.gender);
    });

    await test.step('And user enters contact information', async () => {
      await formPage.enterMobileNumber(formTestData.mobile);
    });

    await test.step('And user selects date of birth', async () => {
      await formPage.selectDateOfBirth(formTestData.dateOfBirth);
    });

    await test.step('And user selects subject', async () => {
      await formPage.selectSubject(formTestData.subject);
    });

    await test.step('And user selects hobby', async () => {
      await formPage.selectHobby(formTestData.hobby);
    });

    await test.step('And user uploads picture', async () => {
      await formPage.uploadPicture();
    });

    await test.step('And user enters address', async () => {
      await formPage.enterCurrentAddress(formTestData.address);
    });

    await test.step('And user selects state and city', async () => {
      await formPage.selectState(formTestData.state);
      await formPage.selectCity(formTestData.city);
    });

    await test.step('When user submits the form', async () => {
      await formPage.submitForm();
    });

    // Then: Form should be submitted successfully
    await test.step('Then confirmation modal should appear with correct data', async () => {
      await formPage.waitForConfirmationModal();
      expect(await formPage.isConfirmationDisplayed()).toBeTruthy();

      const submittedData = await formPage.getSubmittedData();
      expect(submittedData['Student Name']).toBe(`${formTestData.firstName} ${formTestData.lastName}`);
      expect(submittedData['Student Email']).toBe(formTestData.email);
      expect(submittedData['Gender']).toBe(formTestData.gender);
      expect(submittedData['Mobile']).toBe(formTestData.mobile);
      expect(submittedData['Subjects']).toBe(formTestData.subject);
      expect(submittedData['Hobbies']).toBe(formTestData.hobby);
      expect(submittedData['Address']).toBe(formTestData.address);
      expect(submittedData['State and City']).toBe(`${formTestData.state} ${formTestData.city}`);
    });
  });

  // BDD: Validation scenarios
  test('Given user is on form page, When submitting without required fields, Then validation errors should appear', async ({ page }) => {
    // Given: User is on the form page (handled in beforeEach)
    
    // When: User submits form without required fields
    await test.step('When user submits form without filling required fields', async () => {
      await formPage.submitForm();
    });

    // Then: Validation errors should appear
    await test.step('Then validation errors should be displayed', async () => {
      const hasValidationErrors = await formPage.waitForValidationErrors();
      expect(hasValidationErrors).toBeTruthy();
    });
  });

  // BDD: Individual field tests with data-driven approach
  const genderTestCases = [
    { gender: 'Male', expected: 'gender-radio-1' },
    { gender: 'Female', expected: 'gender-radio-2' },
    { gender: 'Other', expected: 'gender-radio-3' }
  ];
  
  genderTestCases.forEach(({ gender, expected }) => {
    test(`Given user is on form page, When selecting ${gender} gender, Then ${gender} option should be selected`, async () => {
      // Given: User is on the form page (handled in beforeEach)
      
      // When: User selects gender
      await test.step(`When user selects ${gender} gender option`, async () => {
        await formPage.selectGender(gender);
      });

      // Then: Gender should be selected
      await test.step(`Then ${gender} should be selected`, async () => {
        const isSelected = await formPage.waitForGenderSelection(expected);
        expect(isSelected).toBeTruthy();
      });
    });
  });

  // BDD: Subject selection scenario
  test('Given user is on form page, When selecting a subject, Then subject should be added to selection', async () => {
    const subject = 'Computer Science';
    
    // Given: User is on the form page (handled in beforeEach)
    
    // When: User selects a subject
    await test.step('When user selects a subject from dropdown', async () => {
      await formPage.selectSubject(subject);
    });

    // Then: Subject should be selected
    await test.step('Then subject should appear in selected subjects', async () => {
      const subjectSelected = await formPage.waitForSubjectSelection(subject);
      expect(subjectSelected).toBeTruthy();
    });
  });

  // BDD: Hobby selection scenarios
  const hobbyTestCases = [
    { hobby: 'Sports', expected: 'hobbies-checkbox-1' },
    { hobby: 'Reading', expected: 'hobbies-checkbox-2' },
    { hobby: 'Music', expected: 'hobbies-checkbox-3' }
  ];
  
  hobbyTestCases.forEach(({ hobby, expected }) => {
    test(`Given user is on form page, When selecting ${hobby} hobby, Then ${hobby} checkbox should be checked`, async () => {
      // Given: User is on the form page (handled in beforeEach)
      
      // When: User selects hobby
      await test.step(`When user selects ${hobby} hobby`, async () => {
        await formPage.selectHobby(hobby);
      });

      // Then: Hobby should be selected
      await test.step(`Then ${hobby} checkbox should be checked`, async () => {
        const hobbySelected = await formPage.waitForHobbySelection(expected);
        expect(hobbySelected).toBeTruthy();
      });
    });
  });

  // BDD: State and city selection scenario
  test('Given user is on form page, When selecting state and city, Then both should be selected correctly', async () => {
    const state = 'Uttar Pradesh';
    const city = 'Agra';
    
    // Given: User is on the form page (handled in beforeEach)
    
    // When: User selects state
    await test.step('When user selects a state', async () => {
      await formPage.selectState(state);
    });

    // Then: State should be selected
    await test.step('Then state should be selected', async () => {
      const stateSelected = await formPage.waitForStateSelection(state);
      expect(stateSelected).toBeTruthy();
    });

    // When: User selects city
    await test.step('And when user selects a city', async () => {
      await formPage.selectCity(city);
    });

    // Then: City should be selected
    await test.step('Then city should be selected', async () => {
      const citySelected = await formPage.waitForCitySelection(city);
      expect(citySelected).toBeTruthy();
    });
  });

  // BDD: Date picker scenario
  test('Given user is on form page, When selecting birth date, Then date should be set correctly', async () => {
    const birthDate = '15 Jun 1995';
    
    // Given: User is on the form page (handled in beforeEach)
    
    // When: User selects birth date
    await test.step('When user selects birth date from date picker', async () => {
      await formPage.selectDateOfBirth(birthDate);
    });

    // Then: Date should be selected
    await test.step('Then birth date should be set correctly', async () => {
      const dateSelected = await formPage.waitForDateSelection('Jun', '1995');
      expect(dateSelected).toBeTruthy();
    });
  });

  // BDD: File upload scenario
  test('Given user is on form page, When uploading a file, Then file should be uploaded successfully', async () => {
    // Given: User is on the form page (handled in beforeEach)
    
    // When: User uploads a file
    await test.step('When user uploads a picture file', async () => {
      await formPage.uploadPicture();
    });

    // Then: File should be uploaded
    await test.step('Then file should be uploaded successfully', async () => {
      const fileUploaded = await formPage.waitForFileUpload();
      expect(fileUploaded).toBeTruthy();
    });
  });

  // BDD: Complete form workflow scenario
  test('Given user needs to submit complete form, When filling all fields systematically, Then all data should be preserved and submitted', async () => {
    // Given: User is on the form page (handled in beforeEach)
    
    // When: User fills complete form systematically
    await test.step('When user fills all form fields systematically', async () => {
      await formPage.fillCompleteForm(formTestData);
    });

    await test.step('And user submits the completed form', async () => {
      await formPage.submitForm();
    });

    // Then: All data should be preserved and submitted
    await test.step('Then confirmation modal should display all submitted data correctly', async () => {
      await formPage.waitForConfirmationModal();
      expect(await formPage.isConfirmationDisplayed()).toBeTruthy();
      
      const submittedData = await formPage.getSubmittedData();
      
      // Verify all submitted data matches input
      await formPage.verifyAllSubmittedData(submittedData, formTestData);
    });

    await test.step('And user should be able to close the confirmation modal', async () => {
      await formPage.closeConfirmationModal();
      const modalClosed = await formPage.waitForModalToBeClosed();
      expect(modalClosed).toBeTruthy();
    });
  });

  // BDD: Error handling scenarios
  test('Given user is on form page, When network issues occur during submission, Then appropriate error handling should occur', async ({ page }) => {
    // Given: User is on the form page (handled in beforeEach)
    
    // When: Network issues occur during submission
    await test.step('When user fills form and network issues occur during submission', async () => {
      await formPage.fillCompleteForm(formTestData);
      
      // Simulate network failure
      await page.route('**/*', route => route.abort());
      
      try {
        await formPage.submitForm();
      } catch (error) {
        // Expected to fail due to network abortion
      }
    });

    // Then: Appropriate error handling should occur
    await test.step('Then form should handle network errors gracefully', async () => {
      // Restore network
      await page.unroute('**/*');
      
      // Verify form is still accessible and user can retry
      const formStillAccessible = await formPage.isFormAccessible();
      expect(formStillAccessible).toBeTruthy();
    });
  });

  // Cleanup after each test
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await formPage.takeScreenshotOnFailure(testInfo.title);
    }
  });
});

// Additional Page Object methods that would be needed in FormPage.ts:
/*
Required methods to add to FormPage class:

- waitForFormReady(): Promise<void>
- removeBlockingElements(): Promise<void>
- waitForValidationErrors(): Promise<boolean>
- waitForGenderSelection(radioId: string): Promise<boolean>
- waitForSubjectSelection(subject: string): Promise<boolean>
- waitForHobbySelection(checkboxId: string): Promise<boolean>
- waitForStateSelection(state: string): Promise<boolean>
- waitForCitySelection(city: string): Promise<boolean>
- waitForDateSelection(month: string, year: string): Promise<boolean>
- waitForFileUpload(): Promise<boolean>
- fillCompleteForm(data: FormData): Promise<void>
- verifyAllSubmittedData(submitted: any, expected: FormData): Promise<void>
- closeConfirmationModal(): Promise<void>
- waitForModalToBeClosed(): Promise<boolean>
- isFormAccessible(): Promise<boolean>
- takeScreenshotOnFailure(testTitle: string): Promise<void>
*/