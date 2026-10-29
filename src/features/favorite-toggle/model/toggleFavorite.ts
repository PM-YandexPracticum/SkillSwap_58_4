/**
 * Лайк / снятие лайка. Своего хранилища у избранного нет. Меняются два пользователя (без мутаций — новые объекты):
 * - у текущего пользователя `likedUserIds` (+ id / − id) — из этого строится страница «Избранное»;
 * - у того, кого лайкнули, `likesCount` (+1 / −1) — это счётчик на карточке и сортировка «Популярного».
 * Оба изменения сохраняются через `updateUser` из entities/user; если не получилось — откатить.
 * @param targetUserId кого лайкаем
 */
export function toggleFavorite(_targetUserId: string): void {
  // TODO: createAsyncThunk: userUpdated ×2 → updateUser ×2 → откат при ошибке
  throw new Error('Not implemented: toggleFavorite')
}
