import type { Meta, StoryObj } from '@storybook/react-vite'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { categoriesReducer, getCategories } from '@/entities/category'
import { citiesReducer, getCities } from '@/entities/city'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ROUTES } from '@/shared/config'
import { RegisterLayout } from './RegisterLayout'
import { RegisterStep1Page } from './RegisterStep1Page'
import { RegisterStep2Page } from './RegisterStep2Page'
import { RegisterStep3Page } from './RegisterStep3Page'

const meta = {
  title: 'pages/register/RegisterLayout',
  component: RegisterLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2548',
    },
  },
  loaders: [async () => ({ categories: await getCategories(), cities: await getCities() })],
  decorators: [
    (Story, context) => (
      <Provider
        store={configureStore({
          reducer: { categories: categoriesReducer, cities: citiesReducer },
          preloadedState: {
            categories: { items: context.loaded.categories, status: 'succeeded' as const },
            cities: { items: context.loaded.cities, status: 'succeeded' as const },
          },
        })}
      >
        <MemoryRouter
          key={context.id}
          initialEntries={[context.parameters.route ?? ROUTES.REGISTER_STEP_1]}
        >
          <div style={{ maxWidth: 1136, margin: '0 auto' }}>
            <Routes>
              <Route element={<Story />}>
                <Route path={ROUTES.REGISTER_STEP_1} element={<RegisterStep1Page />} />
                <Route path={ROUTES.REGISTER_STEP_2} element={<RegisterStep2Page />} />
                <Route path={ROUTES.REGISTER_STEP_3} element={<RegisterStep3Page />} />
              </Route>
            </Routes>
          </div>
        </MemoryRouter>
      </Provider>
    ),
  ],
} satisfies Meta<typeof RegisterLayout>
export default meta
type Story = StoryObj<typeof meta>
export const Step1: Story = {}
export const Step2: Story = {
  parameters: {
    route: ROUTES.REGISTER_STEP_2,
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-1497',
    },
  },
}
export const Step3: Story = {
  parameters: {
    route: ROUTES.REGISTER_STEP_3,
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-1761',
    },
  },
}
