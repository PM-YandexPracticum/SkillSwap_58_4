# src/entities/user/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `user` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

## Что внутри

- `selectors.ts` — Все пользователи
- `types.ts` — Пользователь платформы. Образцы — `shared/api/mock-db/seed/users/`; чтение и запись — только через `entities/user/api`
- `usersSlice.ts` — Все пользователи из «базы» (`entities/user/api`), включая зарегистрированных. TODO: fetchUsers (createAsyncThunk); TODO: userAdded(user) — после регистрации; userUpdated({ id, changes }) — профиль и лайки
