import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent, within } from 'storybook/test'
import type { Category } from '@/entities/category'
import { loadSeed } from '@/shared/api'
import { SkillsFilter } from './SkillsFilter'

const meta = {
  title: 'features/catalog-filter/SkillsFilter',
  component: SkillsFilter,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860',
    },
    docs: {
      description: {
        component:
          'P3-07. Справочник загружается loader-ом; галочки локальные. Макет: [Figma](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860).',
      },
    },
  },
  args: { categories: [] },
  loaders: [async () => ({ categories: await loadSeed<Category>('categories')() })],
  render: (args, { loaded, parameters }) => (
    <div style={{ width: '284px' }}>
      <SkillsFilter
        {...args}
        categories={
          parameters.empty ? [] : args.categories.length ? args.categories : loaded.categories
        }
      />
    </div>
  ),
} satisfies Meta<typeof SkillsFilter>

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Empty: Story = { parameters: { empty: true } }
export const Expanded: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Развернуть категорию «Творчество и искусство»' }),
    )
  },
}
export const PartialSelection: Story = {
  play: async (context) => {
    await Expanded.play!(context)
    await userEvent.click(
      within(context.canvasElement).getByRole('checkbox', { name: 'Фотография' }),
    )
  },
}
export const FullSelection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Творчество и искусство' }))
  },
}

export const AdditionalCategories: Story = {
  loaders: [
    async () => {
      const categories = await loadSeed<Category>('categories')()
      return {
        categories: [
          ...categories,
          {
            ...categories[0],
            id: 'extra',
            title: 'Дополнительная категория',
            subcategories: categories[0].subcategories.map((sub) => ({
              ...sub,
              id: `extra-${sub.id}`,
              categoryId: 'extra',
            })),
          },
        ],
      }
    },
  ],
}

export const LongLabels: Story = {
  args: {
    categories: [
      {
        id: 'long',
        title: 'Категория с очень длинным названием, которое переносится на несколько строк',
        icon: 'art',
        color: 'art',
        subcategories: [
          {
            id: 'long-sub',
            categoryId: 'long',
            title: 'Очень длинное название подкатегории без обрезания текста',
          },
        ],
      },
    ],
  },
}
