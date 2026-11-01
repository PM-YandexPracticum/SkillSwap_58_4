# src/shared/ui/Button

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Button**. Кнопка. Варианты из макета: primary (зелёная «Подробнее», «Далее»), secondary (белая с обводкой «Войти»), ghost (текстовая «Смотреть все»).

## Что внутри

- `Button.module.css` — стили: варианты primary, secondary, ghost, состояния hover, нажатие, фокус, disabled
- `Button.stories.tsx` — stories: Primary, Secondary, Ghost, Disabled
- `Button.test.tsx` — тесты: клик, disabled не реагирует, по умолчанию type="button"
- `Button.tsx` — кнопка с текстом. Варианты из макета: primary (зелёная «Подробнее», «Далее»), secondary (белая с обводкой «Войти»), ghost (текстовая «Смотреть все»)
- `index.ts` — публичный API — импортировать снаружи только отсюда
