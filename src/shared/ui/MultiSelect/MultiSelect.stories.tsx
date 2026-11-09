import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { fn, within } from 'storybook/test'

import { MultiSelect } from './MultiSelect'

const designUrl = 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id='

const meta: Meta<typeof MultiSelect> = {
  title: 'shared/ui/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  parameters: { design: { type: 'figma', url: `${designUrl}1-1673` } },
  decorators: [
    (Story, { args }) => (
      <div style={{ width: 436, maxWidth: '100%', minHeight: args.defaultOpen ? 376 : undefined }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Категория навыка, которому хотите научиться',
    placeholder: 'Выберите категорию',
    options: [
      { value: 'business', label: 'Бизнес и карьера' },
      { value: 'creativity', label: 'Творчество и искусство' },
      { value: 'languages', label: 'Иностранные языки' },
      { value: 'education', label: 'Образование и развитие' },
      { value: 'health', label: 'Здоровье и лайфстайл' },
      { value: 'home', label: 'Дом и уют' },
    ],
    value: [],
    onChange: fn(),
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value)

    useEffect(() => setValue(args.value), [args.value])

    return (
      <MultiSelect
        {...args}
        value={value}
        onChange={(next) => {
          args.onChange(next)
          setValue(next)
        }}
      />
    )
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const OpenCategories: Story = { args: { defaultOpen: true } }

export const OpenSubcategories: Story = {
  parameters: { design: { type: 'figma', url: `${designUrl}1-1717` } },
  args: {
    label: 'Подкатегория навыка, которому хотите научиться',
    placeholder: 'Выберите подкатегорию',
    defaultOpen: true,
    options: [
      { value: 'drawing', label: 'Рисование и иллюстрация' },
      { value: 'photo', label: 'Фотография' },
      { value: 'video-editing', label: 'Видеомонтаж' },
      { value: 'music', label: 'Музыка и звук' },
      { value: 'acting', label: 'Актёрское мастерство' },
      { value: 'creative-writing', label: 'Креативное письмо' },
      { value: 'art-therapy', label: 'Арт-терапия' },
      { value: 'diy', label: 'Декор и DIY' },
    ],
  },
}

export const Selected: Story = { args: { value: ['business', 'creativity', 'languages'] } }

export const Error: Story = { args: { error: 'Выберите хотя бы одну категорию' } }

export const Disabled: Story = { args: { disabled: true } }

export const EmptyOptions: Story = { args: { options: [] } }

export const Hover: Story = {
  parameters: {
    docs: { description: { story: 'Наведите курсор на поле, чтобы увидеть CSS-состояние hover.' } },
  },
}

export const Focus: Story = {
  play: ({ canvasElement }) => {
    within(canvasElement).getByRole('button').focus()
  },
}
