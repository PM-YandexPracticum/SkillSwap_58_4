# src/features/exchange-propose/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `exchange-propose` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

## Что внутри

- `proposeExchange.ts` — Создаёт обмен со статусом pending, сохраняет в localStorage и добавляет уведомление получателю
