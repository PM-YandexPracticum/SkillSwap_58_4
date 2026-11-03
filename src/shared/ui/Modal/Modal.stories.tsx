import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from '../Button'

const meta = {
  title: 'shared/ui/Modal',
  component: Modal,
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>

export default meta

type Story = StoryObj<typeof meta>

/** Базовое состояние: заголовок, текст и кнопка внутри
 * @see Figma 1:1799, 1:1977, 1:2950 — превью навыка, «Вы предложили обмен», «Ваше предложение создано»
 */
export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    children: null,
    ariaLabel: 'Модальное окно',
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
      <>
        <button onClick={() => setIsOpen(true)}>Открыть</button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <h3>Заголовок</h3>
          <p>Абзац текста</p>
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            Кнопка
          </Button>
        </Modal>
      </>
    )
  },
}
