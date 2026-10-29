# src/shared/ui/Select

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Select**. Выпадающий список с одним выбором: «Пол» (Не указан / Мужской / Женский), «Город», «Категория», «Подкатегория».

## Что внутри

- `Select.stories.tsx` — Stories компонента Select — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11; после неё добавить типы: `const meta: Meta<typeof Select>` и `export const Default: StoryObj<typeof meta>`
- `Select.tsx` — Выпадающий список с одним выбором: «Пол» (Не указан / Мужской / Женский), «Город», «Категория», «Подкатегория»
- `index.ts` — публичный API — импортировать снаружи только отсюда
