export interface FavoriteButtonProps {
  /** Кого лайкаем */
  userId: string
}

/**
 * Сердечко со счётчиком лайков (`likesCount`) на карточке и странице навыка.
 * Закрашено, если пользователь есть в `likedUserIds` текущего пользователя. Себя лайкнуть нельзя.
 * Гость → вход (`/login`) с запоминанием страницы, после входа — возврат обратно (ТЗ наставника, 2.4).
 */
export function FavoriteButton(_props: FavoriteButtonProps) {
  // TODO: useAppSelector(selectFavoriteIds) + toggleFavorite
  return null
}
