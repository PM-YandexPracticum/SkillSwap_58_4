# src/entities/category/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `category` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

## Что внутри

- `categoriesSlice.ts` — Справочник категорий. Загружается один раз при старте приложения. TODO: extraReducers для fetchCategories (pending / fulfilled / rejected)
- `selectors.ts` — Все категории
- `types.ts` — Подкатегория навыка, например «Игра на барабанах» → «Музыка и звук»
