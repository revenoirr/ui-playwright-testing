import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import * as path from 'path';
import * as fs from 'fs';

// Define the FormData interface
export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  mobile: string;
  dateOfBirth: string;
  subject: string;
  hobby: string;
  address: string;
  state: string;
  city: string;
}

export class FormPage extends BasePage {
  // FIXED: All locators moved to Page Object using Locator type
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly genderRadioMale: Locator;
  private readonly genderRadioFemale: Locator;
  private readonly genderRadioOther: Locator;
  private readonly mobileInput: Locator;
  private readonly dateOfBirthInput: Locator;
  private readonly subjectsInput: Locator;
  private readonly hobbySportsCheckbox: Locator;
  private readonly hobbyReadingCheckbox: Locator;
  private readonly hobbyMusicCheckbox: Locator;
  private readonly uploadPictureInput: Locator;
  private readonly addressInput: Locator;
  private readonly stateDropdown: Locator;
  private readonly stateInput: Locator;
  private readonly cityDropdown: Locator;
  private readonly cityInput: Locator;
  private readonly submitButton: Locator;
  private readonly modalTitle: Locator;
  private readonly modalTableRows: Locator;
  private readonly closeModalButton: Locator;
  private readonly practiceFormWrapper: Locator;
  private readonly hobbiesWrapper: Locator;

  constructor(page: Page) {
    super(page);
    
    // FIXED: Initialize all locators using page.locator()
    this.firstNameInput = this.page.locator('#firstName');
    this.lastNameInput = this.page.locator('#lastName');
    this.emailInput = this.page.locator('#userEmail');
    this.genderRadioMale = this.page.locator('label[for="gender-radio-1"]');
    this.genderRadioFemale = this.page.locator('label[for="gender-radio-2"]');
    this.genderRadioOther = this.page.locator('label[for="gender-radio-3"]');
    this.mobileInput = this.page.locator('#userNumber');
    this.dateOfBirthInput = this.page.locator('#dateOfBirthInput');
    this.subjectsInput = this.page.locator('#subjectsInput');
    this.hobbySportsCheckbox = this.page.locator('label[for="hobbies-checkbox-1"]');
    this.hobbyReadingCheckbox = this.page.locator('label[for="hobbies-checkbox-2"]');
    this.hobbyMusicCheckbox = this.page.locator('label[for="hobbies-checkbox-3"]');
    this.uploadPictureInput = this.page.locator('#uploadPicture');
    this.addressInput = this.page.locator('#currentAddress');
    this.stateDropdown = this.page.locator('#state');
    this.stateInput = this.page.locator('#react-select-3-input');
    this.cityDropdown = this.page.locator('#city');
    this.cityInput = this.page.locator('#react-select-4-input');
    this.submitButton = this.page.locator('#submit');
    this.modalTitle = this.page.locator('#example-modal-sizes-title-lg');
    this.modalTableRows = this.page.locator('.table-responsive tbody tr');
    this.closeModalButton = this.page.locator('#closeLargeModal');
    this.practiceFormWrapper = this.page.locator('.practice-form-wrapper');
    this.hobbiesWrapper = this.page.locator('#hobbiesWrapper');
  }

  /**
   * Navigate to the practice form page
   * FIXED: Using domcontentloaded for immediate testing after DOM loads
   */
  async navigate(): Promise<void> {
    await this.page.goto('/automation-practice-form');
    await this.page.waitForLoadState('domcontentloaded');
    
    // FIXED: Using waitFor instead of waitForSelector
    await this.firstNameInput.waitFor({ state: 'visible' });
  }

