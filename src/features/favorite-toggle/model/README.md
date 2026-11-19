# src/features/favorite-toggle/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `favorite-toggle` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

Селектор id избранного читает `likedUserIds` через `selectCurrentUser`. `toggleFavorite` проверяет авторизацию, адресата и повторный клик, затем вызывает `updateUserFavorite` из `entities/user`. API вычисляет изменения на актуальных данных в очереди и сохраняет обе записи одним вызовом localStorage. Store обновляется после общего успеха, откат не требуется. Разные адресаты могут сохраняться параллельно без потери данных.

## Что внутри

- `selectors.ts` — id пользователей в избранном текущего пользователя и статус сохранения конкретного адресата.
- `toggleFavorite.ts` — лайк/снятие лайка: согласованное изменение `likedUserIds` и `likesCount` одной операцией.
- `favoriteToggleSlice.ts` — блокировка повторного нажатия сердечка до ответа.
