# src/pages/server-error/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `server-error` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `ServerErrorPage.tsx` — Ошибка 500: заголовок, описание, картинка, «Сообщить об ошибке» (заглушка, ничего не делает) и «На главную». Предназначена для показа из `ErrorBoundary` при падении рендера (подключение — вне задачи P3-16)
- `ServerErrorPage.module.css` — стили страницы. Figma (1:2077)
- `ServerErrorPage.stories.tsx` — Storybook: `Default` с `MemoryRouter` и `ROUTER_FUTURE`, ссылка на макет «500» (1:2077)
- `ServerErrorPage.test.tsx` — Vitest: контракт с макетом (заголовок, описание, картинка, две кнопки), защита от копипаста текста 404, переход по «На главную», заглушка «Сообщить об ошибке». Сценария «адрес → 500» нет: страница показывается из `ErrorBoundary`
