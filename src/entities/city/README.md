# src/entities/city

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Справочник городов (~15) — простая сущность: id и название. Нужна фильтру «Город», шагу 2 регистрации и «Личным данным».

## Что внутри

- [`api/`](api/README.md) — загрузка данных
- [`model/`](model/README.md) — типы, слайс, селекторы
- `index.ts` — публичный API — импортировать снаружи только отсюда
