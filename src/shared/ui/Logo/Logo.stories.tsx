import { Logo } from './Logo'

/**
 * Stories компонента Logo — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof Logo>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: с текстом, только иконка.
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/Logo',
  component: Logo,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Default = {
  args: { withText: true },
}

// TODO: по одной story на каждое состояние из списка выше
