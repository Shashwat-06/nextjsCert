import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  // INCREASE GLOBAL TIMEOUT: Gives Next.js time to compile pages in dev mode on slow CI runners
  timeout: 120 * 1000,

  expect: {
    timeout: 15 * 1000,
  },

  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  // Must remain 1 to prevent race conditions during database resets
  workers: 1,

  reporter: "html",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    // Increase timeout for individual actions like clicks and navigation
    actionTimeout: 30 * 1000,
    navigationTimeout: 60 * 1000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    // Give the Next.js server 3 full minutes to boot up initially
    timeout: 180 * 1000,
  },
});
