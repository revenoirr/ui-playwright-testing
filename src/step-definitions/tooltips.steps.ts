import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, chromium, firefox, Page } from 'playwright';
import { ToolTipsPage } from '../page-objects/ToolTipsPage';
import { expect } from '@playwright/test';

let browser: Browser;
let page: Page;
let toolTipsPage: ToolTipsPage;

// Extended timeout for Playwright actions
setDefaultTimeout(30000);

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
  
  // Create a new page
  page = await browser.newPage();
  
  // Initialize the tooltips page
  toolTipsPage = new ToolTipsPage(page);
});

After(async function(context) {
  if (context.result && context.result.status === 'FAILED') {
    await toolTipsPage.takeScreenshot('alerts-test-failure');
  }

  await browser.close();
});


Given('I am on the tooltips page', async function() {
  await toolTipsPage.navigate();
});

When('I hover over the {string} button', async function(buttonText: string) {
  if (buttonText === 'Hover me to see') {
    await toolTipsPage.hoverOverButton();
  } else {
    throw new Error(`Button "${buttonText}" not recognized`);
  }
});

When('I hover over the input field', async function() {
  await toolTipsPage.hoverOverInputField();
});

When('I hover over the {string} text', async function(text: string) {
  if (text === 'Contrary') {
    await toolTipsPage.hoverOverContraryText();
  } else if (text === '1.10.32') {
    await toolTipsPage.hoverOverSectionText();
  } else {
    throw new Error(`Text "${text}" not recognized`);
  }
});

Then('I should see a tooltip with text {string}', async function(expectedText: string) {
  const isTooltipVisible = await toolTipsPage.isTooltipVisible();
  expect(isTooltipVisible).toBeTruthy();
  
  const tooltipText = await toolTipsPage.getTooltipText();
  expect(tooltipText).toBe(expectedText);
});