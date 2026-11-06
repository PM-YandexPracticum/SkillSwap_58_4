# src/shared/ui/MultiSelect

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **MultiSelect**. Выпадающий список с чекбоксами — множественный выбор. В закрытом виде выглядит как Select, показывает выбранные значения (лишние — «+N»).

## Что внутри

- `MultiSelect.stories.tsx` — Stories компонента MultiSelect — пока заглушка; Storybook установлен. При реализации добавить типы: `const meta: Meta<typeof MultiSelect>` и `export const Default: StoryObj<typeof meta>`
- `MultiSelect.tsx` — Выпадающий список с чекбоксами — множественный выбор. В закрытом виде выглядит как Select, показывает выбранные значения (лишние — «+N»)
- `index.ts` — публичный API — импортировать снаружи только отсюда
