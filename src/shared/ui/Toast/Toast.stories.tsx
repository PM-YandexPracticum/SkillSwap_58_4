import { useState } from 'react'
import { Toast } from './Toast'
import type { ToastProps } from './Toast'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'

const meta = {
  title: 'shared/ui/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Внешний вид — Figma 1:2148 (1:1975, 1:1976). Текст по ТЗ наставника: «Вы предложили обмен …». Таймер проверяется в app/providers/ToastProvider.',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2148',
    },
  },
  argTypes: {
    message: { control: 'text', description: 'Текст уведомления' },
    onClose: { description: 'Обработчик кнопки закрытия' },
  },
} satisfies Meta<typeof Toast>

export default meta

type Story = StoryObj<typeof meta>

function ClosableToast(args: ToastProps) {
  const [visible, setVisible] = useState(true)
  return visible ? (
    <Toast
      {...args}
      onClose={() => {
        setVisible(false)
        args.onClose()
      }}
    />
  ) : (
    <Button onClick={() => setVisible(true)}>Показать снова</Button>
  )
}

/** Обычный вид и закрытие мышью / клавиатурой. @see Figma: 1:1975, 1:1976 */
export const Default: Story = {
  args: { message: 'Вы предложили обмен Ивану', onClose: () => {} },
  render: (args) => <ClosableToast {...args} />,
}

/** Перенос длинного текста. @see Figma: 1:2148 */
export const LongMessage: Story = {
  ...Default,
  args: {
    ...Default.args,
    message:
      'Вы предложили обмен Александру: обучение игре на музыкальных инструментах в обмен на разговорную практику иностранного языка',
  },
}
