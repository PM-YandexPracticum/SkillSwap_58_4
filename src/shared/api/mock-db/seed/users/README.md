# src/shared/api/mock-db/seed/users

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../../../docs/architecture/fsd.md).

## Зачем эта папка

Пользователи: `sample.json` — 3 образца (Иван, Анна, Мария — демо-аккаунт). `part-1.json` … `part-3.json` — пока пустые, их заполняют задачи P1-06…P1-08, каждая — свой файл и свой диапазон id. Файлы уже подключены в `index.ts` — так можно работать одновременно без конфликтов.

## Что внутри

- `index.ts` — публичный API — импортировать снаружи только отсюда
- `sample.json` — образцы (3 шт.)
- `part-1.json` … `part-3.json` — заполняет команда (P1-06…P1-08)
