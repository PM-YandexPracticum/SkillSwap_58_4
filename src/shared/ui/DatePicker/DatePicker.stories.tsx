import { DatePicker } from './DatePicker'

/**
 * Stories компонента DatePicker — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof DatePicker>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: пустое поле «дд.мм.гггг», заполненное, открытый календарь с выбором месяца и года («Регистрация 2 шаг»), ошибка.
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Default = {
  args: { label: 'Дата рождения', value: null, placeholder: 'дд.мм.гггг' },
}

// TODO: по одной story на каждое состояние из списка выше
