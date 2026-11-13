import type { Meta, StoryObj } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'

import { categoriesReducer } from '@/entities/category'
import { StepSkill } from './StepSkill'
import { SkillForm } from '@/features/skill-create/ui/SkillForm'
import { SkillPreviewModal } from '@/features/skill-create/ui/SkillPreviewModal'

const mockCategories = [
  {
    id: 'art',
    title: 'Творчество и искусство',
    icon: 'palette',
    color: 'art',
    subcategories: [
      { id: 'photo', categoryId: 'art', title: 'Фотография' },
      { id: 'drawing', categoryId: 'art', title: 'Рисование' },
    ],
  },
]

const mockPreviewData = {
  title: 'Рисование акварелью',
  description: 'Научу основам акварельной живописи',
  categoryTitle: 'Творчество и искусство',
  subcategoryTitle: 'Рисование',
}

const mockImages = ['/images/skills/s01-1.jpg', '/images/skills/s01-2.jpg']

const meta: Meta<typeof StepSkill> = {
  title: 'features/register/StepSkill',
  component: StepSkill,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: { categories: categoriesReducer },
        preloadedState: {
          categories: { items: mockCategories, status: 'succeeded' as const },
        },
      })

      return (
        <Provider store={store}>
          <MemoryRouter>
            <div style={{ width: 500 }}>
              <Story />
            </div>
          </MemoryRouter>
        </Provider>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const WithForm: Story = {
  args: {
    skillForm: (
      <SkillForm
        onBack={() => console.log('Назад')}
        onSubmit={(values, images) => console.log('Отправлено:', values, images)}
      />
    ),
  },
}

export const WithPreview: Story = {
  args: {
    skillForm: <SkillForm onBack={() => console.log('Назад')} onSubmit={() => {}} />,
    previewModal: (
      <SkillPreviewModal
        isOpen
        skill={mockPreviewData}
        images={mockImages}
        onEdit={() => console.log('Редактировать')}
        onConfirm={() => console.log('Готово')}
      />
    ),
  },
}
