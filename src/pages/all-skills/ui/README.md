# src/pages/all-skills/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `all-skills` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `AllSkillsPage.tsx` — Страница «Все навыки» (`/skills`) — сюда ведёт ссылка из футера. Шапка, подвал и список категорий с подкатегориями (CategoriesList из widgets/categories-menu). Полностью статичная: ничего не кликается
