import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'src/tests',
  timeout: 120000,
  expect: { timeout: 20000 },
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  use: {
    headless: process.env.CI ? false : true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    baseURL: 'https://demoqa.com',
    
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    
  },
  
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }, 
        launchOptions: {
          args: process.env.CI ? [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-extensions',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ] : [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--start-maximized' 
          ]
        }
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
    }
  ],
  
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list']
  ],
  

  outputDir: 'test-results/',
});