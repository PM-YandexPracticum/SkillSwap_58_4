# src/shared/api/mock-db/seed/skills

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../../../docs/architecture/fsd.md).

## Зачем эта папка

Навыки — по одному на пользователя: `sample.json` — 3 образца; `part-1.json` … `part-3.json` (пока пустые) заполняются вместе с пользователями тех же задач.

## Что внутри

- `index.ts` — публичный API — импортировать снаружи только отсюда
- `sample.json` — образцы (3 шт.)
- `part-1.json` … `part-3.json` — заполняет команда (P1-06…P1-08)
