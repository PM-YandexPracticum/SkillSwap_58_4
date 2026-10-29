# src/shared/ui/Dropdown

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Dropdown**. Поповер, привязанный к триггеру: «Все навыки», уведомления, меню пользователя.

## Что внутри

- `Dropdown.stories.tsx` — Stories компонента Dropdown — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11; после неё добавить типы: `const meta: Meta<typeof Dropdown>` и `export const Default: StoryObj<typeof meta>`
- `Dropdown.tsx` — Поповер, привязанный к триггеру: «Все навыки», уведомления, меню пользователя
- `index.ts` — публичный API — импортировать снаружи только отсюда
