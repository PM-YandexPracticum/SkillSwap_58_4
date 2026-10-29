/**
 * Общие настройки всех stories — КАРКАС (пакеты ставит задача P1-11).
 * После установки: `import type { Preview } from '@storybook/react'` и `const preview: Preview = { ... }`.
 *
 * - глобальные стили и CSS-переменные проекта подключаются здесь один раз;
 * - фон и размер холста — как в макете (десктоп);
 * - переключатель темы появится только с необязательной задачей P9-03.
 */
import '../src/app/styles/global.css'

const preview = {
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
  },
}

export default preview
