# src/shared/api/mock-db/seed

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../../docs/architecture/fsd.md).

## Зачем эта папка

Образцы данных — по 2–3 записи на сущность с разными вариантами. Остальное команда заполняет по образцу (задачи P1-05…P1-08). Тип каждой записи — в `entities/*/model/types.ts`.

## Что внутри

- [`skills/`](skills/README.md) — Навыки — по одному на пользователя: `sample.json` — 3 образца; `part-1.json` … `part-3.json` (пока пустые) заполняются вместе с пользователями тех же задач
- [`users/`](users/README.md) — Пользователи: `sample.json` — 3 образца (Иван, Анна, Мария — демо-аккаунт)
- `categories.json` — категории с подкатегориями (3 шт.)
- `cities.json` — города (3 шт.)
- `exchanges.json` — обмены (2 шт.)
- `index.ts` — публичный API — импортировать снаружи только отсюда
- `notifications.json` — уведомления (2 шт.)
