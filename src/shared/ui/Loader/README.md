# src/shared/ui/Loader

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Loader**. Индикатор загрузки (fallback для Suspense и загрузки моков).

## Что внутри

- `Loader.tsx` — спиннер с `role="status"` для загрузки данных и ленты карточек
- `Loader.module.css` — оформление и анимация; без анимации, если она отключена в системе
- `Loader.test.tsx` — тесты: `role="status"` с подписью, внешний `className`
- `Loader.stories.tsx` — спиннер, загрузка страницы, догрузка ленты
- `index.ts` — публичный API — импортировать снаружи только отсюда
