# src/features/auth-by-email

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Вход по email и паролю: форма, схема валидации, проверка учётных данных.

**Текущее состояние:** форма — заготовка P3-11; вход и возврат на исходный адрес — P4-09. `login()` пока бросает `Not implemented`. Описания ниже задают целевую ответственность файлов.

## Что внутри

- [`model/`](model/README.md) — типы, слайс, селекторы
- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
