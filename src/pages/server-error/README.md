# src/pages/server-error

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Ошибка 500 (`/500`).

**Текущее состояние:** маршрут `/500` показывает ошибку стартовой загрузки через DataProvider (P4-04). Корневой ErrorBoundary (P8-01) показывает то же содержимое при ошибке рендера, даже если упал роутер или провайдер.

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
