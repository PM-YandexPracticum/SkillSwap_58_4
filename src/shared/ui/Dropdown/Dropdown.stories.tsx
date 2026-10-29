import { Dropdown } from './Dropdown'

/**
 * Stories компонента Dropdown — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof Dropdown>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: закрыт, открыт (меню «Все навыки», уведомления).
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Default = {
  args: { isOpen: true },
}

// TODO: по одной story на каждое состояние из списка выше
