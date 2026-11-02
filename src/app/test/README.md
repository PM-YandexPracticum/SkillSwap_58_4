# src/app/test

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Помощники, которые нужны только в тестах. В приложение не попадают. Правила — [docs/rules/testing.md](../../../docs/rules/testing.md).

## Что внутри

- `renderWithProviders.tsx` — рендер компонента в тесте вместе с Redux store и роутером
- `renderWithProviders.test.tsx` — проверка помощника и образец теста компонента
