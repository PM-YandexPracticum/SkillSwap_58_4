import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '@/shared/ui/Button'

import { ExchangeProposedModal, type ExchangeProposedModalProps } from './ExchangeProposedModal'

const FIGMA = 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id='

const meta = {
  title: 'features/exchange-propose/ExchangeProposedModal',
  component: ExchangeProposedModal,
  tags: ['autodocs'],
  args: { isOpen: true, onClose: () => {} },
  parameters: {
    layout: 'fullscreen',
    design: { type: 'figma', url: `${FIGMA}1-1977` },
    docs: {
      description: {
        component:
          'Окно «Вы предложили обмен» на `shared/ui/Modal`. Закрывается кнопкой «Готово», Esc и кликом по фону.',
      },
    },
  },
} satisfies Meta<typeof ExchangeProposedModal>

export default meta

type Story = StoryObj<typeof meta>

/** Открытое окно, как в макете 1:1977 */
export const Open: Story = {}

function LiveModal(args: ExchangeProposedModalProps) {
  const [isOpen, setIsOpen] = useState(args.isOpen)
  return (
    <>
      <div style={{ padding: 24 }}>
        <Button onClick={() => setIsOpen(true)}>Предложить обмен</Button>
      </div>
      <ExchangeProposedModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

/** Окно закрывается и открывается заново — проверить Esc, фон и «Готово» */
export const Interactive: Story = {
  args: { isOpen: false },
  render: (args) => <LiveModal {...args} />,
}
