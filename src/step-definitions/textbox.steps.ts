import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, chromium, firefox, Page } from 'playwright';
import { TextBoxPage } from '../page-objects/TextBoxPage';
import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

let browser: Browser;
let page: Page;
let textBoxPage: TextBoxPage;

// Store the generated data to verify later
let generatedData = {
  fullName: '',
  email: '',
  currentAddress: '',
  permanentAddress: ''
};

setDefaultTimeout(30000);

Before(async function () {
  const browserType = this.parameters.browser || 'chrome';

  switch (browserType.toLowerCase()) {
    case 'firefox':
      browser = await firefox.launch({ headless: true });
      break;
    case 'chrome':
    default:
      browser = await chromium.launch({ headless: true });
      break;
  }

  page = await browser.newPage();
  textBoxPage = new TextBoxPage(page);
});

After(async function (context) {
  if (context.result && context.result.status === 'FAILED') {
    await page.screenshot({ path: 'screenshots/textbox-failure.png' });
  }
  await browser.close();
});

Given('I am on the text box page', async function () {
  await textBoxPage.navigate();
});

When('I enter a random full name', async function () {
  generatedData.fullName = faker.person.fullName();
  await textBoxPage.enterFullName(generatedData.fullName);
});

When('I enter a random email', async function () {
  generatedData.email = faker.internet.email();
  await textBoxPage.enterEmail(generatedData.email);
});

When('I enter a random current address', async function () {
  generatedData.currentAddress = faker.location.streetAddress({ useFullAddress: true });
  await textBoxPage.enterCurrentAddress(generatedData.currentAddress);
});

When('I enter a random permanent address', async function () {
  generatedData.permanentAddress = faker.location.streetAddress({ useFullAddress: true });
  await textBoxPage.enterPermanentAddress(generatedData.permanentAddress);
});

When('I submit the text box form', async function () {
  await textBoxPage.submitForm();
});

Then('I should see the submitted data displayed', async function () {
  const isDisplayed = await textBoxPage.isOutputDisplayed();
  expect(isDisplayed).toBe(true);
});

Then('the displayed data should match my inputs', async function () {
  const submittedName = await textBoxPage.getSubmittedName();
  const submittedEmail = await textBoxPage.getSubmittedEmail();
  const submittedCurrentAddress = await textBoxPage.getSubmittedCurrentAddress();
  const submittedPermanentAddress = await textBoxPage.getSubmittedPermanentAddress();

  expect(submittedName).toBe(generatedData.fullName);
  expect(submittedEmail).toBe(generatedData.email);
  expect(submittedCurrentAddress).toBe(generatedData.currentAddress);
  expect(submittedPermanentAddress).toBe(generatedData.permanentAddress);
});

// Keep existing step definitions for backward compatibility
When('I enter the full name {string}', async function (name: string) {
  await textBoxPage.enterFullName(name);
});

When('I enter the email {string}', async function (email: string) {
  await textBoxPage.enterEmail(email);
});

When('I enter the current address {string}', async function (address: string) {
  await textBoxPage.enterCurrentAddress(address);
});

When('I enter the permanent address {string}', async function (address: string) {
  await textBoxPage.enterPermanentAddress(address);
});

When('I submit the forms', async function () {
  await textBoxPage.submitForm();
});

Then('the output should be visible', async function () {
  const visible = await textBoxPage.isOutputDisplayed();
  expect(visible).toBe(true);
});

Then('the submitted name should be {string}', async function (expected: string) {
  const actual = await textBoxPage.getSubmittedName();
  expect(actual).toBe(expected);
});

Then('the submitted email should be {string}', async function (expected: string) {
  const actual = await textBoxPage.getSubmittedEmail();
  expect(actual).toBe(expected);
});

Then('the submitted current address should be {string}', async function (expected: string) {
  const actual = await textBoxPage.getSubmittedCurrentAddress();
  expect(actual).toBe(expected);
});

Then('the submitted permanent address should be {string}', async function (expected: string) {
  const actual = await textBoxPage.getSubmittedPermanentAddress();
  expect(actual).toBe(expected);
});