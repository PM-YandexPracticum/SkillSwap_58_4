# src/entities/session

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Сессия текущего пользователя (мок-авторизация через localStorage): кто вошёл и вошёл ли вообще.

## Что внутри

- [`lib/`](lib/README.md) — чистые функции
- [`model/`](model/README.md) — типы, слайс, селекторы
- `index.ts` — публичный API — импортировать снаружи только отсюда
