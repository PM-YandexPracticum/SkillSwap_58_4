# .storybook

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../docs/architecture/fsd.md).

## Зачем эта папка

Конфигурация работающего Storybook (P1-11, PR #99). Правила — [docs/rules/storybook.md](../docs/rules/storybook.md).

## Что внутри

- `main.ts` — типизированная конфигурация `@storybook/react-vite`: stories из `src/**/*.stories.*`, аддоны a11y, docs и designs.
- `preview.tsx` — общие стили `global.css`, центрирование холста и настройки controls. Тема остаётся в P9-03.

`npm run storybook` запускает каталог на порту 6006; `npm run build-storybook` собирает его. Незавершённые компоненты пока имеют stories-заготовки; состояние самого компонента смотри в его README и плане.
