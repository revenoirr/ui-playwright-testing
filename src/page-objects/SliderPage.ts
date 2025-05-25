import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class SliderPage extends BasePage {
  private slider = 'input[type="range"]';
  private valueOutput = '#sliderValue';

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await super.navigate('/slider');
  }

  async setSliderValue(value: number): Promise<void> {
    await this.page.fill(this.slider, value.toString());
  }

  async getSliderValue(): Promise<number> {
    const val = await this.page.inputValue(this.valueOutput);
    return parseInt(val, 10);
  }
}
