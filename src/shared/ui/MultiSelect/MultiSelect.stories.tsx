import { MultiSelect } from './MultiSelect'

/**
 * Stories компонента MultiSelect — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof MultiSelect>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: закрыт пустой, открыт с чекбоксами (1:1673, 1:1717), выбрано несколько («+N»), ошибка.
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Default = {
  args: {
    label: 'Категория навыка, которому хотите научиться',
    placeholder: 'Выберите категорию',
    options: [{ value: 'business', label: 'Бизнес и карьера' }],
    value: [],
  },
}

// TODO: по одной story на каждое состояние из списка выше
