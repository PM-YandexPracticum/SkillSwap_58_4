# src/features/catalog-filter/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `catalog-filter` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

## Что внутри

- `catalogFilterSlice.ts` — Фильтры каталога. Когда выбран хотя бы один фильтр или введён поиск — секции «Популярное / Новое / Рекомендуем» заменяются на «Подходящие предложения: N»: плашки фильтров, сортировка и лента с догрузкой. TODO: setMode, toggleSubcategory, toggleCategory, setGender, toggleCity, setSort, removeFilter, resetFilters
- `selectors.ts` — Текущие фильтры
- `types.ts` — Радио-группа «Всё / Хочу научиться / Могу научить»
