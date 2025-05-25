import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class RadioButtonPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Fixed navigate method for RadioButtonPage.ts (lines 49-79)
async navigate(): Promise<void> {
  console.log('Attempting to navigate to radio button page...');
  
  try {
    // Strategy 1: Direct navigation with more reliable wait conditions
    await this.page.goto('https://demoqa.com/radio-button', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    // Wait for specific elements instead of networkidle
    await this.page.waitForSelector('.main-header', { timeout: 10000 }).catch(() => {
      console.log('Main header not found, but continuing...');
    });
    
    // Wait for radio button elements to be present
    await this.page.waitForSelector('input[type="radio"], .custom-radio', { timeout: 10000 });
    
    console.log('Direct navigation succeeded');
    return;
    
  } catch (error) {
    console.log('Direct navigation failed, trying alternative approaches...');
    
    // Strategy 2: Navigation with load state
    try {
      await this.page.goto('https://demoqa.com/radio-button', { 
        waitUntil: 'load',
        timeout: 30000 
      });
      
      // Wait for radio button elements
      await this.page.waitForSelector('input[type="radio"], .custom-radio', { timeout: 10000 });
      console.log('Load state navigation succeeded');
      return;
      
    } catch (loadError) {
      console.log('Load state navigation failed, trying manual navigation...');
    }

    // Strategy 3: Manual navigation through menu with better waits
    try {
      await this.page.goto('https://demoqa.com/', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      // Wait for and click Elements
      await this.page.waitForSelector('text=Elements', { timeout: 10000 });
      await this.page.click('text=Elements');
      await this.page.waitForTimeout(2000);
      
      // Wait for and click Radio Button
      await this.page.waitForSelector('text=Radio Button', { timeout: 10000 });
      await this.page.click('text=Radio Button');
      
      // Wait for radio button elements to appear
      await this.page.waitForSelector('input[type="radio"], .custom-radio', { timeout: 10000 });
      
      console.log('Manual navigation succeeded');
      return;
      
    } catch (manualError) {
      console.log('Manual navigation also failed');
    }

    // Strategy 4: Last resort - just wait for load and hope for the best
    try {
      await this.page.goto('https://demoqa.com/radio-button');
      await this.page.waitForLoadState('load');
      await this.page.waitForTimeout(3000); // Give extra time for page to stabilize
      
      console.log('Last resort navigation completed');
      return;
      
    } catch (finalError) {
      console.log('All navigation strategies failed');
    }
    
    throw new Error(`Could not navigate to radio button page. Original error: ${error}`);
  }
}

async selectRadio(buttonLabel: string): Promise<void> {
  console.log(`Selecting radio button: ${buttonLabel}`);
  
  // Wait for page to be ready
  await this.page.waitForTimeout(1000);
  
  // Multiple selectors to try in order of preference
  const selectors = [
    `label[for="${buttonLabel.toLowerCase()}Radio"]`, // Most specific
    `label:has-text("${buttonLabel}")`,
    `label[for*="${buttonLabel.toLowerCase()}"]`,
    `//label[contains(text(),"${buttonLabel}")]`,
    `.custom-radio:has-text("${buttonLabel}")`,
    `input[value="${buttonLabel.toLowerCase()}"] + label`,
    `[id*="${buttonLabel.toLowerCase()}"] + label`
  ];

  let clicked = false;
  
  for (const selector of selectors) {
    try {
      console.log(`Trying selector: ${selector}`);
      
      // Wait for element to be visible
      await this.page.waitForSelector(selector, { 
        state: 'visible', 
        timeout: 5000 
      });
      
      // Scroll into view
      await this.page.locator(selector).scrollIntoViewIfNeeded();
      
      // Try to click
      await this.page.click(selector, { timeout: 3000 });
      
      console.log(`Successfully clicked radio button with selector: ${selector}`);
      clicked = true;
      break;
      
    } catch (selectorError) {
      console.log(`Selector ${selector} failed: ${selectorError}`);
      continue;
    }
  }
  
  if (!clicked) {
    // Last resort - try to find and click by JavaScript
    try {
      await this.page.evaluate((label) => {
        const labels = Array.from(document.querySelectorAll('label'));
        const targetLabel = labels.find(l => l.textContent?.includes(label));
        if (targetLabel) {
          targetLabel.click();
          return true;
        }
        return false;
      }, buttonLabel);
      
      console.log(`JavaScript click succeeded for: ${buttonLabel}`);
      clicked = true;
      
    } catch (jsError) {
      console.log(`JavaScript click failed: ${jsError}`);
    }
  }
  
  if (!clicked) {
    throw new Error(`Could not click radio button: ${buttonLabel}. None of the selectors worked.`);
  }
  
  // Wait for selection to register
  await this.page.waitForTimeout(1000);
}

  async getResult(): Promise<string> {
    const resultSelectors = [
      '.text-success',
      '.mt-3',
      '[class*="success"]',
      '[class*="result"]',
      '#result'
    ];
    
    for (const selector of resultSelectors) {
      try {
        await this.page.waitForSelector(selector, { state: 'visible', timeout: 3000 });
        const result = await this.page.textContent(selector);
        if (result && result.trim()) {
          console.log(`Found result: "${result}" with selector: ${selector}`);
          return result.trim();
        }
      } catch (error) {
        continue;
      }
    }
    
    console.log('No result found');
    return '';
  }
}