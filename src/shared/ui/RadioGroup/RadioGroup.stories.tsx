import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useId, useState } from 'react'
import { fn, userEvent, within } from 'storybook/test'
import { RadioGroup } from './RadioGroup'

const meta: Meta<typeof RadioGroup> = {
  title: 'shared/ui/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: {
    name: 'mode',
    'aria-label': 'Режим обмена',
    value: 'all',
    onChange: fn(),
    options: [
      { value: 'all', label: 'Всё' },
      { value: 'learn', label: 'Хочу научиться' },
      { value: 'teach', label: 'Могу научить' },
    ],
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2861',
    },
    docs: {
      description: {
        component: 'Один выбранный вариант. Tab входит в группу, стрелки меняют выбор по кругу.',
      },
    },
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value)
    useEffect(() => setValue(args.value), [args.value])
    const instanceId = useId()
    return (
      <RadioGroup
        {...args}
        name={`${args.name}-${instanceId}`}
        value={value}
        onChange={(value) => {
          args.onChange(value)
          setValue(value)
        }}
      />
    )
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Learn: Story = { args: { value: 'learn' } }
export const Teach: Story = { args: { value: 'teach' } }
export const Gender: Story = {
  args: {
    name: 'gender',
    label: 'Пол автора',
    'aria-label': undefined,
    value: 'any',
    options: [
      { value: 'any', label: 'Не имеет значения' },
      { value: 'male', label: 'Мужской' },
      { value: 'female', label: 'Женский' },
    ],
  },
}
export const Disabled: Story = { args: { disabled: true } }
export const DisabledOption: Story = {
  args: {
    options: [
      { value: 'all', label: 'Всё' },
      { value: 'learn', label: 'Хочу научиться', disabled: true },
      { value: 'teach', label: 'Могу научить' },
    ],
  },
}
export const Error: Story = { args: { value: '', error: 'Выберите вариант' } }

/** Наведите курсор на любой пункт. */
export const Hover: Story = {
  parameters: {
    docs: {
      description: { story: 'Наведите курсор на радиокнопку или подпись, чтобы увидеть hover.' },
    },
  },
}

export const Focus: Story = {
  play: async ({ canvasElement }) => {
    within(canvasElement).getByRole('radio', { name: 'Всё' }).focus()
    await userEvent.keyboard('{ArrowRight}')
  },
}
