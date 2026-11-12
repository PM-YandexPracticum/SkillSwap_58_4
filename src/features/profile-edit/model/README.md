# src/features/profile-edit/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `profile-edit` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

## Что внутри

- `schema.ts` — Схема формы «Личные данные»

`profileSchema` использует общие правила email, имени, даты, города и текста.
Форма после загрузки справочника вызывает `createProfileSchema(cityIds)` и передаёт поле `cityId`;
базовая схема без списка проверяет лишь заполненность города. Валидация ещё не подключена к UI.
