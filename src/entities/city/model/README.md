# src/entities/city/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `city` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

## Что внутри

- `citiesSlice.ts` — Справочник городов (~15). Нужен фильтру «Город», шагу 2 регистрации и «Личным данным». TODO: fetchCities (createAsyncThunk)
- `selectors.ts` — Все города
- `types.ts` — Город из справочника — простая сущность: id и название
