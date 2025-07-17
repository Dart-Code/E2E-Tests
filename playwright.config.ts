import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0, // process.env.CI ? 2 : 0,
  workers: 1, // process.env.CI ? 1 : undefined,
  timeout: 60 * 1000,
  // TODO(dantup): Test this.
  // reporter: process.env.CI ? 'github' : 'list',
  reporter: [['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    screenshot: 'on',
  },
});
