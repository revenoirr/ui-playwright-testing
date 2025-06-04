import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'src/tests',
  timeout: 120000, // Increased to 2 minutes
  expect: { timeout: 20000 }, // Increased expect timeout
  retries: process.env.CI ? 2 : 0, // Only retry in CI
  workers: process.env.CI ? 1 : undefined, // Sequential in CI, parallel locally
  
  use: {
    // FIXED: Run headless in CI, headed locally for debugging
    headless: process.env.CI ? true : false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    baseURL: 'https://demoqa.com',
    
    // Increased timeouts
    navigationTimeout: 45000, // 45 seconds for navigation
    actionTimeout: 20000, // 20 seconds for actions
    
    // Additional browser context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Handle slow network - remove slowMo in CI
    launchOptions: {
      slowMo: process.env.CI ? 0 : 100, 
    }
  },
  
  projects: [
  {
    name: 'chromium',
    use: { 
      ...require('@playwright/test').devices['Desktop Chrome'],
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
          '--no-sandbox'
        ]
      }
    },
  },
  {
    name: 'firefox',
    use: {
      ...require('@playwright/test').devices['Desktop Firefox']
    },
  },
  {
    name: 'webkit',
    use: {
      ...require('@playwright/test').devices['Desktop Safari']
    },
  }
],
  
  // Reporting
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list']
  ],
  
  // Output directory
  outputDir: 'test-results/',
});