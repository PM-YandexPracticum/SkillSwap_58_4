# src/shared/api/mock-db

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

«База данных» внутри приложения: `createMockCollection` — коллекция с методами получить / создать / изменить / удалить. Образцы — в `seed/`, изменения — в localStorage. Потом её можно заменить на настоящую БД: меняется только слой `entities/*/api`.

## Что внутри

- [`seed/`](seed/README.md) — Образцы данных — по 2–3 записи на сущность с разными вариантами
- `createMockCollection.ts` — Любая запись «базы» обязана иметь строковый id
- `index.ts` — публичный API — импортировать снаружи только отсюда
