# src/shared/api/mock-db/seed/users

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../../../docs/architecture/fsd.md).

## Зачем эта папка

Пользователи — 45 человек, разбиты на файлы, чтобы три участника заполняли их одновременно без конфликтов. Все файлы подключены в `index.ts`. Фото: аватар `/images/avatars/<id>.jpg` — квадрат 300–400 px.

## Что внутри

- `index.ts` — публичный API — импортировать снаружи только отсюда
- `sample.json` — образцы `u01`–`u03` (Иван, Анна, Мария — демо-аккаунт)
- `part-1.json` — `u04`–`u17` (P1-06)
- `part-2.json` — `u18`–`u31` (P1-07)
- `part-3.json` — `u32`–`u45` (P1-08)

Правила наполнения — в [задачах фазы 1](../../../../../../docs/tasks/phases/phase-01-preparation.md).
