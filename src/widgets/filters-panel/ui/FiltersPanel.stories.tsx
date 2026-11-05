import type { Meta, StoryObj } from '@storybook/react-vite'
import { FiltersPanel } from './FiltersPanel'

// Полноценные моки для категорий (чтобы было что раскрывать)
const mockCategories = [
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
      { id: 'drawing', categoryId: 'creativity', title: 'Рисование' },
      { id: 'photo', categoryId: 'creativity', title: 'Фотография' },
    ],
  },
  {
    id: 'languages',
    title: 'Иностранные языки',
    icon: 'globe',
    color: '#EBE5C5',
    subcategories: [],
  },
]

// Полноценные моки для городов (больше 5, чтобы работала кнопка "Все города")
const mockCities = [
  { id: 'msk', name: 'Москва' },
  { id: 'spb', name: 'Санкт-Петербург' },
  { id: 'nsk', name: 'Новосибирск' },
  { id: 'ekb', name: 'Екатеринбург' },
  { id: 'kzn', name: 'Казань' },
  { id: 'krd', name: 'Краснодар' }, // 6-й город
  { id: 'sochi', name: 'Сочи' }, // 7-й город
]

const meta: Meta<typeof FiltersPanel> = {
  title: 'widgets/filters-panel/FiltersPanel',
  component: FiltersPanel,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    categories: mockCategories,
    cities: mockCities,
  },
}
