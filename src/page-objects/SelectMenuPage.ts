import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SelectMenuPage extends BasePage {
  private readonly selectValueDropdown: Locator;
  private readonly selectValueInput: Locator;
  private readonly selectOneDropdown: Locator;
  private readonly selectOneInput: Locator;
  private readonly oldStyleSelectMenu: Locator;
  private readonly multiselectDropdown: Locator;
  private readonly multiselectInput: Locator;
  private readonly selectedValueOption: Locator;
  private readonly multiSelectedOptions: Locator;
  private readonly multiValueRemove: Locator;
  private readonly selectContainer: Locator;

  constructor(page: Page) {
    super(page);
    
    this.selectValueDropdown = this.page.locator('#withOptGroup');
    this.selectValueInput = this.page.locator('#react-select-2-input');
    this.selectOneDropdown = this.page.locator('#selectOne');
    this.selectOneInput = this.page.locator('#react-select-3-input');
    this.oldStyleSelectMenu = this.page.locator('#oldSelectMenu');
    // Fixed: More reliable multiselect locator
    this.multiselectDropdown = this.page.locator('div').filter({ hasText: 'Select...' }).last();
    this.multiselectInput = this.page.locator('input[id]').last();
    this.selectedValueOption = this.page.locator('.css-1uccc91-singleValue');
    this.multiSelectedOptions = this.page.locator('[class*="multiValue"]');
    this.multiValueRemove = this.page.locator('.css-xb97g8');
    this.selectContainer = this.page.locator('#selectMenuContainer');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/select-menu');
    
    // Fixed: Use 'load' instead of 'networkidle' to avoid timeout
    await this.page.waitForLoadState('load');
    
    // Wait for main container to be visible
    await this.selectContainer.waitFor({ state: 'visible', timeout: 10000 });
    
    await this.removePageBlockers();
    
    // Reduced wait time
    await this.page.waitForTimeout(500);
  }

  private async removePageBlockers(): Promise<void> {
    await this.page.evaluate(() => {
      const blockers = [
        '#fixedban',
        '[id*="google_ads"]',
        '[class*="ad"]',
        '[class*="overlay"]',
        '[class*="modal"]',
        '[class*="popup"]'
      ];
      
      blockers.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });
    });
  }

  async selectValueOption(option: string): Promise<void> {
    await this.selectValueDropdown.waitFor({ state: 'visible' });
    await this.selectValueDropdown.scrollIntoViewIfNeeded();
    await this.selectValueDropdown.click();
    
    await this.selectValueInput.waitFor({ state: 'visible' });
    await this.selectValueInput.fill(option);
    await this.page.keyboard.press('Enter');
    
    await this.page.waitForFunction(
      (selectedOption) => {
        const valueElement = document.querySelector('#withOptGroup .css-1uccc91-singleValue, #withOptGroup .css-qc6sy-singleValue');
        return valueElement && valueElement.textContent?.trim() === selectedOption;
      },
      option,
      { timeout: 10000 }
    );
  }

  async selectOneOption(option: string): Promise<void> {
    await this.selectOneDropdown.waitFor({ state: 'visible' });
    await this.selectOneDropdown.scrollIntoViewIfNeeded();
    await this.selectOneDropdown.click();
    
    await this.selectOneInput.waitFor({ state: 'visible' });
    await this.selectOneInput.fill(option);
    await this.page.keyboard.press('Enter');
    
    await this.page.waitForFunction(
      (selectedOption) => {
        const valueElement = document.querySelector('#selectOne .css-1uccc91-singleValue, #selectOne .css-qc6sy-singleValue');
        return valueElement && valueElement.textContent?.trim() === selectedOption;
      },
      option,
      { timeout: 10000 }
    );
  }

  async selectOldStyle(option: string): Promise<void> {
    await this.oldStyleSelectMenu.waitFor({ state: 'visible' });
    await this.oldStyleSelectMenu.scrollIntoViewIfNeeded();
    
    await this.oldStyleSelectMenu.selectOption({ label: option });
    
    await this.page.waitForFunction(
      (selectedOption) => {
        const select = document.querySelector('#oldSelectMenu') as HTMLSelectElement;
        return select && select.options[select.selectedIndex]?.text === selectedOption;
      },
      option,
      { timeout: 5000 }
    );
  }

  // Fixed: Simplified multiselect logic
  async selectMultipleOptions(options: string[]): Promise<void> {
    for (const option of options) {
      // Click on the multiselect container
      await this.multiselectDropdown.click();
      
      // Wait for input to be visible and type the option
      await this.multiselectInput.waitFor({ state: 'visible' });
      await this.multiselectInput.fill(option);
      await this.page.keyboard.press('Enter');
      
      // Fixed: Wait for the option to appear in selected values
      await this.page.waitForSelector(`text=${option}`, { timeout: 5000 });
      
      // Small delay between selections
      await this.page.waitForTimeout(300);
    }
  }

  async getSelectedValue(): Promise<string> {
    const valueSelector = this.page.locator('#withOptGroup .css-1uccc91-singleValue, #withOptGroup .css-qc6sy-singleValue');
    await valueSelector.waitFor({ state: 'visible' });
    return (await valueSelector.textContent())?.trim() || '';
  }

  async getSelectedOneValue(): Promise<string> {
    const valueSelector = this.page.locator('#selectOne .css-1uccc91-singleValue, #selectOne .css-qc6sy-singleValue');
    await valueSelector.waitFor({ state: 'visible' });
    return (await valueSelector.textContent())?.trim() || '';
  }

  async getSelectedOldStyleValue(): Promise<string> {
    await this.oldStyleSelectMenu.waitFor({ state: 'visible' });
    
    return await this.page.evaluate(() => {
      const select = document.querySelector('#oldSelectMenu') as HTMLSelectElement;
      return select?.options[select.selectedIndex]?.text || '';
    });
  }

  // Fixed: Simplified multiselect value retrieval
  async getSelectedMultipleValues(): Promise<string[]> {
    const valueElements = this.page.locator('[class*="multiValue"] [class*="label"], .css-12jo7m5');
    const count = await valueElements.count();
    
    const values: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await valueElements.nth(i).textContent();
      if (text) {
        values.push(text.trim());
      }
    }
    return values;
  }

  async waitForSelectionVisible(dropdownType: 'selectValue' | 'selectOne' | 'oldStyle', expectedValue: string): Promise<void> {
    const selectors = {
      selectValue: '#withOptGroup .css-1uccc91-singleValue, #withOptGroup .css-qc6sy-singleValue',
      selectOne: '#selectOne .css-1uccc91-singleValue, #selectOne .css-qc6sy-singleValue',
      oldStyle: '#oldSelectMenu'
    };

    await this.page.waitForFunction(
      ({ selector, value, type }) => {
        if (type === 'oldStyle') {
          const select = document.querySelector(selector) as HTMLSelectElement;
          return select && select.options[select.selectedIndex]?.text === value;
        } else {
          const element = document.querySelector(selector);
          return element && element.textContent?.trim() === value;
        }
      },
      { selector: selectors[dropdownType], value: expectedValue, type: dropdownType },
      { timeout: 10000 }
    );
  }

  // Fixed: Simplified multiselect wait
  async waitForMultiselectContains(expectedValues: string[]): Promise<void> {
    for (const value of expectedValues) {
      await this.page.waitForSelector(`text=${value}`, { timeout: 10000 });
    }
  }

  // Fixed: Simplified readiness check
  async isDropdownReady(dropdownType: 'selectValue' | 'selectOne' | 'multiselect' | 'oldStyle'): Promise<boolean> {
    try {
      switch (dropdownType) {
        case 'selectValue':
          await this.selectValueDropdown.waitFor({ state: 'visible', timeout: 5000 });
          return true;
          
        case 'selectOne':
          await this.selectOneDropdown.waitFor({ state: 'visible', timeout: 5000 });
          return true;
          
        case 'oldStyle':
          await this.oldStyleSelectMenu.waitFor({ state: 'visible', timeout: 5000 });
          return true;
          
        case 'multiselect':
          await this.multiselectDropdown.waitFor({ state: 'visible', timeout: 5000 });
          return true;
          
        default:
          return false;
      }
    } catch {
      return false;
    }
  }
}