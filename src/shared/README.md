# src/shared

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../docs/architecture/fsd.md).

## Зачем эта папка

Слой **shared** — переиспользуемый код без бизнес-логики: UI-кит, api-клиент, конфиги, хелперы. Ничего не знает о SkillSwap-сущностях.

## Что внутри

- [`api/`](api/README.md) — Доступ к данным
- [`assets/`](assets/README.md) — Статические ресурсы, импортируемые из кода: SVG-иконки и картинки из макета
- [`config/`](config/README.md) — Конфигурация и константы: маршруты, числа каталога, ключи localStorage, настройки «базы», лимиты валидации
- [`lib/`](lib/README.md) — Утилиты общего назначения: форматирование, склонение, хуки, типизированные Redux-хуки
- [`types/`](types/README.md) — Общие утилитарные TypeScript-типы (`ID`, `ISODateString`, `LoadingStatus`)
- [`ui/`](ui/README.md) — UI-кит: базовые компоненты из макета без бизнес-логики

## Правило импортов

shared не импортирует ничего из верхних слоёв.
