# src/features/exchange-propose

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

«Предложить обмен»: создаёт обмен и уведомление, показывает окно «Вы предложили обмен».

**Текущее состояние:** кнопка и окно пока возвращают `null`, сценарий `proposeExchange` бросает `Not implemented`. Подключение готового API P4-07 — P7-03. Описания ниже задают целевую ответственность файлов.

## Что внутри

- [`model/`](model/README.md) — типы, слайс, селекторы
- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
