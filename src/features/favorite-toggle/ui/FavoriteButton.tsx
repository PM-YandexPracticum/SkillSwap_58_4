import LikeIcon from '@/shared/assets/icons/like.svg?react'
import { IconButton } from '@/shared/ui/IconButton'

import styles from './FavoriteButton.module.css'

export interface FavoriteButtonProps {
  /** Кого лайкаем; понадобится при подключении P5-07 */
  userId: string
  /** Число лайков автора */
  likesCount: number
}

/**
 * Вид сердечка со счётчиком. В P3-08 клик ничего не меняет; авторизация и сохранение — P5-07.
 * @see Figma: карточка Ивана (1:2877). Счётчик добавлен по ТЗ P3-08, в макете его нет.
 */
export function FavoriteButton({ likesCount }: FavoriteButtonProps) {
  return (
    <div className={styles.favorite}>
      <span className={styles.count} aria-label={`Количество лайков: ${likesCount}`}>
        {likesCount}
      </span>
      <IconButton ariaLabel="Добавить в избранное" icon={<LikeIcon aria-hidden="true" />} />
    </div>
  )
}
