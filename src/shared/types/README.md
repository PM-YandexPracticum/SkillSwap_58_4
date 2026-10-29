# src/shared/types

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Общие утилитарные TypeScript-типы (`ID`, `ISODateString`, `LoadingStatus`). Доменные типы здесь НЕ храним.

## Что внутри

- `index.ts` — публичный API — импортировать снаружи только отсюда
