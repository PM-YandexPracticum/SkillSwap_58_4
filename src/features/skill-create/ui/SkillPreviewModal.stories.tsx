import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'

import { Button } from '@/shared/ui/Button'
import { SkillPreviewModal, type SkillPreviewModalProps } from './SkillPreviewModal'

const meta = {
  title: 'features/skill-create/SkillPreviewModal',
  component: SkillPreviewModal,
  tags: ['autodocs'],
  args: {
    isOpen: true,
    onEdit: fn(),
    onConfirm: fn(),
    skill: {
      title: 'Рисование акварелью',
      description:
        'Привет! Я рисую и занимаюсь творчеством уже больше 10 лет — от первых набросков в скетчбуках до профессиональных выставок и работы на заказ. Научу основам рисунка (и как не бояться чистого листа), владеть любимыми материалами, видеть пропорции.',
      categoryTitle: 'Творчество и искусство',
      subcategoryTitle: 'Рисование и иллюстрации',
    },
    images: [
      '/images/skills/s01-1.jpg',
      '/images/skills/s01-2.jpg',
      '/images/skills/s01-3.jpg',
      '/images/skills/s01-4.jpg',
    ],
  },
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-1799',
    },
    docs: {
      story: { inline: false, height: '680px' },
      description: {
        component:
          'Окно «Ваше предложение» на `shared/ui/Modal`: слева данные навыка и кнопки, справа галерея с мини-превью. Данные и адреса фото приходят пропсами. «Редактировать» (и Esc) возвращает к форме, «Готово» вызывает onConfirm; сохранение и завершение подключаются в P6-06.',
      },
    },
  },
} satisfies Meta<typeof SkillPreviewModal>
export default meta
type Story = StoryObj<typeof meta>

/** Четыре фото: на третьем мини-превью «+1», как в макете 1:1799 */
export const Default: Story = {}

/** Одно фото — без карусели и мини-превью */
export const OneImage: Story = { args: { images: ['/images/skills/s01-1.jpg'] } }

/** Без фото — только текст и кнопки */
export const NoImages: Story = { args: { images: [] } }

function LiveModal(args: SkillPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(args.isOpen)
  return (
    <>
      <div style={{ padding: 24 }}>
        <Button onClick={() => setIsOpen(true)}>Продолжить</Button>
      </div>
      <SkillPreviewModal
        {...args}
        isOpen={isOpen}
        onEdit={() => setIsOpen(false)}
        onConfirm={() => setIsOpen(false)}
      />
    </>
  )
}

/** Окно закрывается и открывается заново: проверить «Редактировать», «Готово», Esc и фон */
export const Interactive: Story = {
  args: { isOpen: false },
  render: (args) => <LiveModal {...args} />,
}
