import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, chromium, firefox, Page } from 'playwright';
import { FormPage } from '../page-objects/FormPage';
import { expect } from '@playwright/test';

let browser: Browser;
let page: Page;
let formPage: FormPage;
let formData: any = {};

// Extended timeout for Playwright actions
setDefaultTimeout(60000);

Before(async function() {
  // Get browser from world parameters or default to chromium
  const browserType = this.parameters.browser || 'chrome';
  
  switch(browserType.toLowerCase()) {
    case 'firefox':
      browser = await firefox.launch({ headless: true });
      break;
    case 'chrome':
    default:
      browser = await chromium.launch({ headless: true });
      break;
  }
  
  // Create a new page with larger viewport to avoid issues with the DemoQA site
  page = await browser.newPage({
    viewport: { width: 1280, height: 720 }
  });
  
  // Initialize the form page
  formPage = new FormPage(page);
  
  // Reset the form data
  formData = {};
});

After(async function(context) {
  if (context.result && context.result.status === 'FAILED') {
    await formPage.takeScreenshot('alerts-test-failure');
  }

  await browser.close();
});

Given('I am on the practice form page', async function() {
  await formPage.navigate();
});

When('I enter {string} as first name', async function(firstName: string) {
  await formPage.enterFirstName(firstName);
  formData.firstName = firstName;
});

When('I enter {string} as last name', async function(lastName: string) {
  await formPage.enterLastName(lastName);
  formData.lastName = lastName;
});

When('I enter {string} as email', async function(email: string) {
  await formPage.enterEmail(email);
  formData.email = email;
});

When('I select {string} as gender', async function(gender: string) {
  await formPage.selectGender(gender);
  formData.gender = gender;
});

When('I enter {string} as mobile number', async function(mobile: string) {
  await formPage.enterMobileNumber(mobile);
  formData.mobile = mobile;
});

When('I select {string} as date of birth', async function(dateOfBirth: string) {
  await formPage.selectDateOfBirth(dateOfBirth);
  formData.dateOfBirth = dateOfBirth;
});

When('I select {string} as subject', async function(subject: string) {
  await formPage.selectSubject(subject);
  formData.subject = subject;
});

When('I select {string} as hobby', async function(hobby: string) {
  await formPage.selectHobby(hobby);
  formData.hobby = hobby;
});

When('I upload a sample picture', async function() {
  await formPage.uploadPicture();
  formData.pictureUploaded = true;
});

When('I enter {string} as current address', async function(address: string) {
  await formPage.enterCurrentAddress(address);
  formData.address = address;
});

When('I select {string} as state', async function(state: string) {
  await formPage.selectState(state);
  formData.state = state;
});

When('I select {string} as city', async function(city: string) {
  await formPage.selectCity(city);
  formData.city = city;
});

When('I submit the form', async function() {
  // Scroll to the submit button and click it
  await page.evaluate(() => {
    const element = document.getElementById('submit');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  
  await formPage.submitForm();
});

Then('I should see the form submission confirmation', async function() {
  const isConfirmationDisplayed = await formPage.isConfirmationDisplayed();
  expect(isConfirmationDisplayed).toBeTruthy();
});

Then('the submitted data should match my inputs', async function() {
  const submittedData = await formPage.getSubmittedData();
  
  // Check student name (firstName + lastName)
  if (formData.firstName && formData.lastName) {
    const expectedName = `${formData.firstName} ${formData.lastName}`;
    expect(submittedData['Student Name']).toBe(expectedName);
  }
  
  // Check email
  if (formData.email) {
    expect(submittedData['Student Email']).toBe(formData.email);
  }
  
  // Check gender
  if (formData.gender) {
    expect(submittedData['Gender']).toBe(formData.gender);
  }
  
  // Check mobile
  if (formData.mobile) {
    expect(submittedData['Mobile']).toBe(formData.mobile);
  }
  
  // Check if state and city are set correctly
  if (formData.state && formData.city) {
    expect(submittedData['State and City']).toBe(`${formData.state} ${formData.city}`);
  }
});