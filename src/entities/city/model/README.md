# src/entities/city/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `city` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

## Что внутри

- `citiesSlice.ts` — Справочник городов. Нужен фильтру «Город», шагу 2 регистрации и «Личным данным». `fetchCities` загружает города из «базы», статус `loading` → `succeeded` / `failed`
- `citiesSlice.test.ts` — тесты статусов загрузки и загрузки из `public/db`
- `selectors.ts` — Все города, статус, город по id
- `selectors.test.ts` — тесты селекторов
- `types.ts` — Город из справочника — простая сущность: id и название
