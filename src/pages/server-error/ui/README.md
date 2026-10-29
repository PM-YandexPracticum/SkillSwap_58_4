# src/pages/server-error/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `server-error` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `ServerErrorPage.tsx` — Ошибка 500 — тот же компонент, что 404, с другой картинкой и текстом. Показывается из ErrorBoundary при падении. Кнопки: «Сообщить об ошибке» (заглушка) и «На главную». Обязательна по ТЗ, хотя без бекенда её почти не увидеть
