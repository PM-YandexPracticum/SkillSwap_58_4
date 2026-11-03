# public/db

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../docs/architecture/fsd.md).

## Зачем эта папка

Образцы данных «базы» — по ТЗ наставника JSON лежат в `public/db`. «База» (`src/shared/api/mock-db`) скачивает файл
коллекции через `fetch` при первом обращении; все изменения потом сохраняются в localStorage, сами файлы не меняются.
Читать данные в коде — только через `entities/*/api`, напрямую в эти файлы не ходим.

## Что внутри

- `users.json` — 45 пользователей `u01`–`u45`: образцы (u01–u03) и три части, которые заполнила команда (P1-06…P1-08). Тип — `entities/user/model/types.ts`
- `skills.json` — 45 навыков `s01`–`s45`, по одному на пользователя (`s18` — навык `u18`)
- `categories.json` — 6 категорий и 42 подкатегории (P1-05)
- `cities.json` — 17 городов (P1-05)
- `exchanges.json` — образцы предложенных обменов
- `notifications.json` — образцы уведомлений

Правила наполнения — в [задачах фазы 1](../../docs/tasks/phases/phase-01-preparation.md); связи между файлами проверяет `src/shared/api/mock-db/publicDb.test.ts`.
