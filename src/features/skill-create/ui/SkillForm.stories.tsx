import type { Meta, StoryObj } from '@storybook/react-vite'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { fn, userEvent, within } from 'storybook/test'

import { categoriesReducer } from '@/entities/category'
import { createCategory } from '@/entities/category/testing'
import { SkillForm } from './SkillForm'

const meta = {
  title: 'features/skill-create/SkillForm',
  component: SkillForm,
  tags: ['autodocs'],
  args: { onSubmit: fn(), onBack: fn() },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-1761',
    },
    docs: {
      description: {
        component:
          'Форма навыка: название, категория, подкатегория, описание, зона фото (1–4 с превью), «Назад» / «Продолжить». Проверки выполняются через skillSchema и validateImageFile; сохранение регистрации выполняет completeRegistration из P6-06.',
      },
    },
  },
  decorators: [
    (Story) => (
      <Provider
        store={configureStore({
          reducer: { categories: categoriesReducer },
          preloadedState: {
            categories: { items: [createCategory()], status: 'succeeded' as const },
          },
        })}
      >
        <div style={{ width: 436 }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
} satisfies Meta<typeof SkillForm>
export default meta
type Story = StoryObj<typeof meta>

/** Пустая форма, как в макете 1:1761 */
export const Default: Story = {}

/** Название и описание введены */
export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Название навыка'), 'Игра на барабанах')
    await userEvent.type(canvas.getByLabelText('Описание'), 'Научу основам техники и импровизации')
  },
}
