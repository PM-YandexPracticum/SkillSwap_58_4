# src/app/providers

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

React-провайдеры, которыми оборачивается всё приложение: Redux, роутер, тема (необязательная фича). Позже здесь появятся загрузка данных и ErrorBoundary.

## Что внутри

- `RouterProvider.tsx` — все маршруты приложения, lazy-загрузка страниц, лейауты
- `StoreProvider.tsx` — подключает Redux store к React
- `ThemeProvider.tsx` — Применяет сохранённую тему (`data-theme` на <html>) при старте приложения. ⭐ Необязательная фича (фаза 9): пока не реализована, просто отдаёт children
