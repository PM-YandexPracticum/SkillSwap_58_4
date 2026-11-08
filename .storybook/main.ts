/**
 * Конфигурация Storybook с React/Vite и аддонами a11y, docs и designs (P1-11).
 * Stories лежат рядом с компонентами: Component.stories.tsx.
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
