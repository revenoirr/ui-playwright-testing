import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { AlertsPage } from '../page-objects/AlertsPage';
import { CustomWorld } from '../support/world';

setDefaultTimeout(30000);

Given('I am on the alerts page', async function (this: CustomWorld) {
  //console.log('this.page перед созданием AlertsPage:', this.page);
  this.alertsPage = new AlertsPage(this.page);
  //console.log('alertsPage создан:', this.alertsPage);
  await this.alertsPage.navigate();
});

When('I click on the {string} alert button', async function (this: CustomWorld, buttonType: string) {
  const [dialog] = await Promise.all([
    this.page.waitForEvent('dialog'),
    (async () => {
      switch (buttonType.toLowerCase()) {
        case 'click me':
          await this.alertsPage.clickAlertButton();
          break;
        case 'click me after 5 seconds':
          await this.alertsPage.clickTimerAlertButton();
          break;
        case 'click me for confirm box':
          await this.alertsPage.clickConfirmButton();
          break;
        case 'click me for prompt box':
          await this.alertsPage.clickPromptButton();
          break;
        default:
          throw new Error(`Unknown alert button: ${buttonType}`);
      }
    })()
  ]);

  this.lastDialog = dialog;
});

Then('I should see a simple alert with message {string}', async function (this: CustomWorld, message: string) {
  expect(this.lastDialog).toBeDefined();
  expect(this.lastDialog.type()).toBe('alert');
  expect(this.lastDialog.message()).toBe(message);
});

Then('I should see a timed alert with message {string}', async function (this: CustomWorld, message: string) {
  expect(this.lastDialog).toBeDefined();
  expect(this.lastDialog.type()).toBe('alert');
  expect(this.lastDialog.message()).toBe(message);
});

Then('I should see a confirm alert with message {string}', async function (this: CustomWorld, message: string) {
  expect(this.lastDialog).toBeDefined();
  expect(this.lastDialog.type()).toBe('confirm');
  expect(this.lastDialog.message()).toBe(message);
});

Then('I should see a prompt alert with message {string}', async function (this: CustomWorld, message: string) {
  expect(this.lastDialog).toBeDefined();
  expect(this.lastDialog.type()).toBe('prompt');
  expect(this.lastDialog.message()).toBe(message);
});

When('I accept the alert', async function (this: CustomWorld) {
  if (this.lastDialog) {
    await this.lastDialog.accept();
    this.lastDialog = null;
  } else {
    throw new Error('No dialog available to accept');
  }
});

When('I dismiss the alert', async function (this: CustomWorld) {
  if (this.lastDialog) {
    await this.lastDialog.dismiss();
    this.lastDialog = null;
  } else {
    throw new Error('No dialog available to dismiss');
  }
});

When('I enter {string} in the prompt and accept', async function (this: CustomWorld, text: string) {
  if (this.lastDialog) {
    await this.lastDialog.accept(text);
    this.lastDialog = null;
  } else {
    throw new Error('No dialog available for prompt input');
  }
});

Then('I can close the alert', async function (this: CustomWorld) {
  if (this.lastDialog) {
    await this.lastDialog.accept();
    this.lastDialog = null;
  } else {
    throw new Error('No dialog available to close');
  }
});

Then('I should see {string} confirmation message', async function (this: CustomWorld, message: string) {
  await this.page.waitForSelector('#confirmResult', { state: 'visible' });
  const result = await this.alertsPage.getConfirmResult();
  expect(result).toBe(message);
});

Then('I should see {string} message', async function (this: CustomWorld, message: string) {
  await this.page.waitForSelector('#promptResult', { state: 'visible' });
  const result = await this.alertsPage.getPromptResult();
  expect(result).toBe(message);
});
