import { Tag } from './Tag'

/**
 * Stories компонента Tag — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof Tag>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: цвет каждой категории, чип «+2», плашка с крестиком (выбранный фильтр, «Хочу научиться»).
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/Tag',
  component: Tag,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Default = {
  args: { label: 'Игра на барабанах' },
}

/** Плашка с крестиком */
export const Removable = {
  args: { label: 'Москва', onRemove: () => {} },
}

// TODO: по одной story на каждое состояние из списка выше
