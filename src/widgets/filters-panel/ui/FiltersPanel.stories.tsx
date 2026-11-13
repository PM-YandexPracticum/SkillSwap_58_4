import { configureStore } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { userEvent, within } from 'storybook/test'
import { categoriesReducer, type Category } from '@/entities/category'
import { citiesReducer, type City } from '@/entities/city'
import { loadSeed } from '@/shared/api'
import { FiltersPanel } from './FiltersPanel'

const meta = {
  title: 'widgets/filters-panel/FiltersPanel',
  component: FiltersPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860',
    },
    docs: {
      description: {
        component:
          'P3-07 / P5-02. Панель читает справочники селекторами, записывает выборы в catalogFilter и принимает счётчик и сброс через пропсы; список результатов и сортировка подключены в CatalogPage (P5-05). Макет: [Figma](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2860). Пустое состояние в макете не нарисовано: оставлены заголовки без списков.',
      },
    },
  },
  loaders: [
    async () => {
      const [categories, cities] = await Promise.all([
        loadSeed<Category>('categories')(),
        loadSeed<City>('cities')(),
      ])
      return { categories, cities }
    },
  ],
  decorators: [
    (Story, { loaded, parameters }) => {
      const store = configureStore({
        reducer: { categories: categoriesReducer, cities: citiesReducer },
        preloadedState: {
          categories: {
            items: parameters.empty ? [] : loaded.categories,
            status: 'succeeded' as const,
          },
          cities: { items: parameters.empty ? [] : loaded.cities, status: 'succeeded' as const },
        },
      })
      return (
        <Provider store={store}>
          <Story />
        </Provider>
      )
    },
  ],
} satisfies Meta<typeof FiltersPanel>

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const WithCount: Story = { args: { filtersCount: 2 } }
export const Empty: Story = { parameters: { empty: true } }
export const PartialSelection: Story = {
  args: { filtersCount: 2 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Развернуть категорию «Творчество и искусство»' }),
    )
    await userEvent.click(canvas.getByRole('radio', { name: 'Хочу научиться' }))
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Музыка и звук' }))
  },
}
