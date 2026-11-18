import type { Meta, StoryObj } from '@storybook/react-vite'

import { MarkAllReadButton } from './MarkAllReadButton'

/**
 * Кнопка «Прочитать все» в окне уведомлений — фрейм 1:2239.
 * Клик переводит новые уведомления в просмотренные.
 * Компонент не знает о Redux и вызывает переданный onClick; в приложении
 * обработчик подключения к store передаёт MainLayout (P7-05).
 * Цвет при :hover не меняется — см. MarkAllReadButton.module.css.
 *
 * @see Figma: 1:2239 (открытое окно), 1:2190 (окно), 1:2148 (экран)
 */
const meta: Meta<typeof MarkAllReadButton> = {
  title: 'features/notifications-read/MarkAllReadButton',
  component: MarkAllReadButton,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2239',
    },
  },
  args: { onClick: () => {} },
}

export default meta

type Story = StoryObj<typeof meta>

/** Обычное состояние: зелёный текст, Medium, без фона (1:2239) */
export const Default: Story = {}
