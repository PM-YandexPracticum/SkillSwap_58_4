# src/shared/ui/RadioGroup

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **RadioGroup**. Группа радиокнопок: «Всё / Хочу научиться / Могу научить», «Пол автора».

## Что внутри

- `RadioGroup.stories.tsx` — Stories компонента RadioGroup — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11; после неё добавить типы: `const meta: Meta<typeof RadioGroup>` и `export const Default: StoryObj<typeof meta>`
- `RadioGroup.tsx` — Группа радиокнопок: «Всё / Хочу научиться / Могу научить», «Пол автора»
- `index.ts` — публичный API — импортировать снаружи только отсюда
