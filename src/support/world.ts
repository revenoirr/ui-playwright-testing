import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { BrowserContext, Page } from 'playwright';
import { AlertsPage } from '../page-objects/AlertsPage';
import * as fs from 'fs';
import * as path from 'path';

export class CustomWorld extends World {
  context!: BrowserContext;
  page!: Page;
  alertsPage!: AlertsPage;
  lastDialog: any;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init(context: BrowserContext, page: Page) {
    this.context = context;
    this.page = page;

    // Initialize page object
    this.alertsPage = new AlertsPage(this.page);
  }

  async close() {
    try {
      if (this.page && !this.page.isClosed()) {
        await this.page.close();
      }

      if (this.context) {
        await this.context.close();
      }
    } catch (error) {
      // Silent close errors
    }
  }

  async takeScreenshot(name: string) {
    try {
      if (!this.page || this.page.isClosed()) {
        console.log('⚠️ Cannot take screenshot: page is closed');
        return;
      }

      const screenshotsDir = path.join(process.cwd(), 'screenshots');
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${name}_${timestamp}.png`;
      const filepath = path.join(screenshotsDir, filename);

      await this.page.screenshot({
        path: filepath,
        fullPage: true,
        timeout: 5000
      });

      console.log(`✅ Screenshot saved: ${filepath}`);
    } catch (error) {
      console.error('❌ Failed to take screenshot:', error);
    }
  }
}

setWorldConstructor(CustomWorld);
