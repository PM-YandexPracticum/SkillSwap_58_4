import type { Meta, StoryObj } from '@storybook/react-vite'

import { ProposeExchangeButton } from './ProposeExchangeButton'

const FIGMA = 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id='

const meta = {
  title: 'features/exchange-propose/ProposeExchangeButton',
  component: ProposeExchangeButton,
  tags: ['autodocs'],
  args: { toUserId: 'u01', skillId: 's01', onClick: () => {} },
  parameters: {
    design: { type: 'figma', url: `${FIGMA}1-1864` },
    docs: {
      description: {
        component:
          'Компонент отвечает за два состояния кнопки. Сохранение обмена, уведомление и переход гостя подключены на странице навыка (P7-03).',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 399 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProposeExchangeButton>

export default meta

type Story = StoryObj<typeof meta>

/** «Предложить обмен» — основная кнопка, макет 1:1864 */
export const Default: Story = {}

/** «🕓 Обмен предложен» — обведённая неактивная кнопка, макет 1:1919 */
export const Proposed: Story = {
  args: { isProposed: true },
  parameters: { design: { type: 'figma', url: `${FIGMA}1-1919` } },
}
