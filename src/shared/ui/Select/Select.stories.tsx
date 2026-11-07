import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { fn } from 'storybook/test'

import { Select } from './Select'

/**
 * Stories компонента Select. Интерактивное состояние синхронизируется с Controls.
 */
const meta: Meta<typeof Select> = {
  title: 'shared/ui/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Один выбор и поиск. Макет: [Пол](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-1585), [Город](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-1629). Ширину поля задаёт родитель.',
      },
    },
  },
  decorators: [
    (Story, { args }) => (
      <div style={{ width: args.searchable ? 436 : 208, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onChange: fn(),
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value)

    // Синхронизируем состояние с изменениями value во вкладке Controls.
    useEffect(() => setValue(args.value), [args.value])

    const handleChange = (nextValue: string | null) => {
      args.onChange(nextValue)
      setValue(nextValue)
    }

    return <Select {...args} value={value} onChange={handleChange} />
  },
}

export default meta

type Story = StoryObj<typeof meta>

/** Базовое состояние */
export const Default: Story = {
  args: {
    label: 'Пол',
    options: [
      { value: null, label: 'Не указан' },
      { value: 'male', label: 'Мужской' },
      { value: 'female', label: 'Женский' },
    ],
    value: null,
  },
}

/** Выбрано значение */
export const Selected: Story = {
  args: {
    ...Default.args,
    value: 'male',
  },
}

/** Открытый список */
export const Open: Story = {
  args: {
    ...Default.args,
    defaultOpen: true,
  },
}

export const Error: Story = {
  args: {
    ...Default.args,
    value: 'male',
    error: 'Выберите значение',
  },
}

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
}

/** Поиск по списку городов */
export const Searchable: Story = {
  args: {
    label: 'Город',
    placeholder: 'Не указан',
    options: [
      { value: 'spb', label: 'Санкт-Петербург' },
      { value: 'samara', label: 'Самара' },
      { value: 'saratov', label: 'Саратов' },
      { value: 'moscow', label: 'Москва' },
    ],
    value: null,
    searchable: true,
  },
}

/** Ошибка на раскрытом поле: красная рамка охватывает весь список. */
export const OpenError: Story = {
  args: { ...Error.args, defaultOpen: true },
}

export const SearchableError: Story = {
  args: { ...Searchable.args, error: 'Выберите город', defaultOpen: true },
}

export const SearchableDisabled: Story = {
  args: { ...Searchable.args, value: 'samara', disabled: true },
}

/** Проверка прокрутки активного пункта при навигации стрелками. */
export const LongList: Story = {
  args: {
    ...Searchable.args,
    options: Array.from({ length: 30 }, (_, index) => ({
      value: `city-${index + 1}`,
      label: `Город ${index + 1}`,
    })),
  },
}

export const Hover: Story = {
  args: { ...Default.args },
  parameters: {
    docs: { description: { story: 'Наведите курсор на поле: рамка становится акцентной.' } },
  },
}

export const Focus: Story = {
  args: { ...Default.args },
  play: ({ canvasElement }) =>
    canvasElement.querySelector<HTMLButtonElement>('[role="combobox"]')?.focus(),
}
