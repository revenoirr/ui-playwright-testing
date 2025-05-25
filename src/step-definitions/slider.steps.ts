import { Given, When, Then } from '@cucumber/cucumber';
import { SliderPage } from '../page-objects/SliderPage';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

let sliderPage: SliderPage;

Given('I am on the slider page', async function (this: CustomWorld) {
  sliderPage = new SliderPage(this.page); 
  await sliderPage.navigate();
});

When('I move the slider to {int}', async function (value: number) {
  await sliderPage.setSliderValue(value);
});

Then('the slider value should be {int}', async function (expected: number) {
  const actual = await sliderPage.getSliderValue();
  expect(actual).toBe(expected);
});
