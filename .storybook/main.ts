/**
 * Конфигурация Storybook — КАРКАС. Пакеты ещё не установлены (задача P1-11 в docs/tasks/phases/phase-01-preparation.md).
 * После установки добавить тип: `import type { StorybookConfig } from '@storybook/react-vite'`
 * и написать `const config: StorybookConfig = { ... }`.
 *
 * Где лежат stories: рядом с компонентом, `Component.stories.tsx`.
 * Правила — docs/rules/storybook.md.
 */

import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-designs"
  ],
  "framework": "@storybook/react-vite"
};
export default config;
