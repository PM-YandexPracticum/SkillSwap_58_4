# src/pages/about/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `about` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `AboutPage.tsx` — «О проекте» (`/about`) — страница команды: сетка карточек участников (фото, имя, роль, GitHub) из `config/team.ts`. Ссылка есть и в шапке, и в футере
