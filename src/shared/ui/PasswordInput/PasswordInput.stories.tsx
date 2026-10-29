import { PasswordInput } from './PasswordInput'

/**
 * Stories компонента PasswordInput — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof PasswordInput>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: скрыт, показан («глаз»), ошибка.
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Default = {
  args: { label: 'Пароль', hint: 'Пароль должен содержать не менее 8 знаков' },
}

// TODO: по одной story на каждое состояние из списка выше
