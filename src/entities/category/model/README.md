# src/entities/category/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `category` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

## Что внутри

- `categoriesSlice.ts` — Справочник категорий: `fetchCategories` загружает категории с подкатегориями из «базы», статус `loading` → `succeeded` / `failed`. Загружается один раз при старте приложения
- `categoriesSlice.test.ts` — тесты статусов загрузки и загрузки из `public/db`
- `selectors.ts` — Все категории, статус, подкатегория по id, категория подкатегории, цвет категории
- `selectors.test.ts` — тесты селекторов
- `types.ts` — Подкатегория навыка, например «Игра на барабанах» → «Музыка и звук»
