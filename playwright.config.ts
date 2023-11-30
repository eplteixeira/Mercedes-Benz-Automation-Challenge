import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",

  // Maximum time one test can run for - 5 min
  timeout: 60000,

  // Maximum time expect() should wait for the condition to be met - 15 sec
  expect: {
    timeout: 15000
  },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retries
  retries: process.env.CI ? 2 : 1,

  // Workers for each job shard.
  workers: process.env.CI ? 2 : undefined,

  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: [['html'], ['junit', { outputFile: 'results.xml' }]],

  // Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions.
  use: {
    // Collect trace. See https://playwright.dev/docs/trace-viewer
    trace: 'on-first-retry',

    testIdAttribute: 'data-test-id'
  },
 

  // Configure projects for major browsers.
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari']
      }
    }
  ]
});