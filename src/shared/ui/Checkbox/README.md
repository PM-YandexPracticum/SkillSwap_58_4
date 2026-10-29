# src/shared/ui/Checkbox

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Checkbox**. Чекбокс для фильтров «Навыки» и «Город». Поддерживает состояние indeterminate для категории с частично выбранными подкатегориями.

## Что внутри

- `Checkbox.stories.tsx` — Stories компонента Checkbox — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11; после неё добавить типы: `const meta: Meta<typeof Checkbox>` и `export const Default: StoryObj<typeof meta>`
- `Checkbox.tsx` — Чекбокс для фильтров «Навыки» и «Город». Поддерживает состояние indeterminate для категории с частично выбранными подкатегориями
- `index.ts` — публичный API — импортировать снаружи только отсюда
