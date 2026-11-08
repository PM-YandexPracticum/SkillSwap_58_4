# src/features/exchange-propose/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `exchange-propose` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

## Что внутри

- `proposeExchange.ts` — заготовка P7-03, сейчас бросает `Not implemented`. Сценарий должен вызвать готовые операции обмена и уведомления из сущностей (P4-07), обработать ошибку и показать toast; смысл уведомления — «Вы предложили обмен …», видит его автор предложения
