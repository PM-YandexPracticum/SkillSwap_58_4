import { Checkbox } from './Checkbox'

/**
 * Stories компонента Checkbox — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof Checkbox>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: не выбран, выбран, частично выбран (indeterminate), disabled.
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Default = {
  args: { label: 'Москва', checked: false },
}

// TODO: по одной story на каждое состояние из списка выше
