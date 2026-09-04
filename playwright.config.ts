import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  // Lower global timeout so broken tests fail fast instead of hanging
  timeout: 30 * 1000,

  expect: {
    timeout: 10 * 1000,
  },

  // MUST remain false and 1 worker to prevent database race conditions
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,

  reporter: "html",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    actionTimeout: 15 * 1000,
    navigationTimeout: 15 * 1000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    // Use Turbopack for near-instant page compilation in CI
    command: "npx next dev --turbo",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
});
