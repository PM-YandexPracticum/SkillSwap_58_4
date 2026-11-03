# src/app/styles/fonts

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Шрифты проекта лежат у нас, а не загружаются с Google Fonts: страница не ходит на чужие серверы, шрифты кэшируются
вместе с сайтом и работают без доступа к Google. Подключены в [`../fonts.css`](../fonts.css), тот — в начале `global.css`,
поэтому шрифты есть и в приложении, и в Storybook.

## Что внутри

Файлы WOFF2 с Google Fonts, только наборы символов **кириллица** и **латиница**. Каждый файл переменный (variable):
один файл даёт начертания 400, 500 и 600.

- `jost-cyrillic.woff2`, `jost-latin.woff2` — Jost: логотип и заголовки (`--font-title`)
- `open-sans-cyrillic.woff2`, `open-sans-latin.woff2` — Open Sans: имена пользователей (`--font-name`)
- `roboto-cyrillic.woff2`, `roboto-latin.woff2` — Roboto: основной текст (`--font-main`)

Все шесть файлов — около 155 КБ; браузер скачивает только те, что нужны странице (`unicode-range`).
Шрифты распространяются Google Fonts под свободными лицензиями, которые разрешают размещать их на своём сайте.

## Как добавить начертание или шрифт

Взять адрес CSS с [fonts.google.com](https://fonts.google.com), открыть его в браузере, скачать файлы `woff2`
только для `cyrillic` и `latin` и добавить блоки `@font-face` в `fonts.css` — по образцу уже существующих.
