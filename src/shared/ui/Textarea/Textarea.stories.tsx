import { Textarea } from './Textarea'

/**
 * Stories компонента Textarea — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof Textarea>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: пустое, заполненное, ошибка (больше 500 символов).
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/Textarea',
  component: Textarea,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Default = {
  args: { label: 'О себе' },
}

// TODO: по одной story на каждое состояние из списка выше
