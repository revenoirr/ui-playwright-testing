
// 1. COMPLETELY REPLACE your selectmenu.steps.ts with this version to remove duplicates:

import { Given, When, Then } from '@cucumber/cucumber';
import { SelectMenuPage } from '../page-objects/SelectMenuPage';
import { expect } from '@playwright/test';

let selectMenuPage: SelectMenuPage;

Given('I am on the select menu page', async function () {
  selectMenuPage = new SelectMenuPage(this.page);
  await selectMenuPage.navigate();
});

When('I select {string} from the {string} dropdown', async function (option: string, dropdownName: string) {
  switch (dropdownName) {
    case 'Select Value':
      await selectMenuPage.selectValueOption(option);
      break;
    case 'Select One':
      await selectMenuPage.selectOneOption(option);
      break;
    case 'Old Style Select Menu':
      await selectMenuPage.selectOldStyle(option);
      break;
    default:
      throw new Error(`Unknown dropdown: ${dropdownName}`);
  }
});

When('I select {string} and {string} from the {string}', async function (option1: string, option2: string, dropdownName: string) {
  if (dropdownName === 'Multiselect dropdown') {
    await selectMenuPage.selectMultipleOptions([option1, option2]);
  } else {
    throw new Error(`Multiselect not supported for: ${dropdownName}`);
  }
});

Then('the {string} dropdown should display {string}', async function (dropdownName: string, expectedValue: string) {
  let actualValue: string;
  
  switch (dropdownName) {
    case 'Select Value':
      actualValue = await selectMenuPage.getSelectedValue();
      break;
    case 'Select One':
      actualValue = await selectMenuPage.getSelectedOneValue();
      break;
    case 'Old Style Select Menu':
      actualValue = await selectMenuPage.getSelectedOldStyleValue();
      break;
    default:
      throw new Error(`Unknown dropdown: ${dropdownName}`);
  }
  
  expect(actualValue).toBe(expectedValue);
});

Then('the {string} should display {string} and {string}', async function (dropdownName: string, value1: string, value2: string) {
  if (dropdownName === 'Multiselect dropdown') {
    const actualValues = await selectMenuPage.getSelectedMultipleValues();
    expect(actualValues).toContain(value1);
    expect(actualValues).toContain(value2);
  } else {
    throw new Error(`Multiple value verification not supported for: ${dropdownName}`);
  }
});