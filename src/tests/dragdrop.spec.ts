import { test, expect } from '@playwright/test';
import { DragDropPage } from '../page-objects/DragDropPage';

test.describe('Drag and Drop Page', () => {
  let dragDropPage: DragDropPage;

  test.beforeEach(async ({ page }) => {
    dragDropPage = new DragDropPage(page);
    await dragDropPage.navigate();
    // Ensure we're working with the Simple tab for consistency
    await dragDropPage.selectSimpleTab();
  });

  test('should drag the draggable element to the drop target and verify text', async () => {
    // Get initial text for comparison
    const initialText = await dragDropPage.getInitialDropText();
    console.log('Initial drop target text:', initialText);

    // Perform drag and drop
    await dragDropPage.performDragAndDrop();

    // Wait for drop completion
    await dragDropPage.waitForDropText('Dropped');

    // Verify the drop operation was successful
    const isSuccessful = await dragDropPage.isDropSuccessful();
    expect(isSuccessful).toBe(true);

    // Additional verification
    const finalText = await dragDropPage.getDropText();
    expect(finalText.toLowerCase()).toContain('dropped');
  });

  test('verify initial state before drag and drop', async () => {
    const initialText = await dragDropPage.getInitialDropText();
    expect(initialText.toLowerCase()).not.toContain('dropped');
    
    // Verify initial state contains expected text
    expect(initialText.length).toBeGreaterThan(0);
  });

  test('verify drop text changes after successful drag and drop', async () => {
    const initialText = await dragDropPage.getInitialDropText();
    
    // Perform drag and drop
    await dragDropPage.performDragAndDrop();
    
    // Wait for text change
    await dragDropPage.waitForDropText('Dropped');
    
    const finalText = await dragDropPage.getDropText();
    
    // Verify text has changed
    expect(finalText).not.toBe(initialText);
    expect(finalText.toLowerCase()).toContain('dropped');
  });

  test('handle drag and drop with fallback strategies', async () => {
    // This test verifies that the drag and drop works even if primary method fails
    await dragDropPage.performDragAndDrop();
    
    // Verify success using multiple verification methods
    const isSuccessful = await dragDropPage.isDropSuccessful();
    const dropText = await dragDropPage.getDropText();
    const textVerification = await dragDropPage.verifyDropText('Dropped');
    
    expect(isSuccessful).toBe(true);
    expect(textVerification).toBe(true);
    expect(dropText.toLowerCase()).toMatch(/dropped/i);
  });

  test('verify all drop target elements for debugging', async () => {
    // Get all possible drop texts for comprehensive testing
    const allTexts = await dragDropPage.getAllDropTexts();
    expect(allTexts.length).toBeGreaterThan(0);
    
    // Perform drag and drop
    await dragDropPage.performDragAndDrop();
    await dragDropPage.waitForDropText('Dropped');
    
    // Verify at least one element shows success
    const finalTexts = await dragDropPage.getAllDropTexts();
    const hasDroppedText = finalTexts.some(text => text.toLowerCase().includes('dropped'));
    expect(hasDroppedText).toBe(true);
  });

  test('error handling and debugging capabilities', async () => {
    try {
      // Perform drag and drop
      await dragDropPage.performDragAndDrop();
      await dragDropPage.waitForDropText('Dropped');
      
      const isSuccessful = await dragDropPage.isDropSuccessful();
      expect(isSuccessful).toBe(true);
      
    } catch (error) {
      // If primary assertion fails, take screenshot and get debug info
      await dragDropPage.takeDebugScreenshot('debug-dragdrop-error.png');
      
      const finalText = await dragDropPage.getDropText();
      const allTexts = await dragDropPage.getAllDropTexts();
      
      console.log('Final drop target text:', finalText);
      console.log('All drop texts:', allTexts);
      
      // Re-throw the error with additional context
      throw new Error(`Drag and drop failed. Final text: "${finalText}". All texts: [${allTexts.join(', ')}]. Original error: ${error}`);
    }
  });
});