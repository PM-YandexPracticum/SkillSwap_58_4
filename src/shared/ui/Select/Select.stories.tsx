import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { fn } from 'storybook/test'

import { Select } from './Select'

/**
 * Stories компонента Select. Интерактивное состояние синхронизируется с Controls.
 *
 * Нужны stories для состояний из макета: «Не указан», выбрано значение, открыт, ошибка, disabled.
 * Правила — docs/rules/storybook.md.
 */
const meta: Meta<typeof Select> = {
  title: 'shared/ui/Select',
  component: Select,
  tags: ['autodocs'],
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
