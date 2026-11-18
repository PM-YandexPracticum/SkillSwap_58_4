# src/entities/skill

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Навык, которым пользователь готов поделиться: название, категория, описание, фото.

## Что внутри

- [`api/`](api/README.md) — загрузка данных
- [`lib/`](lib/README.md) — чистые функции
- [`model/`](model/README.md) — типы, слайс, селекторы
- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API: `fetchSkills`, `createNewSkill`, `updateDataSkill`, редьюсер, селекторы данных/загрузки/записи и компоненты; импортировать снаружи только отсюда
- `testing.ts` — публичный API для тестов и stories: фабрика `createSkill()`
