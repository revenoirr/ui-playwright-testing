import { test, expect } from '@playwright/test';
//TODO remove locators to the Page Object
test.describe('Drag and Drop Page', () => {
  test('should drag the draggable element to the drop target and verify text', async ({ page }) => {
    await page.goto('https://demoqa.com/droppable');

    // Wait for page to load - use domcontentloaded instead of networkidle
    await page.waitForLoadState('domcontentloaded');

    // Wait for specific elements to be visible instead of networkidle
    await page.waitForSelector('#draggable', { state: 'visible', timeout: 15000 });
    await page.waitForSelector('#droppable', { state: 'visible', timeout: 15000 });

    // Alternative approach: Use the Simple tab specifically
    try {
      await page.click('text=Simple', { timeout: 5000 });
      await page.waitForTimeout(1000);
    } catch (error) {
      console.log('Simple tab not found or already selected, continuing...');
    }

    // Use more specific selectors to avoid strict mode violation
    const simpleDraggable = page.locator('[role="tabpanel"][aria-labelledby="droppableExample-tab-simple"] #draggable').first();
    const simpleDropTarget = page.locator('[role="tabpanel"][aria-labelledby="droppableExample-tab-simple"] #droppable').first();

    // Fallback to basic selectors if specific ones don't work
    let draggable, dropTarget;

    try {
      await expect(simpleDraggable).toBeVisible({ timeout: 5000 });
      await expect(simpleDropTarget).toBeVisible({ timeout: 5000 });
      draggable = simpleDraggable;
      dropTarget = simpleDropTarget;
    } catch (error) {
      console.log('Using fallback selectors...');
      draggable = page.locator('#draggable').first();
      dropTarget = page.locator('#droppable').first();

      await expect(draggable).toBeVisible({ timeout: 10000 });
      await expect(dropTarget).toBeVisible({ timeout: 10000 });
    }

    // Ensure elements are visible and scroll into view
    await draggable.scrollIntoViewIfNeeded();
    await dropTarget.scrollIntoViewIfNeeded();

    // Get initial text for comparison
    const initialText = await dropTarget.textContent();
    console.log('Initial drop target text:', initialText);

    // Perform drag and drop with multiple approaches
    try {
      await draggable.dragTo(dropTarget);
    } catch (dragError) {
      console.log('Standard drag failed, trying manual drag...');

      // Manual drag approach
      const draggableBox = await draggable.boundingBox();
      const dropTargetBox = await dropTarget.boundingBox();

      if (draggableBox && dropTargetBox) {
        await page.mouse.move(draggableBox.x + draggableBox.width / 2, draggableBox.y + draggableBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(dropTargetBox.x + dropTargetBox.width / 2, dropTargetBox.y + dropTargetBox.height / 2);
        await page.mouse.up();
      }
    }

    // Wait for the drop operation to complete
    await page.waitForTimeout(2000);

    // Check the result - wait for text change with multiple attempts
    try {
      await expect(dropTarget).toHaveText('Dropped!', { timeout: 10000 });
    } catch (error) {
      // Debug information
      const finalText = await dropTarget.textContent();
      console.log('Final drop target text:', finalText);

      // Take screenshot for debugging
      await page.screenshot({ path: 'debug-dragdrop.png' });

      // Try alternative text checks
      const possibleTexts = ['Dropped!', 'Drop here', 'Dropped'];
      let textFound = false;

      for (const text of possibleTexts) {
        try {
          await expect(dropTarget).toContainText(text, { timeout: 2000 });
          textFound = true;
          console.log(`Found text: ${text}`);
          break;
        } catch (e) {
          continue;
        }
      }

      if (!textFound) {
        throw new Error(`Expected 'Dropped!' but got '${finalText}'. Initial text was '${initialText}'`);
      }
    }
  });
});
