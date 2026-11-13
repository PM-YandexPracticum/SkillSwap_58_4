import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '@/shared/ui/Button'
import { OfferCreatedModal, type OfferCreatedModalProps } from './OfferCreatedModal'

const meta = {
  title: 'features/skill-create/OfferCreatedModal',
  component: OfferCreatedModal,
  tags: ['autodocs'],
  args: { isOpen: true, onClose: () => {} },
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2950',
    },
    docs: {
      story: { inline: false, height: '680px' },
      description: {
        component:
          'Окно «Ваше предложение создано» на `shared/ui/Modal`. Показывается в каталоге после регистрации (P6-06). Закрывается кнопкой «Готово», Esc и кликом по фону.',
      },
    },
  },
} satisfies Meta<typeof OfferCreatedModal>
export default meta
type Story = StoryObj<typeof meta>

/** Открытое окно, как в макете 1:2950 */
export const Open: Story = {}

function LiveModal(args: OfferCreatedModalProps) {
  const [isOpen, setIsOpen] = useState(args.isOpen)
  return (
    <>
      <div style={{ padding: 24 }}>
        <Button onClick={() => setIsOpen(true)}>Показать окно</Button>
      </div>
      <OfferCreatedModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

/** Окно закрывается и открывается заново */
export const Interactive: Story = {
  args: { isOpen: false },
  render: (args) => <LiveModal {...args} />,
}
