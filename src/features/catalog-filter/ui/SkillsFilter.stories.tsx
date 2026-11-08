import type { Category } from '@/entities/category'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SkillsFilter } from './SkillsFilter'

// Моковые данные, имитирующие ответ от API или фабрики
const mockCategories: Category[] = [
  {
    id: 'business',
    title: 'Бизнес и карьера',
    icon: 'briefcase',
    color: '#EEE7F7',
    subcategories: [
      { id: 'management', categoryId: 'business', title: 'Менеджмент' },
      { id: 'marketing', categoryId: 'business', title: 'Маркетинг' },
    ],
  },
  {
    id: 'creativity',
    title: 'Творчество и искусство',
    icon: 'palette',
    color: '#F7E7F2',
    subcategories: [
      { id: 'drawing', categoryId: 'creativity', title: 'Рисование и иллюстрация' },
      { id: 'photo', categoryId: 'creativity', title: 'Фотография' },
      { id: 'music', categoryId: 'creativity', title: 'Музыка и звук' },
    ],
  },
]

const meta: Meta<typeof SkillsFilter> = {
  title: 'features/catalog-filter/SkillsFilter',
  component: SkillsFilter,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    categories: mockCategories,
  },
}
