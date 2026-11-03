# src/entities/session/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `session` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

## Что внутри

- `selectors.ts` — `selectSession` (сессия или `null`) и `selectIsAuth` (вошёл ли пользователь)
- `sessionSlice.ts` — Состояние авторизации: начальное значение из localStorage; `startSession(userId)` — вход, `endSession()` — выход: каждое сразу меняет и store, и localStorage
- `sessionSlice.test.ts` — тесты: гость при открытии, вошедший остаётся после перезагрузки, вход и выход
- `types.ts` — Текущая сессия. Бекенда нет: «токен» — мок, хранится в localStorage. Профильные данные берутся из entities/user по `userId`
