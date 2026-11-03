# src/entities/session/lib

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **lib** слайса `session` — чистые вспомогательные функции. Первые кандидаты на unit-тесты.

## Что внутри

- `sessionStorage.ts` — Чтение, запись и очистка сессии в localStorage. Чужие данные и недоступный localStorage не ломают сайт: гость. Снаружи не используется — вход и выход идут через `startSession` / `endSession`
- `sessionStorage.test.ts` — тесты: сохранение и чтение, повреждённые данные, недоступный localStorage
