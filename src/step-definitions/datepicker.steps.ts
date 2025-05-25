import { Given, When, Then } from '@cucumber/cucumber';
import { DatePickerPage } from '../page-objects/DatePickerPage';
import { expect } from '@playwright/test';

let datePickerPage: DatePickerPage;

Given('I am on the date picker page', async function () {
  datePickerPage = new DatePickerPage(this.page);
  await datePickerPage.navigate();
});

When('I select the date {string}', async function (date: string) {
  await datePickerPage.selectDate(date);
});

Then('the date field should display {string}', async function (expectedDate: string) {
  const selected = await datePickerPage.getSelectedDate();
  expect(selected).toBe(expectedDate);
});
