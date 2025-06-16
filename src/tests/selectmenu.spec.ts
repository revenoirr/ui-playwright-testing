import { test, expect } from '@playwright/test';
import { SelectMenuPage } from '../page-objects/SelectMenuPage';

test.describe('Select Menu Tests', () => {
  let selectMenuPage: SelectMenuPage;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    selectMenuPage = new SelectMenuPage(page);
    
    await selectMenuPage.navigate();
    
    // Reduced wait time
    await page.waitForTimeout(1000);
  });

  test.describe('Single Selection Dropdowns', () => {
    
    test('should select option from Select Value dropdown', async () => {
      const isReady = await selectMenuPage.isDropdownReady('selectValue');
      expect(isReady).toBe(true);
      
      await selectMenuPage.selectValueOption('Group 1, option 1');
      
      await selectMenuPage.waitForSelectionVisible('selectValue', 'Group 1, option 1');
      const selectedValue = await selectMenuPage.getSelectedValue();
      expect(selectedValue).toBe('Group 1, option 1');
    });

    test('should select option from Select One dropdown', async () => {
      const isReady = await selectMenuPage.isDropdownReady('selectOne');
      expect(isReady).toBe(true);
      
      await selectMenuPage.selectOneOption('Mrs.');
      
      await selectMenuPage.waitForSelectionVisible('selectOne', 'Mrs.');
      const selectedValue = await selectMenuPage.getSelectedOneValue();
      expect(selectedValue).toBe('Mrs.');
    });

    test('should select option from Old Style Select Menu', async () => {
      const isReady = await selectMenuPage.isDropdownReady('oldStyle');
      expect(isReady).toBe(true);
      
      await selectMenuPage.selectOldStyle('Blue');
      
      await selectMenuPage.waitForSelectionVisible('oldStyle', 'Blue');
      const selectedValue = await selectMenuPage.getSelectedOldStyleValue();
      expect(selectedValue).toBe('Blue');
    });
  });

  test.describe('Multiple Selection Dropdown', () => {
    
    const multiSelectTestData = [
      { 
        scenario: 'should select two car brands from multiselect dropdown',
        options: ['Volvo', 'Audi'],
        description: 'User selects multiple car brands from multiselect dropdown'
      },
      {
        scenario: 'should select three car brands from multiselect dropdown', 
        options: ['Volvo', 'Saab', 'Audi'],
        description: 'User selects multiple car brands including Saab'
      }
    ];

    multiSelectTestData.forEach(({ scenario, options }) => {
      test(scenario, async () => {
        const isReady = await selectMenuPage.isDropdownReady('multiselect');
        expect(isReady).toBe(true);
        
        await selectMenuPage.selectMultipleOptions(options);
        
        await selectMenuPage.waitForMultiselectContains(options);
        const selectedValues = await selectMenuPage.getSelectedMultipleValues();
        
        expect(selectedValues.length).toBeGreaterThanOrEqual(options.length);
        
        options.forEach(option => {
          const isSelected = selectedValues.some(selected => 
            selected.toLowerCase().includes(option.toLowerCase())
          );
          expect(isSelected).toBe(true);
        });
      });
    });
  });

  test.describe('Dropdown Interaction Scenarios', () => {
    
    test('should handle all dropdown types in sequence', async () => {
      expect(await selectMenuPage.isDropdownReady('selectValue')).toBe(true);
      expect(await selectMenuPage.isDropdownReady('selectOne')).toBe(true);
      expect(await selectMenuPage.isDropdownReady('oldStyle')).toBe(true);
      expect(await selectMenuPage.isDropdownReady('multiselect')).toBe(true);
      
      await selectMenuPage.selectValueOption('Group 2, option 1');
      await selectMenuPage.waitForSelectionVisible('selectValue', 'Group 2, option 1');
      
      await selectMenuPage.selectOneOption('Dr.');
      await selectMenuPage.waitForSelectionVisible('selectOne', 'Dr.');
      
      await selectMenuPage.selectOldStyle('Red');
      await selectMenuPage.waitForSelectionVisible('oldStyle', 'Red');
      
      await selectMenuPage.selectMultipleOptions(['Volvo', 'Opel']);
      await selectMenuPage.waitForMultiselectContains(['Volvo', 'Opel']);
      
      expect(await selectMenuPage.getSelectedValue()).toBe('Group 2, option 1');
      expect(await selectMenuPage.getSelectedOneValue()).toBe('Dr.');
      expect(await selectMenuPage.getSelectedOldStyleValue()).toBe('Red');
      
      const multiselectValues = await selectMenuPage.getSelectedMultipleValues();
      expect(multiselectValues.length).toBeGreaterThanOrEqual(2);
    });

    test('should verify dropdown states after page reload', async ({ page }) => {
      await selectMenuPage.selectValueOption('Group 1, option 2');
      await selectMenuPage.selectOneOption('Mr.');
      await selectMenuPage.selectOldStyle('Green');
      
      await page.reload({ waitUntil: 'load' });
      
      await selectMenuPage.navigate();
      
      expect(await selectMenuPage.isDropdownReady('selectValue')).toBe(true);
      expect(await selectMenuPage.isDropdownReady('selectOne')).toBe(true);
      expect(await selectMenuPage.isDropdownReady('oldStyle')).toBe(true);
      expect(await selectMenuPage.isDropdownReady('multiselect')).toBe(true);
    });
  });

  test.describe('Dropdown Edge Cases', () => {
    
    test('should handle empty multiselect gracefully', async () => {
      const multiselectReady = await selectMenuPage.isDropdownReady('multiselect');
      expect(multiselectReady).toBe(true);
      
      const emptyValues = await selectMenuPage.getSelectedMultipleValues();
      
      expect(Array.isArray(emptyValues)).toBe(true);
      expect(emptyValues.length).toBe(0);
    });

    test('should verify all dropdown options are accessible', async () => {
      const dropdownTypes = ['selectValue', 'selectOne', 'oldStyle', 'multiselect'] as const;
      
      const readinessResults: boolean[] = [];
      
      for (const dropdownType of dropdownTypes) {
        const isReady = await selectMenuPage.isDropdownReady(dropdownType);
        readinessResults.push(isReady);
      }
      
      readinessResults.forEach((isReady) => {
        expect(isReady).toBe(true);
      });
    });
  });
});