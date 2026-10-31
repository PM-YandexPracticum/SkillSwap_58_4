# src/shared/ui/Logo

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Logo**. Логотип SkillSwap (иконка + текст), ведёт на главную.

## Состав

- `Logo.tsx` — ссылка на главную с иконкой SkillSwap; текст можно скрыть через `withText={false}`.
- `Logo.css` — размеры и типографика логотипа.
- `Logo.stories.tsx` — варианты с текстом и только с иконкой.
- `index.ts` — публичный API компонента.
