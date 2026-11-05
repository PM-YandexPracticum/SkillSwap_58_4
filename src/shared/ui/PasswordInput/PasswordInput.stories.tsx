import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { PasswordInput } from './PasswordInput'

const FIGMA_LOGIN =
  'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2400'
const FIGMA_HINT =
  'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2548'
const FIGMA_ERROR =
  'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2627'

/**
 * Поле пароля на основе `Input` с кнопкой-«глазом» (показать / скрыть пароль)
 * и подсказкой под полем. Используется на входе, в регистрации и при смене пароля.
 */
const meta: Meta<typeof PasswordInput> = {
  title: 'shared/ui/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  args: { label: 'Пароль', placeholder: 'Введите ваш пароль' },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(436px, 80vw)' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>

/** Пароль скрыт, без подсказки — форма входа */
export const Default: Story = {
  parameters: { design: { type: 'figma', url: FIGMA_LOGIN } },
}

/** Пароль скрыт, под полем подсказка — регистрация и смена пароля */
export const WithHint: Story = {
  args: {
    placeholder: 'Придумайте надёжный пароль',
    hint: 'Пароль должен содержать не менее 8 знаков',
  },
  parameters: { design: { type: 'figma', url: FIGMA_HINT } },
}

/** Пароль показан: после клика по «глазу» тип поля становится `text` */
export const Shown: Story = {
  args: { defaultValue: 'secret123', hint: 'Пароль должен содержать не менее 8 знаков' },
  parameters: { design: { type: 'figma', url: FIGMA_HINT } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Показать пароль' }))
    await expect(canvas.getByLabelText('Пароль')).toHaveAttribute('type', 'text')
  },
}

/** Ошибка: вместо подсказки показывается текст ошибки */
export const Error: Story = {
  args: {
    defaultValue: '123',
    hint: 'Пароль должен содержать не менее 8 знаков',
    error: 'Пароль должен содержать не менее 8 знаков',
  },
  parameters: { design: { type: 'figma', url: FIGMA_ERROR } },
}

/** Недоступное поле */
export const Disabled: Story = {
  args: { disabled: true },
  parameters: { design: { type: 'figma', url: FIGMA_LOGIN } },
}
