import { IconButton } from './IconButton'
import styles from './IconButton.module.css'
import LikeIcon from '../../assets/icons/like.svg?react'
import LikeFilledIcon from '../../assets/icons/like-filled.svg?react'
import NotificationIcon from '../../assets/icons/notification.svg?react'
import CrossIcon from '../../assets/icons/cross.svg?react'
/**
 * Stories компонента IconButton — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11;
 * после неё добавить типы: `const meta: Meta<typeof IconButton>` и `export const Default: StoryObj<typeof meta>`.
 *
 * Нужны stories для состояний из макета: сердце (пустое / закрашенное), колокольчик, «поделиться», «Закрыть».
 * Правила — docs/rules/storybook.md.
 */
const meta = {
  title: 'shared/ui/IconButton',
  component: IconButton,
  tags: ['autodocs'],
}

export default meta

/** Базовое состояние */
export const Like = {
  args: { ariaLabel: 'Добавить в избранное', icon: <LikeIcon /> },
}

export const Liked = {
  args: {
    ariaLabel: 'Убрать из избранного',
    icon: <LikeFilledIcon className={styles.liked} />,
  },
}
export const Notification = {
  args: {
    ariaLabel: 'Уведомления',
    icon: <NotificationIcon />,
  },
}

export const Close = {
  args: {
    ariaLabel: 'Закрыть',
    icon: <CrossIcon />,
  },
}
// TODO: по одной story на каждое состояние из списка выше
