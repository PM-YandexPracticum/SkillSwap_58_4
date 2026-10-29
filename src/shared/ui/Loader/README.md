# src/shared/ui/Loader

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Loader**. Индикатор загрузки (fallback для Suspense и загрузки моков).

## Что внутри

- `Loader.stories.tsx` — Stories компонента Loader — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11; после неё добавить типы: `const meta: Meta<typeof Loader>` и `export const Default: StoryObj<typeof meta>`
- `Loader.tsx` — Индикатор загрузки (fallback для Suspense и загрузки моков)
- `index.ts` — публичный API — импортировать снаружи только отсюда
