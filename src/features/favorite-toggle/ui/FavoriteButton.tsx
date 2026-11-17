import { useState } from 'react'
import LikeIcon from '@/shared/assets/icons/like.svg?react'
import { selectCurrentUser } from '@/entities/user'
import { DATA_ERRORS, ROUTES } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { useLocation, useNavigate } from 'react-router-dom'
import { selectFavoriteIds, selectFavoriteTogglePending } from '../model/selectors'
import { toggleFavorite } from '../model/toggleFavorite'
import { IconButton } from '@/shared/ui/IconButton'

import styles from './FavoriteButton.module.css'

export interface FavoriteButtonProps {
  /** Кого лайкаем */
  userId: string
  /** Число лайков автора */
  likesCount: number
}

/**
 * Лайк и счётчик карточки пользователя.
 * @see Figma: карточка Ивана (1:2877). Счётчик добавлен по ТЗ P3-08, в макете его нет.
 */
export function FavoriteButton({ userId, likesCount }: FavoriteButtonProps) {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const currentUser = useAppSelector(selectCurrentUser)
  const favoriteIds = useAppSelector(selectFavoriteIds)
  const isPending = useAppSelector(selectFavoriteTogglePending)
  const isFavorite = favoriteIds.includes(userId)
  const isSelf = currentUser?.id === userId

  const handleToggle = async () => {
    if (!currentUser) {
      navigate(ROUTES.LOGIN, { state: { from: location } })
      return
    }

    const result = await dispatch(toggleFavorite(userId))
    if (toggleFavorite.rejected.match(result) && !result.meta.condition) {
      setError(result.payload ?? DATA_ERRORS.SAVE_USER)
    } else {
      setError(null)
    }
  }

  return (
    <div className={styles.favorite}>
      <span className={styles.count} aria-label={`Количество лайков: ${likesCount}`}>
        {likesCount}
      </span>
      <IconButton
        ariaLabel={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
        aria-pressed={isFavorite}
        className={isFavorite ? styles.selected : undefined}
        disabled={isSelf || isPending}
        icon={<LikeIcon aria-hidden="true" />}
        onClick={() => void handleToggle()}
      />
      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
