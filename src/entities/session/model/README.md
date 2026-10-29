# src/entities/session/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `session` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

## Что внутри

- `selectors.ts` — Текущая сессия или null
- `sessionSlice.ts` — Состояние авторизации. TODO: setSession(session), clearSession(); начальное значение читать из sessionStorage.ts
- `types.ts` — Текущая сессия. Бекенда нет: «токен» — мок, хранится в localStorage. Профильные данные берутся из entities/user по `userId`
