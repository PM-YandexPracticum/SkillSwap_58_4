import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import { expect, fn, userEvent, within } from 'storybook/test'

import { loadSeed } from '@/shared/api'
import { createCategory } from '../testing'
import type { Category } from '../model/types'
import { CategorySubcategorySelect } from './CategorySubcategorySelect'

const category = createCategory()
const creative = createCategory({
  id: 'creativity',
  title: 'Творчество и искусство',
  icon: 'creativity',
  color: 'creativity',
  subcategories: [{ id: 'creativity-photo', categoryId: 'creativity', title: 'Фотография' }],
})
const meta = {
  title: 'entities/category/CategorySubcategorySelect',
  component: CategorySubcategorySelect,
  tags: ['autodocs'],
  args: {
    mode: 'multiple',
    categories: [category],
    categoryLabel: 'Категория навыка, которому хотите научиться',
    subcategoryLabel: 'Подкатегория навыка, которому хотите научиться',
    value: { categoryIds: [], subcategoryIds: [] },
    onChange: fn(),
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-1673',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'grid',
          gap: 16,
          width: 436,
          maxWidth: '100%',
          minHeight: 460,
          alignContent: 'start',
        }}
      >
        <Story />
      </div>
    ),
  ],
  render: function Render(args, { loaded }) {
    const [, updateArgs] = useArgs()
    return (
      <CategorySubcategorySelect
        {...args}
        categories={loaded.categories ?? args.categories}
        onChange={(value) => {
          args.onChange(value)
          updateArgs({ value })
        }}
      />
    )
  },
} satisfies Meta<typeof CategorySubcategorySelect>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const OpenCategories: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: /^Категория навыка/ }))
  },
}
export const OpenSubcategories: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-1717',
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: /^Подкатегория навыка/ }),
    )
  },
}
export const Selected: Story = {
  args: { value: { categoryIds: [category.id], subcategoryIds: [category.subcategories[0].id] } },
}
export const Error: Story = { args: { error: 'Выберите хотя бы одну подкатегорию' } }
export const Empty: Story = { args: { categories: [] } }
export const FromDatabase: Story = {
  loaders: [async () => ({ categories: await loadSeed<Category>('categories')() })],
}

export const LinkedSelection: Story = {
  args: { categories: [category, creative] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const categoryField = canvas.getByRole('button', { name: /^Категория навыка/ })
    const subcategoryField = canvas.getByRole('button', { name: /^Подкатегория навыка/ })
    await userEvent.click(subcategoryField)
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Фотография' }))
    await expect(categoryField).toHaveTextContent(creative.title)
    await expect(
      canvas.queryByRole('checkbox', { name: category.subcategories[0].title }),
    ).not.toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await expect(subcategoryField).toHaveFocus()
  },
}

export const Single: Story = {
  args: {
    mode: 'single',
    categories: [category, creative],
    categoryLabel: 'Категория навыка',
    subcategoryLabel: 'Подкатегория навыка',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-1761',
    },
  },
}

export const SingleSelected: Story = {
  ...Single,
  args: {
    ...Single.args,
    value: { categoryIds: [creative.id], subcategoryIds: [creative.subcategories[0].id] },
  },
}
