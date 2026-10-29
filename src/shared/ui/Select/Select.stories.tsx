import { Select } from './Select'

/**
 * Stories компонента Select — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof Select>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: «Не указан», выбрано значение, открыт, ошибка, disabled.
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/Select',
  component: Select,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Default = {
  args: { label: 'Город', options: [{ value: 'Москва', label: 'Москва' }] },
}

// TODO: по одной story на каждое состояние из списка выше
