# src/shared/ui/Textarea

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Textarea**. Многострочное поле («О себе», описание навыка).

## Что внутри

- `Textarea.stories.tsx` — Stories компонента Textarea — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11; после неё добавить типы: `const meta: Meta<typeof Textarea>` и `export const Default: StoryObj<typeof meta>`
- `Textarea.tsx` — Многострочное поле («О себе», описание навыка)
- `index.ts` — публичный API — импортировать снаружи только отсюда
