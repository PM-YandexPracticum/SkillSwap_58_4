# src/shared/ui/Input

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Input**. Текстовое поле с лейблом, плейсхолдером, текстом ошибки и опциональной иконкой справа (карандаш, календарь).

## Что внутри

- `Input.stories.tsx` — Stories компонента Input — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11; после неё добавить типы: `const meta: Meta<typeof Input>` и `export const Default: StoryObj<typeof meta>`
- `Input.tsx` — Текстовое поле с лейблом, плейсхолдером, текстом ошибки и опциональной иконкой справа (карандаш, календарь)
- `index.ts` — публичный API — импортировать снаружи только отсюда
