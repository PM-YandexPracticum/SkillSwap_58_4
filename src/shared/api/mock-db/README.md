# src/shared/api/mock-db

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

«База данных» внутри приложения: `createMockCollection` — коллекция с методами получить / создать / изменить / удалить. Образцы — в `seed/`, изменения — в localStorage. Потом её можно заменить на настоящую БД: меняется только слой `entities/*/api`.

## Что внутри

- [`seed/`](seed/README.md) — начальные данные: 45 пользователей с навыками, справочники, образцы обменов и уведомлений
- `createMockCollection.ts` — коллекция «базы» (`getAll`, `getById`, `create`, `update`, `remove`) и `resetMockDb()` — сброс всех изменений к `seed`. Изменения хранятся в localStorage, ответы приходят с задержкой `MOCK_DB.DELAY_MS`
- `createMockCollection.test.ts` — тесты: чтение и копии, изменения после «перезагрузки», повреждённый и недоступный localStorage, нехватка места, задержка, сброс
- `isolation.test.ts` — проверка общего сброса из `src/setupTests.ts`: изменения «базы» не переходят из теста в тест
- `index.ts` — публичный API — импортировать снаружи только отсюда
