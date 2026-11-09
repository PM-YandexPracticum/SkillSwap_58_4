import type { Meta, StoryObj } from '@storybook/react-vite'
import { ROUTES, VALIDATION } from '@/shared/config'
import { CredentialsForm } from './CredentialsForm'

const meta = {
  title: 'shared/ui/CredentialsForm',
  component: CredentialsForm,
  tags: ['autodocs'],
  args: {
    label: 'Вход',
    submitLabel: 'Войти',
    onSubmit: (event) => event.preventDefault(),
    emailInput: { name: 'email' },
    passwordInput: { name: 'password' },
    children: <a href={ROUTES.REGISTER}>Зарегистрироваться</a>,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2400',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 436 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CredentialsForm>
export default meta
type Story = StoryObj<typeof meta>

export const Login: Story = {}
export const WrongCredentials: Story = {
  args: {
    error: 'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2473',
    },
  },
}
export const Registration: Story = {
  args: {
    label: 'Учётные данные',
    submitLabel: 'Далее',
    passwordInput: {
      autoComplete: 'new-password',
      placeholder: 'Придумайте надёжный пароль',
      hint: `Пароль должен содержать не менее ${VALIDATION.PASSWORD.MIN} знаков`,
    },
    children: (
      <>
        Уже есть аккаунт? <a href={ROUTES.LOGIN}>Войти</a>
      </>
    ),
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2548',
    },
  },
}
export const EmailTaken: Story = {
  ...Registration,
  args: {
    ...Registration.args,
    emailInput: { error: 'Email уже используется', defaultValue: 'petrov@mail.ru' },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2627',
    },
  },
}
