import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResetFiltersButton } from './ResetFiltersButton'

const meta = {
  title: 'features/catalog-filter/ResetFiltersButton',
  component: ResetFiltersButton,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860',
    },
    docs: {
      description: {
        component:
          'P3-07 / P5-02. Кнопка передаёт сброс контейнеру, который очищает catalogFilter. Макет: [Figma](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860).',
      },
    },
  },
} satisfies Meta<typeof ResetFiltersButton>

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
