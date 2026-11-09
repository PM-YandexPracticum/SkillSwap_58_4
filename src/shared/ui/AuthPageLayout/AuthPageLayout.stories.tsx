import type { Meta, StoryObj } from '@storybook/react-vite'
import lightBulb from '@/shared/assets/images/light-bulb.svg'
import { IllustrationCard } from '@/shared/ui/IllustrationCard'
import { Stepper } from '@/shared/ui/Stepper'
import { AuthPageLayout } from './AuthPageLayout'

const meta = {
  title: 'shared/ui/AuthPageLayout',
  component: AuthPageLayout,
  tags: ['autodocs'],
  args: {
    title: 'Вход',
    children: <p>Содержимое формы</p>,
    illustration: (
      <IllustrationCard
        image={lightBulb}
        title="С возвращением в SkillSwap!"
        text="Обменивайтесь знаниями и навыками с другими людьми"
      />
    ),
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2400',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: 1136 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuthPageLayout>
export default meta
type Story = StoryObj<typeof meta>
export const Login: Story = {}
export const Registration: Story = {
  args: {
    title: 'Регистрация',
    progress: <Stepper current={1} total={3} />,
    illustration: (
      <IllustrationCard
        image={lightBulb}
        title="Добро пожаловать в SkillSwap!"
        text="Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми"
      />
    ),
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2548',
    },
  },
}
