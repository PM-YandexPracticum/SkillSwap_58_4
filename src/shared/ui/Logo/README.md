# src/shared/ui/Logo

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Logo**. Логотип SkillSwap (иконка + текст), ведёт на главную.

## Что внутри

- `Logo.stories.tsx` — Stories компонента Logo — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11; после неё добавить типы: `const meta: Meta<typeof Logo>` и `export const Default: StoryObj<typeof meta>`
- `Logo.tsx` — Логотип SkillSwap (иконка + текст), ведёт на главную
- `index.ts` — публичный API — импортировать снаружи только отсюда
