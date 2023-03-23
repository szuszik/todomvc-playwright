import { defineConfig, PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    baseURL: 'https://demo.playwright.dev/',
    headless: true,
    viewport: {
      width: 1333,
      height: 768,
    },
    trace: 'on',
  },
  testDir: './e2e',
  reporter: 'html',
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 10 * 1000,
  forbidOnly: !!process.env.CI,
  expect: {
    timeout: 2000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
      },
    },
    {
      name: 'webkit',
      use: {
        browserName: 'webkit',
      },
    },
  ],
};
export default defineConfig(config);
