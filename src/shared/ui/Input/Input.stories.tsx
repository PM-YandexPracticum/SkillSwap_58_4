import { Input } from './Input'

/**
 * Stories компонента Input — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof Input>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: пустое, заполненное, с иконкой-карандашом, ошибка, disabled.
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/Input',
  component: Input,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Default = {
  args: { label: 'Имя', placeholder: 'Введите ваше имя' },
}

// TODO: по одной story на каждое состояние из списка выше
