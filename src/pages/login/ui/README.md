# src/pages/login/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `login` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `LoginPage.tsx` — Вход (`/login`) — отдельный маршрут, не модалка. Слева LoginForm (Google/Apple — заглушки), справа иллюстрация «С возвращением в SkillSwap!». «Закрыть ×» — шаг назад по истории. Вход — только по email и паролю из моков
