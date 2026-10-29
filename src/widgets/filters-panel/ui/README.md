# src/widgets/filters-panel/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `filters-panel` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `FiltersPanel.tsx` — Левая колонка «Фильтры (N) / Сбросить»: ModeFilter, SkillsFilter, GenderFilter, CityFilter
