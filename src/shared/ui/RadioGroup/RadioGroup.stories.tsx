import { RadioGroup } from './RadioGroup'

/**
 * Stories компонента RadioGroup — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof RadioGroup>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: «Всё / Хочу научиться / Могу научить», «Пол автора».
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Default = {
  args: {
    name: 'mode',
    value: 'all',
    options: [
      { value: 'all', label: 'Всё' },
      { value: 'learn', label: 'Хочу научиться' },
      { value: 'teach', label: 'Могу научить' },
    ],
  },
}

// TODO: по одной story на каждое состояние из списка выше
