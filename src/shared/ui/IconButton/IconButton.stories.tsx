import { IconButton } from './IconButton'

/**
 * Stories компонента IconButton — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof IconButton>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: сердце (пустое / закрашенное), колокольчик, «поделиться», «Закрыть».
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/IconButton',
  component: IconButton,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Default = {
  args: { ariaLabel: 'Добавить в избранное' },
}

// TODO: по одной story на каждое состояние из списка выше
