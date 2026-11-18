# src/features/logout

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Выход из аккаунта.

`LogoutButton` завершает сессию через `endSession()` и переводит на главную с заменой записи истории. Синхронное завершение обновления store позволяет переходу на главную выполниться после реакции `RequireAuth`.

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
