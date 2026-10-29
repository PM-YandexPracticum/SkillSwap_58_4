# src/shared/ui/IconButton

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **IconButton**. Квадратная кнопка-иконка: лайк, тема, колокольчик, поделиться, «Закрыть».

## Что внутри

- `IconButton.stories.tsx` — Stories компонента IconButton — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11; после неё добавить типы: `const meta: Meta<typeof IconButton>` и `export const Default: StoryObj<typeof meta>`
- `IconButton.tsx` — Квадратная кнопка-иконка: лайк, тема, колокольчик, поделиться, «Закрыть»
- `index.ts` — публичный API — импортировать снаружи только отсюда
