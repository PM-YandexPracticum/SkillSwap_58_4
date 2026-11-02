import type { Meta, StoryObj } from '@storybook/react-vite'

import { Stepper } from './Stepper'

/**
 * Индикатор шагов регистрации — заголовок «Шаг N из 3» и три полоски прогресса.
 *
 * Компонент только отображает состояние, переходы между шагами делают страницы регистрации.
 *
 * Состояния по макету:
 * - шаг 1 из 3 — подпись и первая полоска акцентным цветом (1:2548, 1:2627);
 * - шаг 2 из 3 — акцентны первые две полоски (1:1497, 1:1541, 1:1585, 1:1629, 1:1673, 1:1717);
 * - шаг 3 из 3 — акцентны все три полоски (1:1761).
 *
 * Оформление: заголовок Jost Medium 24 px, line-height 28 px, letter-spacing −1,1 %,
 * полоска 60×4 px, радиус 8 px, зазор между полосками 16 px,
 * отступ от заголовка до полосок 12 px.
 */
const meta: Meta<typeof Stepper> = {
  title: 'shared/ui/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Компонент «Шаг N из 3» с тремя полосками прогресса. Один проп current управляет и текстом, и заполнением полосок.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

/** Шаг 1 из 3 — ввод данных для входа. Подпись и первая полоска акцентным цветом. Фреймы 1:2548, 1:2627. */
export const Default: Story = {
  args: { current: 1, total: 3 },
}

/** Шаг 2 из 3 — профиль и навыки. Акцентны первые две полоски. Фреймы 1:1497, 1:1541, 1:1585, 1:1629, 1:1673, 1:1717. */
export const StepTwo: Story = {
  args: { current: 2, total: 3 },
}

/** Шаг 3 из 3 — подтверждение. Акцентны все три полоски. Фрейм 1:1761. */
export const StepThree: Story = {
  args: { current: 3, total: 3 },
}
