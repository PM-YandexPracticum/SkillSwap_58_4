import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '../Button'
import { Modal, type ModalProps } from './Modal'

const FIGMA = 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id='

/**
 * Модалка — только обёртка: фон, белое окно и скругление. Заголовок, текст, кнопки и внутренние отступы
 * передаёт конкретное окно через `children` (в макете отступы у окон разные: 60/80 px и 40 px).
 * Esc и клик по фону закрывают окно, кнопка «Открыть» — открывает снова.
 */
const meta = {
  title: 'shared/ui/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: { isOpen: true, onClose: () => {}, ariaLabel: 'Заголовок', children: null },
  parameters: { design: { type: 'figma', url: `${FIGMA}1-1977` } },
} satisfies Meta<typeof Modal>

export default meta

type Story = StoryObj<typeof meta>

/** Живая модалка: открывается кнопкой, закрывается Esc, кликом по фону и кнопкой внутри */
function LiveModal({ args, children }: { args: ModalProps; children: ModalProps['children'] }) {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Открыть</Button>
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {children}
        <div style={{ padding: '0 var(--space-60) var(--space-60)' }}>
          <Button onClick={() => setIsOpen(false)}>Готово</Button>
        </div>
      </Modal>
    </>
  )
}

/** Простое содержимое: заголовок, абзац и кнопка. Отступы задаёт содержимое, а не модалка */
export const Default: Story = {
  render: function Default(args) {
    return (
      <LiveModal args={args}>
        <div style={{ padding: 'var(--space-60) var(--space-60) var(--space-32)' }}>
          <h3>Заголовок</h3>
          <p>Абзац текста</p>
        </div>
      </LiveModal>
    )
  },
}

/**
 * Высокое окно — как превью навыка (1:1799, 1024 × 532). Если не помещается в экран, прокручивается вместе с фоном,
 * а страница под ним стоит на месте.
 */
export const LongContent: Story = {
  args: { ariaLabel: 'Ваше предложение' },
  parameters: { design: { type: 'figma', url: `${FIGMA}1-1799` } },
  render: function LongContent(args) {
    return (
      <LiveModal args={args}>
        <div style={{ width: 'min(1024px, 100%)', padding: 'var(--space-40)' }}>
          <h3>Ваше предложение</h3>
          {Array.from({ length: 30 }, (_, index) => (
            <p key={index}>Строка длинного содержимого №{index + 1}</p>
          ))}
        </div>
      </LiveModal>
    )
  },
}
