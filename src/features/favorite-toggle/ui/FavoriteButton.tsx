export interface FavoriteButtonProps {
  /** Кого лайкаем */
  userId: string
}

/**
 * Сердечко со счётчиком лайков (`likesCount`) на карточке и странице навыка.
 * Закрашено, если пользователь есть в `likedUserIds` текущего пользователя. Себя лайкнуть нельзя.
 * Гость → регистрация (`/register/step-1`) с запоминанием страницы, после «Готово» — возврат обратно.
 */
export function FavoriteButton(_props: FavoriteButtonProps) {
  // TODO: useAppSelector(selectFavoriteIds) + toggleFavorite
  return null
}
