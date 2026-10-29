# src

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../docs/architecture/fsd.md).

## Зачем эта папка

Исходный код приложения. Разделён на слои FSD: `app → pages → widgets → features → entities → shared`. Импортировать можно только из слоёв ниже.

## Что внутри

- [`app/`](app/README.md) — Слой **app** — точка сборки приложения: провайдеры, роутер, Redux store, лейауты и глобальные стили
- [`entities/`](entities/README.md) — Слой **entities** — бизнес-сущности предметной области: типы, Redux-слайсы, селекторы, загрузка данных и «глупый» UI
- [`features/`](features/README.md) — Слой **features** — действия пользователя, которые несут бизнес-ценность: войти, отфильтровать, лайкнуть, предложить обмен
- [`pages/`](pages/README.md) — Слой **pages** — страницы приложения
- [`shared/`](shared/README.md) — Слой **shared** — переиспользуемый код без бизнес-логики: UI-кит, api-клиент, конфиги, хелперы
- [`widgets/`](widgets/README.md) — Слой **widgets** — крупные самостоятельные блоки интерфейса, собранные из features и entities (шапка, панель фильтров, карточка предложения)
- `main.tsx` — точка входа: монтирует `<App />` в `#root`
- `setupTests.ts` — настройка Vitest: подключает матчеры jest-dom
- `vite-env.d.ts` — типы окружения Vite (`import.meta.env`)
