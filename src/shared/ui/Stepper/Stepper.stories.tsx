import { Stepper } from './Stepper'

/**
 * Stories компонента Stepper — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof Stepper>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: шаг 1, 2, 3 из 3.
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/Stepper',
  component: Stepper,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Default = {
  args: { current: 1, total: 3 },
}

// TODO: по одной story на каждое состояние из списка выше
