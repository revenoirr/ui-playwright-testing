// hooks.ts
import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { chromium, firefox, Browser, BrowserContext, Page } from 'playwright';
import { CustomWorld } from './world';

let browser: Browser;

BeforeAll(async () => {
  // Открываем браузер один раз перед всеми тестами
  browser = await chromium.launch({ headless: false });
});

AfterAll(async () => {
  // Закрываем браузер после всех тестов
  await browser.close();
});

Before(async function (this: CustomWorld) {
  // Перед каждым сценарием создаём новый контекст и страницу
  const context = await browser.newContext();
  const page = await context.newPage();

  await this.init(context, page);
});

After(async function (this: CustomWorld, scenario) {
  // При падении делаем скриншот
  if (scenario.result?.status === Status.FAILED && this.page && !this.page.isClosed()) {
    try {
      const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '-');
      await this.takeScreenshot(`failure-${scenarioName}`);
    } catch {
      // Игнорируем ошибки
    }
  }

  // Закрываем контекст (а с ним и вкладку) после каждого сценария
  if (this.context) {
    await this.context.close();
  }
});
