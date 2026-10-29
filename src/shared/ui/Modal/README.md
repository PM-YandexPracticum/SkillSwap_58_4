# src/shared/ui/Modal

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Modal**. Модальное окно с затемнением фона («Ваше предложение создано», превью навыка). Закрывается по Esc и клику на фон. Рендер через portal.

## Что внутри

- `Modal.stories.tsx` — Stories компонента Modal — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11; после неё добавить типы: `const meta: Meta<typeof Modal>` и `export const Default: StoryObj<typeof meta>`
- `Modal.tsx` — Модальное окно с затемнением фона («Ваше предложение создано», превью навыка). Закрывается по Esc и клику на фон. Рендер через portal
- `index.ts` — публичный API — импортировать снаружи только отсюда