  /**
   * Enter first name
   */
  async enterFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.waitFor({ state: 'visible' });
    await this.firstNameInput.fill(firstName);
  }

  /**
   * Enter last name
   */
  async enterLastName(lastName: string): Promise<void> {
    await this.lastNameInput.waitFor({ state: 'visible' });
    await this.lastNameInput.fill(lastName);
  }

  /**
   * Enter email
   */
  async enterEmail(email: string): Promise<void> {
    await this.emailInput.waitFor({ state: 'visible' });
    await this.emailInput.fill(email);
  }

  /**
   * Select gender - IMPROVED VERSION with proper waiting
   * FIXED: Removed hardcoded waits, using waitForFunction
   */
  async selectGender(gender: string): Promise<void> {
    await this.practiceFormWrapper.waitFor({ state: 'visible' });
    
    let genderLocator: Locator;
    let radioId: string;
    
    switch (gender.toLowerCase()) {
      case 'male':
        genderLocator = this.genderRadioMale;
        radioId = '#gender-radio-1';
        break;
      case 'female':
        genderLocator = this.genderRadioFemale;
        radioId = '#gender-radio-2';
        break;
      case 'other':
        genderLocator = this.genderRadioOther;
        radioId = '#gender-radio-3';
        break;
      default:
        throw new Error(`Gender "${gender}" not recognized`);
    }
    
    // Remove any overlays or blockers
    await this.page.evaluate(() => {
      const overlays = document.querySelectorAll('.modal, .popup, [id*="google_ads"], [class*="ad"]');
      overlays.forEach(el => el.remove());
    });
    
    // FIXED: Using proper waiting instead of multiple strategies
    await genderLocator.waitFor({ state: 'visible' });
    await genderLocator.scrollIntoViewIfNeeded();
    await genderLocator.click({ force: true });
    
    // FIXED: Using waitForFunction to verify selection
    await this.page.waitForFunction(
      (radioSelector) => {
        const radio = document.querySelector(radioSelector) as HTMLInputElement;
        return radio && radio.checked;
      },
      radioId,
      { timeout: 5000 }
    );
  }

  /**
   * Enter mobile number
   */
  async enterMobileNumber(mobile: string): Promise<void> {
    await this.mobileInput.waitFor({ state: 'visible' });
    await this.mobileInput.fill(mobile);
  }

  /**
   * Select subject
   * FIXED: Removed hardcoded waits
   */
  async selectSubject(subject: string): Promise<void> {
    await this.subjectsInput.waitFor({ state: 'visible' });
    await this.subjectsInput.click();
    await this.subjectsInput.fill(subject);
    
    // FIXED: Using waitForFunction instead of hardcoded timeout
    await this.page.waitForFunction(
      (subjectText) => {
        const dropdown = document.querySelector('#subjectsContainer .subjects-auto-complete__menu');
        return dropdown && dropdown.textContent?.includes(subjectText);
      },
      subject,
      { timeout: 5000 }
    );
    
    await this.page.keyboard.press('Enter');
  }

  /**
   * Select hobby - IMPROVED VERSION
   * FIXED: Removed hardcoded waits, using proper locator waiting
   */
  async selectHobby(hobby: string): Promise<void> {
    const hobbyMap = {
      'sports': { locator: this.hobbySportsCheckbox, input: '#hobbies-checkbox-1' },
      'reading': { locator: this.hobbyReadingCheckbox, input: '#hobbies-checkbox-2' }, 
      'music': { locator: this.hobbyMusicCheckbox, input: '#hobbies-checkbox-3' }
    };
    
    const hobbyInfo = hobbyMap[hobby.toLowerCase() as keyof typeof hobbyMap];
    if (!hobbyInfo) {
      throw new Error(`Hobby "${hobby}" not recognized`);
    }
    
    await this.hobbiesWrapper.waitFor({ state: 'visible' });
    await hobbyInfo.locator.waitFor({ state: 'visible' });
    await hobbyInfo.locator.scrollIntoViewIfNeeded();
    await hobbyInfo.locator.click({ force: true });
    
    // FIXED: Using waitForFunction to verify selection
    await this.page.waitForFunction(
      (inputSelector) => {
        const checkbox = document.querySelector(inputSelector) as HTMLInputElement;
        return checkbox && checkbox.checked;
      },
      hobbyInfo.input,
      { timeout: 5000 }
    );
  }

  /**
   * Upload a picture
   */
  async uploadPicture(filePath?: string): Promise<void> {
    const tempPath = path.join(process.cwd(), 'temp_upload.txt');
    
    if (!filePath) {
      fs.writeFileSync(tempPath, 'Test file for upload');
      filePath = tempPath;
    }
    
    await this.uploadPictureInput.setInputFiles(filePath);
    
    // Clean up temp file
    if (filePath === tempPath && fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }

  /**
   * Enter current address
   */
  async enterCurrentAddress(address: string): Promise<void> {
    await this.addressInput.waitFor({ state: 'visible' });
    await this.addressInput.fill(address);
  }

  /**
   * Select state - ROBUST VERSION
   * FIXED: Removed hardcoded waits, using waitForFunction
   */
  async selectState(state: string): Promise<void> {
    // Remove possible blockers
    await this.page.evaluate(() => {
      const selectorsToRemove = ['#fixedban', 'div[role="dialog"]', 'footer', '.modal', '.popup'];
      selectorsToRemove.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });
    });

    await this.stateDropdown.waitFor({ state: 'visible' });
    await this.stateDropdown.scrollIntoViewIfNeeded();
    await this.stateDropdown.click();
    
    // FIXED: Wait for dropdown to open using waitForFunction
    await this.page.waitForFunction(
      () => {
        const input = document.querySelector('#react-select-3-input');
        return input && input.isConnected;
      },
      { timeout: 5000 }
    );
    
    await this.stateInput.fill(state);
    
    // FIXED: Wait for options to appear
    await this.page.waitForFunction(
      (stateName) => {
        const options = document.querySelectorAll('[id*="react-select-3-option"]');
        return Array.from(options).some(option => 
          option.textContent?.includes(stateName)
        );
      },
      state,
      { timeout: 5000 }
    );
    
    await this.page.keyboard.press('Enter');
    
    // FIXED: Verify selection using waitForFunction
    await this.page.waitForFunction(
      (stateName) => {
        const selectedValue = document.querySelector('#state .css-1uccc91-singleValue');
        return selectedValue && selectedValue.textContent?.includes(stateName);
      },
      state,
      { timeout: 5000 }
    );
  }

  /**
   * Select city - ROBUST VERSION
   * FIXED: Removed hardcoded waits, using waitForFunction
   */
  async selectCity(city: string): Promise<void> {
    // FIXED: Wait for city dropdown to be enabled using waitForFunction
    await this.page.waitForFunction(
      () => {
        const cityDropdown = document.querySelector('#city');
        return cityDropdown && !cityDropdown.classList.contains('css-1s2u09g-control');
      },
      { timeout: 10000 }
    );
    
    await this.cityDropdown.scrollIntoViewIfNeeded();
    await this.cityDropdown.click();
    
    // FIXED: Wait for city input to be available
    await this.page.waitForFunction(
      () => {
        const input = document.querySelector('#react-select-4-input');
        return input && input.isConnected;
      },
      { timeout: 5000 }
    );
    
    await this.cityInput.fill(city);
    
    // FIXED: Wait for city options to appear
    await this.page.waitForFunction(
      (cityName) => {
        const options = document.querySelectorAll('[id*="react-select-4-option"]');
        return Array.from(options).some(option => 
          option.textContent?.includes(cityName)
        );
      },
      city,
      { timeout: 5000 }
    );
    
    await this.page.keyboard.press('Enter');
    
    // FIXED: Verify city selection
    await this.page.waitForFunction(
      (cityName) => {
        const selectedValue = document.querySelector('#city .css-1uccc91-singleValue');
        return selectedValue && selectedValue.textContent?.includes(cityName);
      },
      city,
      { timeout: 5000 }
    );
  }

  /**
   * Submit the form
   * FIXED: Using proper waiting instead of manual scroll
   */
  async submitForm(): Promise<void> {
    await this.submitButton.waitFor({ state: 'visible' });
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click();
  }

  /**
   * Check if form submission confirmation is displayed
   */
  async isConfirmationDisplayed(): Promise<boolean> {
    try {
      await this.modalTitle.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get form submission data
   * FIXED: Using waitFor instead of waitForElement
   */
  async getSubmittedData(): Promise<Record<string, string>> {
    const data: Record<string, string> = {};
    
    await this.modalTableRows.first().waitFor({ state: 'visible' });
    
    const rows = await this.modalTableRows.all();
    
    for (const row of rows) {
      const cells = await row.locator('td').all();
      if (cells && cells.length >= 2) {
        const label = await cells[0].textContent();
        const value = await cells[1].textContent();
        
        if (label && value) {
          data[label.trim()] = value.trim();
        }
      }
    }
    
    return data;
  }

  /**
   * Close the confirmation modal
   */
  async closeConfirmationModal(): Promise<void> {
    await this.closeModalButton.waitFor({ state: 'visible' });
    await this.closeModalButton.click();
  }

  /**
   * Select date of birth
   * FIXED: Removed hardcoded waits, using proper element waiting
   */
  async selectDateOfBirth(dateStr: string): Promise<void> {
    const dateParts = dateStr.split(' ');
    if (dateParts.length !== 3) {
      throw new Error('Date format should be "DD MMM YYYY"');
    }
    
    const day = dateParts[0];
    const month = dateParts[1];
    const year = dateParts[2];
    
    await this.dateOfBirthInput.click();
    
    // FIXED: Wait for date picker to open using waitForFunction
    await this.page.waitForFunction(
      () => {
        return document.querySelector('.react-datepicker') !== null;
      },
      { timeout: 5000 }
    );
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = months.findIndex(m => m.toLowerCase().startsWith(month.toLowerCase()));
    
    if (monthIndex === -1) {
      throw new Error(`Month "${month}" not recognized`);
    }
    
    // Select month and year
    await this.page.selectOption('.react-datepicker__month-select', String(monthIndex));
    await this.page.selectOption('.react-datepicker__year-select', year);
    
    // Select the day
    const formattedDay = day.padStart(2, '0');
    const daySelector = `.react-datepicker__day--0${formattedDay}:not(.react-datepicker__day--outside-month)`;
    await this.page.locator(daySelector).click();
    
    // FIXED: Wait for date picker to close
    await this.page.waitForFunction(
      () => {
        return document.querySelector('.react-datepicker') === null;
      },
      { timeout: 5000 }
    );
  }

  /**
   * FIXED: Wait for form to be ready for interaction
   */
  async waitForFormReady(): Promise<void> {
    await this.page.waitForFunction(
      () => {
        const form = document.querySelector('.practice-form-wrapper');
        const firstName = document.querySelector('#firstName');
        return form && firstName && !firstName.hasAttribute('disabled');
      },
      { timeout: 15000 }
    );
  }

  /**
   * FIXED: Wait for modal to appear with specific timeout
   */
  async waitForConfirmationModal(): Promise<void> {
    await this.modalTitle.waitFor({ state: 'visible', timeout: 15000 });
  }

  // ========== MISSING METHODS - ADDED TO FIX TYPESCRIPT ERRORS ==========

  /**
   * Remove blocking elements that might interfere with form interactions
   */
  async removeBlockingElements(): Promise<void> {
    await this.page.evaluate(() => {
      const selectorsToRemove = [
        '#fixedban', 
        'div[role="dialog"]', 
        'footer', 
        '.modal', 
        '.popup',
        '[id*="google_ads"]',
        '[class*="ad"]',
        '.adsbygoogle'
      ];
      
      selectorsToRemove.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });
    });
  }

  /**
   * Wait for validation errors to appear
   */
  async waitForValidationErrors(): Promise<boolean> {
    try {
      await this.page.waitForFunction(
        () => {
          const inputs = document.querySelectorAll('input:required');
          return Array.from(inputs).some(input => {
            const element = input as HTMLInputElement;
            return !element.checkValidity() || element.classList.contains('error') || 
                   element.style.borderColor === 'red' || element.style.border.includes('red');
          });
        },
        { timeout: 5000 }
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for gender selection to be completed
   */
  async waitForGenderSelection(radioId: string): Promise<boolean> {
    try {
      await this.page.waitForFunction(
        (selector) => {
          const radio = document.querySelector(selector) as HTMLInputElement;
          return radio && radio.checked;
        },
        `#${radioId}`,
        { timeout: 5000 }
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for subject selection to be completed
   */
  async waitForSubjectSelection(subject: string): Promise<boolean> {
    try {
      await this.page.waitForFunction(
        (subjectText) => {
          const selectedSubjects = document.querySelectorAll('#subjectsContainer .subjects-auto-complete__multi-value__label');
          return Array.from(selectedSubjects).some(element => 
            element.textContent?.includes(subjectText)
          );
        },
        subject,
        { timeout: 5000 }
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for hobby selection to be completed
   */
  async waitForHobbySelection(checkboxId: string): Promise<boolean> {
    try {
      await this.page.waitForFunction(
        (selector) => {
          const checkbox = document.querySelector(selector) as HTMLInputElement;
          return checkbox && checkbox.checked;
        },
        `#${checkboxId}`,
        { timeout: 5000 }
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for state selection to be completed
   */
  async waitForStateSelection(state: string): Promise<boolean> {
    try {
      await this.page.waitForFunction(
        (stateName) => {
          const selectedValue = document.querySelector('#state .css-1uccc91-singleValue');
          return selectedValue && selectedValue.textContent?.includes(stateName);
        },
        state,
        { timeout: 5000 }
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for city selection to be completed
   */
  async waitForCitySelection(city: string): Promise<boolean> {
    try {
      await this.page.waitForFunction(
        (cityName) => {
          const selectedValue = document.querySelector('#city .css-1uccc91-singleValue');
          return selectedValue && selectedValue.textContent?.includes(cityName);
        },
        city,
        { timeout: 5000 }
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for date selection to be completed
   */
 async waitForDateSelection(month: string, year: string): Promise<boolean> {
  try {
    await this.page.waitForFunction(
      ({ monthStr, yearStr }: { monthStr: string; yearStr: string }) => {
        const dateInput = document.querySelector('#dateOfBirthInput') as HTMLInputElement;
        return (
          dateInput &&
          dateInput.value.includes(monthStr) &&
          dateInput.value.includes(yearStr)
        );
      },
      { monthStr: month, yearStr: year }, // передаём как объект
      { timeout: 5000 }
    );
    return true;
  } catch {
    return false;
  }
}


  /**
   * Wait for file upload to be completed
   */
  async waitForFileUpload(): Promise<boolean> {
    try {
      await this.page.waitForFunction(
        () => {
          const fileInput = document.querySelector('#uploadPicture') as HTMLInputElement;
          return fileInput && fileInput.files && fileInput.files.length > 0;
        },
        { timeout: 5000 }
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Fill complete form with provided data
   */
  async fillCompleteForm(data: FormData): Promise<void> {
    await this.enterFirstName(data.firstName);
    await this.enterLastName(data.lastName);
    await this.enterEmail(data.email);
    await this.selectGender(data.gender);
    await this.enterMobileNumber(data.mobile);
    await this.selectDateOfBirth(data.dateOfBirth);
    await this.selectSubject(data.subject);
    await this.selectHobby(data.hobby);
    await this.uploadPicture();
    await this.enterCurrentAddress(data.address);
    await this.selectState(data.state);
    await this.selectCity(data.city);
  }

  /**
   * Verify all submitted data matches expected data
   */
  async verifyAllSubmittedData(submittedData: Record<string, string>, expectedData: FormData): Promise<void> {
    const assertions = [
      { key: 'Student Name', expected: `${expectedData.firstName} ${expectedData.lastName}` },
      { key: 'Student Email', expected: expectedData.email },
      { key: 'Gender', expected: expectedData.gender },
      { key: 'Mobile', expected: expectedData.mobile },
      { key: 'Subjects', expected: expectedData.subject },
      { key: 'Hobbies', expected: expectedData.hobby },
      { key: 'Address', expected: expectedData.address },
      { key: 'State and City', expected: `${expectedData.state} ${expectedData.city}` }
    ];

    for (const assertion of assertions) {
      if (submittedData[assertion.key] !== assertion.expected) {
        throw new Error(`Mismatch for ${assertion.key}: expected "${assertion.expected}", got "${submittedData[assertion.key]}"`);
      }
    }
  }

  /**
   * Wait for modal to be closed
   */
  async waitForModalToBeClosed(): Promise<boolean> {
    try {
      await this.page.waitForFunction(
        () => {
          const modal = document.querySelector('#example-modal-sizes-title-lg');
          return modal === null || !modal.isConnected || window.getComputedStyle(modal).display === 'none';
        },
        { timeout: 5000 }
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if form is still accessible after errors
   */
  async isFormAccessible(): Promise<boolean> {
    try {
      await this.firstNameInput.waitFor({ state: 'visible', timeout: 5000 });
      return await this.firstNameInput.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Take screenshot on test failure
   */
  async takeScreenshotOnFailure(testTitle: string): Promise<void> {
    const screenshotName = `failure-${testTitle.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.png`;
    const screenshotPath = path.join('test-results', 'screenshots', screenshotName);
    
    // Ensure directory exists
    const screenshotDir = path.dirname(screenshotPath);
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved: ${screenshotPath}`);
  }
}