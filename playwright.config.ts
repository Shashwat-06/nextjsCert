import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  // 3 minutes per test to allow Next.js dev server to compile pages in CI
  timeout: 180 * 1000,

  expect: {
    timeout: 30 * 1000,
  },

  // MUST be false and 1 worker to prevent database race conditions during testing
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,

  reporter: "html",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",

    // Give Next.js plenty of time to compile a page on its first load
    navigationTimeout: 120 * 1000,
    actionTimeout: 60 * 1000,
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

    // Give the Next.js server 5 full minutes to boot up and compile the homepage
    timeout: 300 * 1000,
    env: {
      // Prevents Next.js from hanging in the background asking for telemetry permission
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
});
