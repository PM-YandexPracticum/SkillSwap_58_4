import { defineConfig, devices } from '@playwright/test'

/**
 * Автотесты главных сценариев P8-05; готовые сценарии и оставшиеся зависимости описаны в e2e/README.md.
 * Перед первым запуском один раз поставить браузер: `npx playwright install chromium`.
 * Тесты сами поднимают dev-сервер и ходят по сайту как пользователь.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
  },
})
