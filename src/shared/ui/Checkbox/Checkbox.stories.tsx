import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { fn, userEvent, within } from 'storybook/test'
import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'shared/ui/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'Москва', checked: false, onChange: fn() },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860',
    },
    docs: {
      description: {
        component: 'Чекбокс фильтров. Частичный выбор переключается в полный, затем снимается.',
      },
    },
  },
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked)
    const [indeterminate, setIndeterminate] = useState(args.indeterminate)
    useEffect(() => setChecked(args.checked), [args.checked])
    useEffect(() => setIndeterminate(args.indeterminate), [args.indeterminate])
    return (
      <Checkbox
        {...args}
        checked={checked}
        indeterminate={indeterminate}
        onChange={(checked) => {
          args.onChange(checked)
          setChecked(checked)
          setIndeterminate(false)
        }}
      />
    )
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Checked: Story = { args: { checked: true } }
export const Indeterminate: Story = {
  args: { label: 'Творчество и искусство', indeterminate: true },
}
export const Disabled: Story = { args: { disabled: true } }
export const DisabledChecked: Story = { args: { disabled: true, checked: true } }
export const DisabledIndeterminate: Story = { args: { disabled: true, indeterminate: true } }
export const Error: Story = { args: { error: 'Выберите город' } }

/** Hover показывается при наведении на иконку или подпись. */
export const Hover: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Наведите курсор на чекбокс или подпись. Отключённый чекбокс на наведение не реагирует.',
      },
    },
  },
}

export const Focus: Story = {
  play: async ({ canvasElement }) => {
    within(canvasElement).getByRole('checkbox').focus()
    await userEvent.keyboard('{ArrowRight}')
  },
}

/** Пример взаимодействия категории с подкатегориями. Состояние хранит родитель. */
export const CategorySelection: Story = {
  render: function Category() {
    const options = ['Рисование и иллюстрация', 'Фотография', 'Музыка и звук']
    const [selected, setSelected] = useState(['Музыка и звук'])
    return (
      <div style={{ display: 'grid', gap: 'var(--space-12)' }}>
        <Checkbox
          label="Творчество и искусство"
          checked={selected.length === options.length}
          indeterminate={selected.length > 0 && selected.length < options.length}
          onChange={(checked) => setSelected(checked ? options : [])}
        />
        <div style={{ display: 'grid', gap: 'var(--space-12)', paddingLeft: 'var(--space-32)' }}>
          {options.map((label) => (
            <Checkbox
              key={label}
              label={label}
              checked={selected.includes(label)}
              onChange={(checked) =>
                setSelected((current) =>
                  checked ? [...current, label] : current.filter((item) => item !== label),
                )
              }
            />
          ))}
        </div>
      </div>
    )
  },
}
