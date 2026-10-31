import { defineConfig, devices } from '@playwright/test'

/**
 * Автотесты главных сценариев (Playwright). Сами сценарии пишет задача P8-05 в папке `e2e/`.
 * Перед первым запуском один раз поставить браузер: `npx playwright install chromium`.
 * Тесты сами поднимают dev-сервер и ходят по сайту как пользователь.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
})
