/**
 * Общие настройки stories: глобальные стили, центрирование холста и controls (P1-11).
 *
 * - глобальные стили и CSS-переменные проекта подключаются здесь один раз;
 * - компоненты по умолчанию центрируются; размеры конкретного состояния задаёт story;
 * - ThemeToggle подключается через общий источник темы и доступен в историях шапки.
 */

import type { Preview } from '@storybook/react-vite'

import '../src/app/styles/global.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      expanded: true,
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;
