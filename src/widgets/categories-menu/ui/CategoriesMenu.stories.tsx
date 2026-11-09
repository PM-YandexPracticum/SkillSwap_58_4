import { configureStore } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Provider } from 'react-redux'

import { categoriesReducer, type Category } from '@/entities/category'
import { loadSeed } from '@/shared/api'
import { CategoriesMenu } from './CategoriesMenu'

const meta = {
  title: 'widgets/categories-menu/CategoriesMenu',
  component: CategoriesMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-3165',
    },
    docs: {
      description: {
        component:
          'P3-06. Статичные категории из справочника: без переходов и фильтрации. Открытие панели предоставляет Header. Loading, ошибка и пустое состояние отсутствуют в Figma и оформлены готовыми Loader/Button.',
      },
    },
  },
  loaders: [async () => ({ categories: await loadSeed<Category>('categories')() })],
  decorators: [
    (Story, { loaded, parameters }) => {
      const status = parameters.categoryStatus ?? 'succeeded'
      const store = configureStore({
        reducer: { categories: categoriesReducer },
        preloadedState: {
          categories: { items: parameters.empty ? [] : loaded.categories, status },
        },
      })
      return (
        <Provider store={store}>
          <div style={{ maxWidth: 'var(--container-width-narrow)' }}>
            <Story />
          </div>
        </Provider>
      )
    },
  ],
} satisfies Meta<typeof CategoriesMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Loading: Story = { parameters: { categoryStatus: 'loading', empty: true } }
export const Error: Story = { parameters: { categoryStatus: 'failed', empty: true } }
export const Empty: Story = { parameters: { empty: true } }
