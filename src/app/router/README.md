# src/app/router

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Вспомогательные компоненты маршрутизации, например защита приватных маршрутов.

## Что внутри

- `RegisterStepGuard.tsx` — Не пускает на шаг 2 или 3 регистрации по прямой ссылке: попасть туда можно только кнопками «Далее» / «Продолжить». Если предыдущий шаг не пройден (`selectCompletedStep` < step − 1) — перенаправляет на `/register/step-1`
- `RequireAuth.tsx` — Защита приватных маршрутов (/profile/*). Гостя отправляет на /login, запоминая, откуда он пришёл (state.from), чтобы вернуть после входа
