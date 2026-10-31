# src/shared/ui/Loader

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Loader**. Индикатор загрузки (fallback для Suspense и загрузки моков).

## Что внутри

- `Loader.tsx` — доступный спиннер для состояний загрузки данных и ленты карточек.
- `Loader.css` — оформление и анимация спиннера.
- `Loader.stories.tsx` — обычный спиннер, загрузка страницы и загрузка ленты.
- `index.ts` — публичный API компонента.
