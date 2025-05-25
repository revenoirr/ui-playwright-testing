import { Given, When, Then } from '@cucumber/cucumber';
import { DragDropPage } from '../page-objects/DragDropPage';
import { expect } from '@playwright/test';

let dragDropPage: DragDropPage;

Given('I am on the drag and drop page', async function () {
  dragDropPage = new DragDropPage(this.page);
  await dragDropPage.navigate();
});

When('I drag the draggable element to the drop target', async function () {
  await dragDropPage.performDragAndDrop();
});

Then('the drop target should display {string}', async function (expectedText: string) {
  const dropText = await dragDropPage.getDropText();
  expect(dropText.trim()).toBe(expectedText);
});
