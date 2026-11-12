# src/app/styles

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Глобальные стили: CSS-переменные (цвета, отступы, шрифты) и reset. Заготовка тёмной темы — для необязательной фазы 9.

## Что внутри

- [`fonts/`](fonts/README.md) — шрифты проекта (Jost, Open Sans, Roboto) — локальные файлы WOFF2, не Google Fonts
- `fonts.css` — `@font-face` для шрифтов из `fonts/`; подключён в начале `global.css`
- `global.css` — глобальные стили и CSS-переменные

`--color-overlay` — цвет затемнения Modal; `--shadow-image-action` — тень кнопки поверх фотографии.
Компоненты используют семантические переменные вместо собственных числовых цветов.
