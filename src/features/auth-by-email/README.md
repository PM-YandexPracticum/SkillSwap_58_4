# src/features/auth-by-email

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Вход по email и паролю: форма, схема валидации, проверка учётных данных.

Форма использует общий `CredentialsForm`. Действие `login` проверяет пару по данным в Redux и создаёт сессию.

## Что внутри

- [`model/`](model/README.md) — типы, схема формы и проверка входа
- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
