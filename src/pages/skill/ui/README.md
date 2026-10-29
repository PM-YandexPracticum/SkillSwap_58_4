# src/pages/skill/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `skill` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `SkillPage.tsx` — Страница навыка `/skill/:id`: SkillDetails + OffersCarousel
