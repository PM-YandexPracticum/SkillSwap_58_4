import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ActiveFilters, type ActiveFiltersProps } from './ActiveFilters'

function Example(args: ActiveFiltersProps) {
  const [items, setItems] = useState(args.items)
  return (
    <ActiveFilters
      {...args}
      items={items}
      onRemove={(id) => setItems((current) => current.filter((item) => item.id !== id))}
    />
  )
}

const meta = {
  title: 'features/catalog-filter/ActiveFilters',
  component: ActiveFilters,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860',
    },
    docs: {
      description: {
        component:
          'P3-10: управляемые плашки. В примере удаление локальное; преобразование фильтров store в подписи и применение к каталогу — P5-05.',
      },
    },
  },
  args: {
    items: [
      { id: 'mode', label: 'Хочу научиться' },
      { id: 'english', label: 'Английский' },
    ],
    onRemove: () => {},
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<typeof ActiveFilters>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Empty: Story = { args: { items: [] } }
export const LongLabel: Story = {
  args: {
    items: [
      {
        id: 'long',
        label:
          'Очень длинное название выбранной подкатегории навыка для проверки переноса и обрезки',
      },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: 324 }}>
        <Story />
      </div>
    ),
  ],
}
