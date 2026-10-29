# src/widgets/offers-section

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Секция каталога: заголовок и сетка по 3 в ряд. «Популярное» и «Новое» раскрываются 3 ⇄ 9, «Рекомендуем» и результаты — лента с догрузкой по 6.

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
