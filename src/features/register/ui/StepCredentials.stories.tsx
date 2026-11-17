import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { usersReducer } from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { StepCredentials } from './StepCredentials'

const credentials = { email: 'petrov@mail.ru', password: 'password123' }

const meta = {
  title: 'features/register/StepCredentials',
  component: StepCredentials,
  tags: ['autodocs'],
  args: { onNext: () => undefined },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2548',
    },
  },
  decorators: [
    (Story) => (
      <Provider
        store={configureStore({
          reducer: { users: usersReducer },
          preloadedState: {
            users: {
              ...usersReducer(undefined, { type: '@@init' }),
              items: [createUser({ email: credentials.email })],
              status: 'succeeded' as const,
            },
          },
        })}
      >
        <MemoryRouter>
          <div style={{ width: 436 }}>
            <Story />
          </div>
        </MemoryRouter>
      </Provider>
    ),
  ],
} satisfies Meta<typeof StepCredentials>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Filled: Story = { args: { defaultValues: credentials } }
export const EmailTaken: Story = {
  args: Filled.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: 'Далее' })
    await waitFor(() => expect(submit).toBeEnabled())
    await userEvent.click(submit)
    await expect(canvas.findByText('Email уже используется')).resolves.toBeVisible()
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2627',
    },
  },
}
