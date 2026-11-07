# src/pages/catalog

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Главная страница — каталог предложений (`/`). Пока реализована заглушка: вёрстка — P3-10, подключение данных — фаза 5. Готовые виджеты карточки и секций проверяются отдельно в Storybook.

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
