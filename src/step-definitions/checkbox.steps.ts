import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CheckboxPage } from '../page-objects/CheckboxPage';

Given('I am on the checkbox page', { timeout: 60 * 1000 }, async function () {
  this.checkboxPage = new CheckboxPage(this.page);
  await this.checkboxPage.navigate();
});

When('I expand all checkbox sections', { timeout: 30 * 1000 }, async function () {
  await this.checkboxPage.expandAll();
});

When('I select the {string} checkbox', { timeout: 30 * 1000 }, async function (name: string) {
  await this.checkboxPage.selectCheckbox(name);
  // Дополнительная проверка с retry
  await expect.poll(
    async () => await this.checkboxPage.isCheckboxSelected(name),
    { 
      message: `Checkbox "${name}" should be selected`,
      intervals: [1000, 2000, 3000],
      timeout: 15000
    }
  ).toBe(true);
});

Then('the {string} checkbox should be selected', { timeout: 15 * 1000 }, async function (name: string) {
  const isSelected = await this.checkboxPage.isCheckboxSelected(name);
  expect(isSelected).toBe(true);
});