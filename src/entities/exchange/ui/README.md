# src/entities/exchange/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Статичный бейдж предложенного обмена. Сам не читает store и не загружает данные: условие показа определяет `OfferCard` через `selectHasProposed`.

## Что внутри

- `ExchangeStatusBadge.tsx` — статичный бейдж «Обмен предложен» с иконкой часов — на карточке человека, которому текущий пользователь уже предложил обмен
- `ExchangeStatusBadge.test.tsx` — проверка видимого текста, отсутствия live-роли и скрытия декоративной иконки.
- `ExchangeStatusBadge.module.css` — оформление по Figma 1:2106: белый фон, акцентная рамка, радиус 12 px, высота 48 px.
- `ExchangeStatusBadge.stories.tsx` — самостоятельная история статуса без Redux и роутера.

Компонент и тип `ExchangeStatusBadgeProps` доступны через `@/entities/exchange`. Единственный проп — необязательный `className`.
