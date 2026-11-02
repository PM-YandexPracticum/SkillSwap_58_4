# src/entities/skill/lib

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **lib** слайса `skill` — чистые вспомогательные функции.

## Что внутри

- `createSkill.ts` — фабрика тестового навыка для тестов и stories (снаружи — через `testing.ts`)
