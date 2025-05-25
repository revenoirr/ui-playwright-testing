import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class SelectMenuPage extends BasePage {
  // Selectors
  private selectValueDropdown = '#withOptGroup';
  private selectValueInput = '#react-select-2-input';
  private selectOneDropdown = '#selectOne';
  private selectOneInput = '#react-select-3-input';
  private oldStyleSelectMenu = '#oldSelectMenu';
  private multiselectDropdown = '#react-select-4-container';
  private multiselectInput = '#react-select-4-input';
  private selectedValueOption = '.css-1uccc91-singleValue';
  private multiSelectedOptions = '.css-12jo7m5';
  private multiValueRemove = '.css-xb97g8';

  constructor(page: Page) {
    super(page);
  }

  // Fixed navigate and select methods for SelectMenuPage.ts (lines 17-58)

async navigate(): Promise<void> {
  try {
    await super.navigate('/select-menu');
    // Use domcontentloaded instead of networkidle - much more reliable
    await this.page.waitForLoadState('domcontentloaded');
    
    // Wait for the main dropdown to be visible with increased timeout
    await this.page.waitForSelector(this.selectValueDropdown, { 
      state: 'visible', 
      timeout: 15000 
    });
    
    console.log('SelectMenu page navigation succeeded');
    
  } catch (error) {
    console.log('Primary navigation failed, trying alternative approach...');
    
    try {
      // Alternative approach - direct URL navigation
      await this.page.goto('https://demoqa.com/select-menu', {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      
      // Wait for page to stabilize
      await this.page.waitForTimeout(2000);
      
      // Check if main elements are present
      await this.page.waitForSelector(this.selectValueDropdown, { 
        state: 'visible', 
        timeout: 15000 
      });
      
      console.log('Alternative navigation succeeded');
      
    } catch (altError) {
      console.log('Alternative navigation also failed, trying last resort...');
      
      // Last resort - just wait for load
      await this.page.goto('https://demoqa.com/select-menu');
      await this.page.waitForLoadState('load');
      await this.page.waitForTimeout(5000); // Give extra time
      
      console.log('Last resort navigation completed');
    }
  }
}

/**
 * Select a value from the "Select Value" dropdown - IMPROVED
 */
async selectValueOption(option: string): Promise<void> {
  console.log(`Selecting value option: ${option}`);
  
  try {
    // Wait for dropdown to be visible and clickable with longer timeout
    await this.page.waitForSelector(this.selectValueDropdown, { 
      state: 'visible', 
      timeout: 15000 
    });
    
    // Scroll into view
    await this.page.locator(this.selectValueDropdown).scrollIntoViewIfNeeded();
    
    // Click the dropdown
    await this.click(this.selectValueDropdown);
    
    // Wait for the input to appear
    await this.page.waitForSelector(this.selectValueInput, { 
      state: 'visible', 
      timeout: 10000 
    });
    
    // Clear and fill the input
    await this.page.fill(this.selectValueInput, '');
    await this.page.fill(this.selectValueInput, option);
    await this.page.keyboard.press('Enter');
    
    // Wait for selection to complete
    await this.page.waitForTimeout(2000);
    
    console.log(`Successfully selected: ${option}`);
    
  } catch (error) {
    console.log(`Failed to select value option ${option}:`, error);
    
    // Alternative approach - try clicking option directly
    try {
      await this.page.click(`text="${option}"`, { timeout: 5000 });
      console.log(`Alternative selection succeeded for: ${option}`);
    } catch (altError) {
      throw new Error(`Could not select value option: ${option}. Both methods failed.`);
    }
  }
}

/**
 * Select an option from the "Select One" dropdown - IMPROVED
 */
async selectOneOption(option: string): Promise<void> {
  console.log(`Selecting one option: ${option}`);
  
  try {
    await this.page.waitForSelector(this.selectOneDropdown, { 
      state: 'visible', 
      timeout: 15000 
    });
    
    // Scroll into view
    await this.page.locator(this.selectOneDropdown).scrollIntoViewIfNeeded();
    
    await this.click(this.selectOneDropdown);
    
    await this.page.waitForSelector(this.selectOneInput, { 
      state: 'visible', 
      timeout: 10000 
    });
    
    await this.page.fill(this.selectOneInput, '');
    await this.page.fill(this.selectOneInput, option);
    await this.page.keyboard.press('Enter');
    
    await this.page.waitForTimeout(2000);
    
    console.log(`Successfully selected one: ${option}`);
    
  } catch (error) {
    console.log(`Failed to select one option ${option}:`, error);
    
    // Alternative approach
    try {
      await this.page.click(`text="${option}"`, { timeout: 5000 });
      console.log(`Alternative selection succeeded for: ${option}`);
    } catch (altError) {
      throw new Error(`Could not select one option: ${option}. Both methods failed.`);
    }
  }
}

/**
 * Select multiple options from multiselect dropdown - IMPROVED
 */
async selectMultipleOptions(options: string[]): Promise<void> {
  console.log(`Selecting multiple options: ${options.join(', ')}`);
  
  for (const option of options) {
    try {
      // Wait for multiselect dropdown
      await this.page.waitForSelector(this.multiselectDropdown, { 
        state: 'visible', 
        timeout: 15000 
      });
      
      await this.page.locator(this.multiselectDropdown).scrollIntoViewIfNeeded();
      await this.click(this.multiselectDropdown);
      
      // Wait for input
      await this.page.waitForSelector(this.multiselectInput, { 
        state: 'visible', 
        timeout: 10000 
      });
      
      await this.page.fill(this.multiselectInput, option);
      await this.page.keyboard.press('Enter');
      
      // Wait between selections
      await this.page.waitForTimeout(1000);
      
      console.log(`Selected: ${option}`);
      
    } catch (error) {
      console.log(`Failed to select ${option}:`, error);
      
      // Try alternative approach
      try {
        await this.page.click(`text="${option}"`, { timeout: 5000 });
        console.log(`Alternative selection succeeded for: ${option}`);
      } catch (altError) {
        console.log(`Could not select: ${option}`);
      }
    }
  }
}
  
// SelectMenuPage.ts - FINAL FIXED VERSION for getValue methods
/**
 * Get the selected value from "Select Value" dropdown
 */
async getSelectedValue(): Promise<string> {
  const selector = '#withOptGroup .css-1uccc91-singleValue, #withOptGroup .css-qc6sy-singleValue';
  await this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
  return (await this.page.textContent(selector)) ?? '';
}

/**
 * Get the selected value from "Select One" dropdown
 */
async getSelectedOneValue(): Promise<string> {
  const selector = '#selectOne .css-1uccc91-singleValue, #selectOne .css-qc6sy-singleValue';
  await this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
  return (await this.page.textContent(selector)) ?? '';
}

/**
 * Get the selected value from "Old Style Select Menu"
 */
async getSelectedOldStyleValue(): Promise<string> {
  const selectedOption = await this.page.$eval(this.oldStyleSelectMenu, (select: HTMLSelectElement) => {
    return select.options[select.selectedIndex]?.text || '';
  });
  return selectedOption;
}

/**
 * Get selected values from multiselect dropdown
 */
async getSelectedMultipleValues(): Promise<string[]> {
  const values: string[] = [];
  const valueElements = await this.page.$$('#react-select-4-container .css-12jo7m5');
  
  for (const element of valueElements) {
    const text = await element.textContent();
    if (text) {
      values.push(text.trim());
    }
  }
  
  return values;
}
}