import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'src/tests',
  timeout: 120000, // Increased to 2 minutes
  expect: { timeout: 20000 }, // Increased expect timeout
  retries: 2, // Increased retries
  workers: 1, // Run tests sequentially to avoid conflicts
  
  use: {
    headless: false, // Keep visible for debugging
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
    
    // Handle slow network
    launchOptions: {
      slowMo: 100, // Add small delay between actions
    }
  },
  
  // Global setup to handle flaky website
  globalSetup: require.resolve('./global-setup.ts'),
  
  // Configure different projects if needed
  projects: [
    {
      name: 'chromium',
      use: { 
        ...require('@playwright/test').devices['Desktop Chrome'],
        // Add specific Chrome flags for better stability
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-dev-shm-usage',
            '--no-sandbox'
          ]
        }
      },
    },
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