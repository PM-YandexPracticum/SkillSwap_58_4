import type { City } from '@/entities/city'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CityFilter } from './CityFilter'

const mockCities: City[] = [
  { id: 'msk', name: 'Москва' },
  { id: 'spb', name: 'Новосибирск' },
  { id: 'ekb', name: 'Екатеринбург' },
  { id: 'kzn', name: 'Казань' },
  { id: 'krd', name: 'Краснодар' },
  { id: 'kem', name: 'Кемерово' },
  { id: 'vld', name: 'Владивосток' },
  { id: 'sochi', name: 'Сочи' },
  { id: 'krs', name: 'Красноярск' },
  { id: 'irk', name: 'Иркутск' },
  { id: 'abakan', name: 'Абакан' },
  { id: 'perm', name: 'Пермь' },
  { id: 'yar', name: 'Ярославль' },
  { id: 'arkh', name: 'Архангельск' },
  { id: 'samara', name: 'Самара' },
  { id: 'saratov', name: 'Саратов' },
]

const meta: Meta<typeof CityFilter> = {
  title: 'features/catalog-filter/CityFilter',
  component: CityFilter,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    cities: mockCities,
  },
}
