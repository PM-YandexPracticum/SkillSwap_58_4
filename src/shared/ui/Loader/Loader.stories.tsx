import { Loader } from './Loader'

/**
 * Stories компонента Loader — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof Loader>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: по центру страницы, внутри кнопки.
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/Loader',
  component: Loader,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Default = {
  args: {},
}

// TODO: по одной story на каждое состояние из списка выше
