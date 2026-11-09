# src/pages/skill/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `skill` — React-компоненты. Получают данные пропсами или из store через селекторы.

**Текущее состояние:** SkillPage пока заготовка. Описание ниже задаёт целевое поведение P3-09/P7-01.

## Что внутри

- `SkillPage.tsx` — Страница навыка `/skill/:id`: SkillDetails + OffersCarousel
