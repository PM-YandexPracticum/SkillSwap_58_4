# src/features/favorite-toggle/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `favorite-toggle` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

Селектор id избранного читает `likedUserIds` через `selectCurrentUser`; `toggleFavorite` сохраняет изменения обоих пользователей через `updateDataUser` и компенсирует первую запись при ошибке второй. Слайс не допускает параллельных переключений, чтобы они не перезаписывали друг друга.

## Что внутри

- `selectors.ts` — id пользователей в избранном текущего пользователя и статус сохранения.
- `toggleFavorite.ts` — лайк/снятие лайка: синхронное изменение `likedUserIds` и `likesCount` с компенсацией при ошибке.
- `favoriteToggleSlice.ts` — блокировка параллельных переключений.
