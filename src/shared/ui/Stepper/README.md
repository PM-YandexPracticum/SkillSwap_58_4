# src/shared/ui/Stepper

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Stepper**. Индикатор шагов «Шаг 1 из 3» с полосками прогресса (регистрация).

## Что внутри

- `Stepper.stories.tsx` — Stories компонента Stepper — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11; после неё добавить типы: `const meta: Meta<typeof Stepper>` и `export const Default: StoryObj<typeof meta>`
- `Stepper.tsx` — Индикатор шагов «Шаг 1 из 3» с полосками прогресса (регистрация)
- `index.ts` — публичный API — импортировать снаружи только отсюда
