# src/shared/ui/PasswordInput

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **PasswordInput**. Поле пароля с кнопкой «глаз» для показа/скрытия и подсказкой «Пароль должен содержать не менее 8 знаков».

## Что внутри

- `PasswordInput.stories.tsx` — Stories компонента PasswordInput — пока заглушка; Storybook установлен. При реализации добавить типы: `const meta: Meta<typeof PasswordInput>` и `export const Default: StoryObj<typeof meta>`
- `PasswordInput.tsx` — Поле пароля с кнопкой «глаз» для показа/скрытия и подсказкой «Пароль должен содержать не менее 8 знаков»
- `index.ts` — публичный API — импортировать снаружи только отсюда
