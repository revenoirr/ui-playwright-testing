import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class DragDropPage extends BasePage {
  private draggable = '#draggable';
  private droppable = '#droppable';

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await super.navigate('/droppable');
  }

  async performDragAndDrop(): Promise<void> {
    await this.page.dragAndDrop(this.draggable, this.droppable);
  }

  async getDropText(): Promise<string> {
  return (await this.page.textContent(this.droppable)) ?? '';
}

  }

