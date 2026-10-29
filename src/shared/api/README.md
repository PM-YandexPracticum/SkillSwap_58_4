# src/shared/api

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Доступ к данным. Сейчас — «база» в браузере (`mock-db`); entities обращаются к ней через свои `api/*Api.ts`.

## Что внутри

- [`mock-db/`](mock-db/README.md) — «База данных» внутри приложения: `createMockCollection` — коллекция с методами получить / создать / изменить / удалить
- `index.ts` — публичный API — импортировать снаружи только отсюда
