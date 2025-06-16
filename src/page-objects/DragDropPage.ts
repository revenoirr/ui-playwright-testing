import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DragDropPage extends BasePage {
  // FIXED: Updated locators to handle multiple elements properly
  private readonly draggableElement: Locator;
  private readonly droppableElement: Locator;
  private readonly simpleTab: Locator;
  private readonly simpleDraggable: Locator;
  private readonly simpleDropTarget: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize all locators - use more specific selectors to avoid strict mode violations
    this.draggableElement = this.page.locator('#draggable').first();
    this.droppableElement = this.page.locator('#droppable').first();
    this.simpleTab = this.page.locator('text=Simple');
    
    // More specific locators for Simple tab content
    this.simpleDraggable = this.page.locator('[role="tabpanel"][aria-labelledby="droppableExample-tab-simple"] #draggable');
    this.simpleDropTarget = this.page.locator('[role="tabpanel"][aria-labelledby="droppableExample-tab-simple"] #droppable');
  }

  /**
   * Navigate to drag and drop page and wait for content to load
   */
  async navigate(): Promise<void> {
    await this.page.goto('https://demoqa.com/droppable');
    
    // Wait for page to load completely
    await this.page.waitForLoadState('domcontentloaded');
    
    // FIXED: Wait for the first visible element instead of trying to wait for all
    await this.draggableElement.waitFor({ state: 'visible' });
    
    // Don't wait for droppable here since we need to select the correct tab first
    // Just ensure the page structure is loaded
    await this.page.waitForSelector('[role="tablist"]', { state: 'visible' });
  }

  /**
   * Click on Simple tab if available
   */
  async selectSimpleTab(): Promise<void> {
    try {
      await this.simpleTab.waitFor({ state: 'visible', timeout: 5000 });
      await this.simpleTab.click();
      
      // Wait for the Simple tab content to be visible and active
      await this.page.waitForFunction(
        () => {
          const activeTab = document.querySelector('[role="tabpanel"][aria-labelledby="droppableExample-tab-simple"]') as HTMLElement;
          return activeTab && !activeTab.classList.contains('d-none') && activeTab.offsetHeight > 0;
        },
        { timeout: 10000 }
      );
      
      // FIXED: Wait for the specific tab's drag and drop elements to be visible
      await this.simpleDraggable.waitFor({ state: 'visible', timeout: 5000 });
      await this.simpleDropTarget.waitFor({ state: 'visible', timeout: 5000 });
      
    } catch (error) {
      console.log('Simple tab not found or already selected, using default elements...');
    }
  }

  /**
   * Get draggable and droppable elements with fallback strategy
   */
  private async getDragDropElements(): Promise<{ draggable: Locator; dropTarget: Locator }> {
    try {
      // First try to use Simple tab specific elements
      const simpleTabPanel = this.page.locator('[role="tabpanel"][aria-labelledby="droppableExample-tab-simple"]');
      const isSimpleTabActive = await simpleTabPanel.isVisible();
      
      if (isSimpleTabActive) {
        await this.simpleDraggable.waitFor({ state: 'visible', timeout: 5000 });
        await this.simpleDropTarget.waitFor({ state: 'visible', timeout: 5000 });
        return { draggable: this.simpleDraggable, dropTarget: this.simpleDropTarget };
      }
    } catch (error) {
      console.log('Simple tab elements not found, using fallback...');
    }
    
    // Fallback: find the currently active/visible tab's elements
    const activeTabPanel = this.page.locator('[role="tabpanel"]:not(.d-none)').first();
    const activeDraggable = activeTabPanel.locator('#draggable');
    const activeDroppable = activeTabPanel.locator('#droppable');
    
    await activeDraggable.waitFor({ state: 'visible', timeout: 5000 });
    await activeDroppable.waitFor({ state: 'visible', timeout: 5000 });
    
    return { draggable: activeDraggable, dropTarget: activeDroppable };
  }

  /**
   * Get initial text of the drop target
   */
  async getInitialDropText(): Promise<string> {
    const { dropTarget } = await this.getDragDropElements();
    await dropTarget.waitFor({ state: 'visible' });
    return await dropTarget.textContent() || '';
  }

  /**
   * Perform drag and drop operation with multiple fallback strategies
   */
  async performDragAndDrop(): Promise<void> {
    const { draggable, dropTarget } = await this.getDragDropElements();

    // Ensure elements are visible and scroll into view
    await draggable.scrollIntoViewIfNeeded();
    await dropTarget.scrollIntoViewIfNeeded();

    // Try standard drag and drop first, then fallback to manual approach
    try {
      await draggable.dragTo(dropTarget);
    } catch (dragError) {
      console.log('Standard drag failed, trying manual drag...');
      await this.performManualDragAndDrop(draggable, dropTarget);
    }

    // Wait for drop operation to complete
    await this.waitForDropComplete();
  }

  /**
   * Manual drag and drop using mouse actions
   */
  private async performManualDragAndDrop(draggable: Locator, dropTarget: Locator): Promise<void> {
    const draggableBox = await draggable.boundingBox();
    const dropTargetBox = await dropTarget.boundingBox();

    if (draggableBox && dropTargetBox) {
      const dragX = draggableBox.x + draggableBox.width / 2;
      const dragY = draggableBox.y + draggableBox.height / 2;
      const dropX = dropTargetBox.x + dropTargetBox.width / 2;
      const dropY = dropTargetBox.y + dropTargetBox.height / 2;

      await this.page.mouse.move(dragX, dragY);
      await this.page.mouse.down();
      await this.page.mouse.move(dropX, dropY, { steps: 10 });
      await this.page.mouse.up();
    }
  }

  /**
   * Wait for drop operation to complete using waitForFunction
   */
  private async waitForDropComplete(): Promise<void> {
    // Wait for any visible drop target to show "Dropped" text
    await this.page.waitForFunction(
      () => {
        const activeTabPanel = document.querySelector('[role="tabpanel"]:not(.d-none)');
        if (activeTabPanel) {
          const dropElement = activeTabPanel.querySelector('#droppable');
          return dropElement && dropElement.textContent && 
                 (dropElement.textContent.includes('Dropped') || dropElement.textContent.includes('dropped'));
        }
        return false;
      },
      { timeout: 10000 }
    );
  }

  /**
   * Get current text of the drop target
   */
  async getDropText(): Promise<string> {
    const { dropTarget } = await this.getDragDropElements();
    await dropTarget.waitFor({ state: 'visible' });
    return await dropTarget.textContent() || '';
  }

  /**
   * Check if drop operation was successful
   */
  async isDropSuccessful(): Promise<boolean> {
    try {
      const dropText = await this.getDropText();
      return dropText.toLowerCase().includes('dropped');
    } catch {
      return false;
    }
  }

  /**
   * Wait for specific text to appear in drop target
   */
  async waitForDropText(expectedText: string): Promise<void> {
    await this.page.waitForFunction(
      (text) => {
        const activeTabPanel = document.querySelector('[role="tabpanel"]:not(.d-none)');
        if (activeTabPanel) {
          const dropElement = activeTabPanel.querySelector('#droppable');
          return dropElement && dropElement.textContent && 
                 dropElement.textContent.toLowerCase().includes(text.toLowerCase());
        }
        return false;
      },
      expectedText,
      { timeout: 10000 }
    );
  }

  /**
   * Verify drop text contains expected value
   */
  async verifyDropText(expectedText: string): Promise<boolean> {
    const actualText = await this.getDropText();
    return actualText.toLowerCase().includes(expectedText.toLowerCase());
  }

  /**
   * Get all possible drop text variations for debugging
   */
  async getAllDropTexts(): Promise<string[]> {
    // Get texts from all visible drop targets
    const dropElements = await this.page.locator('[role="tabpanel"]:not(.d-none) #droppable').all();
    const texts: string[] = [];
    
    for (const element of dropElements) {
      try {
        const text = await element.textContent();
        if (text) {
          texts.push(text.trim());
        }
      } catch {
        // Continue if element is not accessible
      }
    }
    
    return texts;
  }

  /**
   * Take screenshot for debugging purposes
   */
  async takeDebugScreenshot(filename: string = 'debug-dragdrop.png'): Promise<void> {
    await this.page.screenshot({ path: filename, fullPage: true });
  }
}