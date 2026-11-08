# src/widgets/filters-panel/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `filters-panel` — React-компоненты. Получают данные пропсами или из store через селекторы.

**Текущее состояние:** FiltersPanel пока возвращает `null` в develop. Вёрстка P3-07 находится в Need fix (PR #148), связь с Redux — P5-02. Описания ниже задают целевую ответственность файлов.

## Что внутри

- `FiltersPanel.tsx` — Левая колонка «Фильтры (N) / Сбросить»: ModeFilter, SkillsFilter, GenderFilter, CityFilter
