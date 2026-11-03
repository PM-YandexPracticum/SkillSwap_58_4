# src/shared/ui/Logo

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Logo**. Логотип SkillSwap (иконка + текст), ведёт на главную.

## Что внутри

- `Logo.tsx` — ссылка на главную с иконкой SkillSwap; текст можно скрыть через `withText={false}`
- `Logo.module.css` — размеры и типографика логотипа по макету (шапка, 1:2870)
- `Logo.test.tsx` — тесты: ссылка на «/», подпись для скринридера без текста
- `Logo.stories.tsx` — с текстом и только иконка; обёрнуты в `MemoryRouter`, потому что внутри `Link`
- `index.ts` — публичный API — импортировать снаружи только отсюда
