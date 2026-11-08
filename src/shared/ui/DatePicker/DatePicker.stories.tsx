import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Controller, useForm } from 'react-hook-form'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '@/shared/ui/Button'
import { DatePicker } from './DatePicker'

const meta = {
  title: 'shared/ui/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: {
    label: 'Дата рождения',
    placeholder: 'дд.мм.гггг',
    value: null,
    min: '1925-01-01',
    max: '2012-12-31',
    onChange: fn(),
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-1541',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'calc(var(--space-100) * 2 + var(--space-8))' }}>
        <Story />
      </div>
    ),
  ],
  render: function Render(args) {
    const [value, setValue] = useState(args.value)
    useEffect(() => setValue(args.value), [args.value])
    return (
      <DatePicker
        {...args}
        value={value}
        onChange={(date) => {
          setValue(date)
          args.onChange(date)
        }}
      />
    )
  },
} satisfies Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Filled: Story = { args: { value: '2000-04-27' } }
export const Disabled: Story = { args: { value: '2000-04-27', disabled: true } }
export const Error: Story = { args: { error: 'Укажите дату рождения' } }

/** Наведите курсор на поле или на день открытого календаря. */
export const Hover: Story = {}

export const Focus: Story = {
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByRole('textbox', { name: 'Дата рождения' })
    field.focus()
    await expect(field).toHaveFocus()
  },
}

export const OpenCalendar: Story = {
  parameters: { layout: 'padded' },
  args: { value: '2000-04-27' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Открыть календарь' }))
    await expect(canvas.getByRole('dialog', { name: 'Выбор даты' })).toBeVisible()
  },
}

export const WithForm: Story = {
  render: function Form(args) {
    const { control, handleSubmit } = useForm<{ birthDate: string | null }>({
      defaultValues: { birthDate: args.value },
    })
    const [saved, setSaved] = useState<string | null>(null)
    return (
      <form onSubmit={handleSubmit(({ birthDate }) => setSaved(birthDate))}>
        <Controller
          name="birthDate"
          control={control}
          rules={{ required: 'Укажите дату рождения' }}
          render={({ field, fieldState }) => (
            <DatePicker {...args} {...field} error={fieldState.error?.message} />
          )}
        />
        <div style={{ marginTop: 'var(--space-16)' }}>
          <Button type="submit">Сохранить</Button>
        </div>
        <output aria-live="polite">{saved}</output>
      </form>
    )
  },
}
