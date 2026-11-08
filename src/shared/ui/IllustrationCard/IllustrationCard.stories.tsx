import type { Meta, StoryObj } from '@storybook/react-vite'

import lightBulb from '@/shared/assets/images/light-bulb.svg'

import { IllustrationCard } from './IllustrationCard'

const FIGMA_LOGIN =
  'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2400'
const FIGMA_REGISTER =
  'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2548'

/** Правая карточка экранов входа и регистрации: иллюстрация, заголовок и текст */
const meta: Meta<typeof IllustrationCard> = {
  title: 'shared/ui/IllustrationCard',
  component: IllustrationCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 556 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>

/** Вход (1:2400) */
export const Login: Story = {
  args: {
    image: lightBulb,
    title: 'С возвращением в SkillSwap!',
    text: 'Обменивайтесь знаниями и навыками с другими людьми',
  },
  parameters: { design: { type: 'figma', url: FIGMA_LOGIN } },
}

/** Регистрация, шаг 1 (1:2548) */
export const Register: Story = {
  args: {
    image: lightBulb,
    title: 'Добро пожаловать в SkillSwap!',
    text: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
  },
  parameters: { design: { type: 'figma', url: FIGMA_REGISTER } },
}

/** Только заголовок, без текста */
export const TitleOnly: Story = {
  args: { image: lightBulb, title: 'С возвращением в SkillSwap!' },
}
