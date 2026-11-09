import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { userEvent, within } from 'storybook/test'

import { ROUTER_FUTURE } from '@/shared/config'

import { LoginForm } from './LoginForm'

const FIGMA_LOGIN =
  'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2400'
const FIGMA_ERROR =
  'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2473'

/**
 * Форма входа: Email, Пароль с «глазом», «Войти» и ссылка «Зарегистрироваться».
 * Ссылка — `Link`, поэтому stories обёрнуты в `MemoryRouter`. Проверку входа подключит P4-09.
 */
const meta: Meta<typeof LoginForm> = {
  title: 'features/auth-by-email/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter future={ROUTER_FUTURE}>
        <div style={{ width: 436 }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>

/** Пустая форма (1:2400) */
export const Default: Story = {
  parameters: { design: { type: 'figma', url: FIGMA_LOGIN } },
}

export const Filled: Story = {
  parameters: { design: { type: 'figma', url: FIGMA_LOGIN } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByLabelText('Email'), 'petrov@mail.ru')
    await userEvent.type(canvas.getByLabelText('Пароль'), 'password123')
  },
}

/** Неверная пара email / пароль: оба поля красные, общая ошибка под паролем (1:2473) */
export const WrongCredentials: Story = {
  play: Filled.play,
  args: {
    error: 'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных',
  },
  parameters: { design: { type: 'figma', url: FIGMA_ERROR } },
}
