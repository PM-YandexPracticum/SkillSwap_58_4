# src/entities/skill/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `skill` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

## Что внутри

- `selectors.ts` — Все навыки
- `skillsSlice.ts` — Все навыки из «базы» (`entities/skill/api`): образцы + созданные при регистрации. TODO: fetchSkills (createAsyncThunk), addSkill
- `types.ts` — Навык, которым пользователь готов поделиться («Может научить»)
