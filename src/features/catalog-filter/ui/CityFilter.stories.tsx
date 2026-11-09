import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent, within } from 'storybook/test'
import type { City } from '@/entities/city'
import { loadSeed } from '@/shared/api'
import { CityFilter } from './CityFilter'

const meta = {
  title: 'features/catalog-filter/CityFilter',
  component: CityFilter,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860',
    },
    docs: {
      description: {
        component:
          'P3-07. Сначала пять городов, остальные раскрываются кнопкой. Макет: [Figma](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860).',
      },
    },
  },
  args: { cities: [] },
  loaders: [async () => ({ cities: await loadSeed<City>('cities')() })],
  render: (args, { loaded, parameters }) => (
    <div style={{ width: '284px' }}>
      <CityFilter
        {...args}
        cities={parameters.empty ? [] : args.cities.length ? args.cities : loaded.cities}
      />
    </div>
  ),
} satisfies Meta<typeof CityFilter>

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Empty: Story = { parameters: { empty: true } }
export const Expanded: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Все города' }))
  },
}
export const Selected: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('checkbox', { name: 'Москва' }))
  },
}

export const LongLabels: Story = {
  args: {
    cities: [
      {
        id: 'long',
        name: 'Город с очень длинным названием, которое переносится на несколько строк',
      },
    ],
  },
}
