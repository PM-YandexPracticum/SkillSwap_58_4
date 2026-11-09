import type { Meta, StoryObj } from '@storybook/react-vite'

import { ErrorPage } from './ErrorPage'
import error500 from '@/shared/assets/images/error-500.svg'
import error404 from '@/shared/assets/images/error-404.svg'

const meta: Meta<typeof ErrorPage> = {
  title: 'shared/ui/ErrorPage',
  component: ErrorPage,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '460px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    errorType: {
      control: 'inline-radio',
      options: ['500', '404'],
    },
  },
}

export default meta

type Story = StoryObj<typeof ErrorPage>

export const ServerError500: Story = {
  name: '500 error',
  args: {
    errorImage: error500,
    errorType: '500',
    title: 'На сервере произошла ошибка',
    description:
      'Попробуйте позже или вернитесь на главную страницу',
  },
}

export const NotFound404: Story = {
  name: '404 error',
  args: {
    errorImage: error404,
    errorType: '404',
    title: 'Страница не найдена',
    description:
      'К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже',
  },
}
