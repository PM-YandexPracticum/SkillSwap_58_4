# src/shared/ui/Button

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Button**. Кнопка. Варианты из макета: primary (зелёная «Подробнее», «Далее»), secondary (белая с обводкой «Войти»), ghost (текстовая «Смотреть все»).

## Что внутри

- `Button.stories.tsx` — Stories компонента Button — ЗАГЛУШКА. Пакеты Storybook ставит задача P1-11; после неё добавить типы: `const meta: Meta<typeof Button>` и `export const Default: StoryObj<typeof meta>`
- `Button.tsx` — Кнопка. Варианты из макета: primary (зелёная «Подробнее», «Далее»), secondary (белая с обводкой «Войти»), ghost (текстовая «Смотреть все»)
- `index.ts` — публичный API — импортировать снаружи только отсюда
