/**
 * Конфигурация Storybook — КАРКАС. Пакеты ещё не установлены (задача P1-11 в docs/tasks/phases/phase-01-preparation.md).
 * После установки добавить тип: `import type { StorybookConfig } from '@storybook/react-vite'`
 * и написать `const config: StorybookConfig = { ... }`.
 *
 * Где лежат stories: рядом с компонентом, `Component.stories.tsx`.
 * Правила — docs/rules/storybook.md.
 */
const config = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}

export default config
