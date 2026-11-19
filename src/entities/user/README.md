# src/entities/user

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Пользователь платформы: профиль, город, возраст, чему может научить и чему хочет научиться.

## Что внутри

- [`api/`](api/README.md) — загрузка данных
- [`lib/`](lib/README.md) — чистые функции
- [`model/`](model/README.md) — типы, слайс, селекторы
- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API: `fetchUsers`, `createNewUser`, `updateDataUser`, `updateUserFavorite`, редьюсер, селекторы загрузки/записи и компоненты; UI получает `PublicUser`, полная запись по email предназначена только для логики входа (подробнее в `model/README.md`)
- `testing.ts` — публичный API для тестов и stories: фабрика `createUser()`
