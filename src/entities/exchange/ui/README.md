# src/entities/exchange/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `exchange` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `ExchangeStatusBadge.tsx` — Бейдж «Обмен предложен» с иконкой часов — на карточке человека, которому текущий пользователь уже предложил обмен
