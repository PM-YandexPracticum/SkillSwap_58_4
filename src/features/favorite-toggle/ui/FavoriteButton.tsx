import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { selectSession } from '@/entities/session'
import { selectCurrentUser } from '@/entities/user'
import LikeFilledIcon from '@/shared/assets/icons/like-filled.svg?react'
import LikeIcon from '@/shared/assets/icons/like.svg?react'
import { DATA_ERRORS, ROUTES } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { useToast } from '@/shared/lib/toast'
import { IconButton } from '@/shared/ui/IconButton'

import { selectFavoriteIds, selectFavoriteTogglePending } from '../model/selectors'
import { toggleFavorite } from '../model/toggleFavorite'
import styles from './FavoriteButton.module.css'

export interface FavoriteButtonProps {
  /** Кого лайкаем */
  userId: string
  /** Число лайков автора */
  likesCount: number
}

/**
 * Лайк и счётчик карточки пользователя. Данные обновляются после сохранения,
 * повтор блокируется только для этого адресата. Поздняя ошибка не переходит
 * на другую карточку, новую сессию или размонтированный компонент.
 * @see Figma: карточка Ивана (1:2877). Счётчик добавлен по ТЗ P3-08, в макете его нет.
 */
export function FavoriteButton({ userId, likesCount }: FavoriteButtonProps) {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const currentUser = useAppSelector(selectCurrentUser)
  const favoriteIds = useAppSelector(selectFavoriteIds)
  const session = useAppSelector(selectSession)
  const operationRef = useRef<object | null>(null)
  const isPending = useAppSelector((state) => selectFavoriteTogglePending(state, userId))

  useEffect(() => {
    return () => {
      operationRef.current = null
    }
  }, [userId, session?.userId, session?.token])

  const isFavorite = favoriteIds.includes(userId)
  const isSelf = currentUser?.id === userId

  const handleToggle = async () => {
    if (!currentUser) {
      navigate(ROUTES.LOGIN, { state: { from: location } })
      return
    }

    if (isSelf || isPending) return
    const operation = {}
    operationRef.current = operation
    const result = await dispatch(toggleFavorite(userId))
    if (operationRef.current !== operation) return
    operationRef.current = null
    if (toggleFavorite.rejected.match(result) && !result.meta.condition) {
      showToast(result.payload ?? DATA_ERRORS.SAVE_USER)
    }
  }

  return (
    <div className={styles.favorite}>
      <span className={styles.count}>
        <span className={styles.visuallyHidden}>Количество лайков: </span>
        {likesCount}
      </span>
      <IconButton
        ariaLabel={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
        aria-pressed={isFavorite}
        aria-busy={isPending}
        className={isFavorite ? styles.selected : undefined}
        disabled={isSelf || isPending}
        icon={isFavorite ? <LikeFilledIcon aria-hidden="true" /> : <LikeIcon aria-hidden="true" />}
        onClick={() => void handleToggle()}
      />
    </div>
  )
}
