# src/entities/session/lib

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **lib** слайса `session` — чистые вспомогательные функции. Первые кандидаты на unit-тесты.

## Что внутри

- `sessionStorage.ts` — Читает сохранённую сессию из localStorage
