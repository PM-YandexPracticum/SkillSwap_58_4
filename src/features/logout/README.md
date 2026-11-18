# src/features/logout

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Выход из аккаунта.

`LogoutButton` согласует переход на главную с `endSession()` из `entities/session`. Пользователи, навыки, лайки и обмены сохраняются; удаляется только сессия. Подробности порядка перехода и проверок — в [`ui/README.md`](ui/README.md).

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
