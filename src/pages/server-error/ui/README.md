# src/pages/server-error/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `server-error` — React-компоненты. Получают данные пропсами или из store через селекторы.

**Текущее состояние:** страница готова (P3-16): заголовок, описание, картинка и две кнопки («Сообщить об ошибке» — заглушка по ТЗ, «На главную» → `/`).

## Что внутри

- `ServerErrorView.tsx` — общее содержимое страницы 500 на `ErrorPage` и `ErrorActions`, без роутера и store. Получает обработчик «На главную»; «Сообщить об ошибке» остаётся заглушкой
- `ServerErrorPage.tsx` — маршрут `/500`: использует `ServerErrorView` и переходит на главную внутри приложения. Корневой ErrorBoundary использует тот же `ServerErrorView`, но перезагружает приложение, чтобы восстановить упавшие провайдеры
- Стили рамки и действий предоставляет `shared/ui/ErrorPage`. Figma (1:2077)
- `ServerErrorPage.stories.tsx` — Storybook: `Default` с `MemoryRouter`, ссылка на макет «500» (1:2077)
- `ServerErrorPage.test.tsx` — Vitest: контракт с макетом (заголовок, описание, картинка, две кнопки), защита от копипаста текста 404, переход по «На главную», заглушка «Сообщить об ошибке». Прямой маршрут `/500` уже задан в RouterProvider; корневое падение и восстановление проверяются в `app/providers/ErrorBoundary.test.tsx` и `app/App.test.tsx`
