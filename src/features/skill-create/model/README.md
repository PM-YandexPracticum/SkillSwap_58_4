# src/features/skill-create/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `skill-create` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

## Что внутри

- `schema.ts` — Схема формы навыка (шаг 3 регистрации и раздел «Мои навыки»)

Название и описание проверяются общими полями `skillTitleField`/`textField` и лимитами `VALIDATION`.
Связь категории с подкатегорией и проверка загружаемых файлов подключаются в логике формы отдельно.
