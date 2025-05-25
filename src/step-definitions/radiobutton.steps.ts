// radiobutton.steps.ts - FIXED VERSION
import { Given, When, Then } from '@cucumber/cucumber';
import { RadioButtonPage } from '../page-objects/RadioButtonPage';
import { expect } from '@playwright/test';

let radioPage: RadioButtonPage;

Given('I am on the radio button page', async function () {
  radioPage = new RadioButtonPage(this.page);
  await radioPage.navigate();
});

// FIXED: Use consistent method for all radio button selections
When('I select the {string} radio button', async function (label: string) {
  await radioPage.selectRadio(label);
});

When('I select the Yes radio button', async function () {
  await radioPage.selectRadio('Yes');
});

When('I select the Impressive radio button', async function () {
  await radioPage.selectRadio('Impressive');
});

Then('I should see the result message {string}', async function (expected: string) {
  const result = await radioPage.getResult();
  // Extract just the word from the expected message (e.g., "You have selected Yes" -> "Yes")
  const expectedWord = expected.split(' ').pop();
  expect(result).toBe(expectedWord);
});