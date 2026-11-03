# src/shared/ui/Modal

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Modal**. Модальное окно с затемнением фона. Закрывается по Esc и клику на фон, фокус остаётся внутри окна. Рендер через portal в `document.body`. Содержимое передаётся через `children` — сам `Modal` про заголовки, тексты и кнопки ничего не знает.

## Что внутри

- `Modal.module.css` — стили: `.overlay` (затемнение, blur, центрирование), `.window` (белое окно, скругление, горизонтальный padding)
- `Modal.stories.tsx` — story: `Default` с заголовком, текстом и кнопкой
- `Modal.test.tsx` — тесты: рендер по `isOpen`, Esc, клик по фону, клик по окну
- `Modal.tsx` — модальное окно: портал, Esc, клик по фону, focus trap, возврат фокуса, `role="dialog"`, `aria-modal`, `ariaLabel`
- `index.ts` — публичный API — импортировать снаружи только отсюда
