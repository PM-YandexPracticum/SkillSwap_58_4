# src/entities/exchange

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Предложение обмена (номинальное): кто, кому и на какой навык предложил. Принять или отклонить нельзя; второй раз тому же человеку — тоже.

## Что внутри

- [`api/`](api/README.md) — загрузка данных
- [`model/`](model/README.md) — типы, слайс, селекторы
- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
