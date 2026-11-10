import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { SortToggle, type SortToggleProps } from './SortToggle'

function Example(args: SortToggleProps) {
  const [value, setValue] = useState(args.value)
  return <SortToggle {...args} value={value} onChange={setValue} />
}
const meta = {
  title: 'features/catalog-filter/SortToggle',
  component: SortToggle,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860',
    },
    docs: {
      description: {
        component:
          'P3-10: кнопка сообщает выбранный порядок родителю; сортировка данных — P5-05. «Сначала старые» — второе состояние из требований, отдельно в Figma не показано.',
      },
    },
  },
  args: { value: 'newest', onChange: () => {} },
  render: (args) => <Example {...args} />,
} satisfies Meta<typeof SortToggle>
export default meta
type Story = StoryObj<typeof meta>
export const Newest: Story = {}
export const Oldest: Story = { args: { value: 'oldest' } }
