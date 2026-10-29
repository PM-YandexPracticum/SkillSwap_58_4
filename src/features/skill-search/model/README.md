# src/features/skill-search/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `skill-search` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

## Что внутри

- `searchSlice.ts` — Строка поиска в шапке («Искать навык»). В store попадает только применённый запрос — по Enter или клику на лупу; набираемый текст живёт в самом поле. TODO: queryApplied(query), queryCleared
