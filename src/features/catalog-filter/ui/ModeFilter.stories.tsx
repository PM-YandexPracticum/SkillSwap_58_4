import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent, within } from 'storybook/test'
import { ModeFilter } from './ModeFilter'

const meta = {
  title: 'features/catalog-filter/ModeFilter',
  component: ModeFilter,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860',
    },
    docs: {
      description: {
        component:
          'P3-07. Визуальный компонент; подключение фильтров к каталогу — P5-02. Макет: [Figma](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860).',
      },
    },
  },
} satisfies Meta<typeof ModeFilter>

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}

export const Selected: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('radio', { name: 'Хочу научиться' }))
  },
}
