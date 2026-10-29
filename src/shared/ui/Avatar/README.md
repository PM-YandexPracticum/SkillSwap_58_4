# src/shared/ui/Avatar

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Avatar**. Круглый аватар пользователя с fallback-инициалами.

## Что внутри

- `Avatar.stories.tsx` — Stories компонента Avatar — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11; после неё добавить типы: `const meta: Meta<typeof Avatar>` и `export const Default: StoryObj<typeof meta>`
- `Avatar.tsx` — Круглый аватар пользователя с fallback-инициалами
- `index.ts` — публичный API — импортировать снаружи только отсюда
