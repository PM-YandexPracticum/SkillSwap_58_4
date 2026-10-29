# src/widgets/categories-menu/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `categories-menu` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `CategoriesList.tsx` — Статичный список: 6 категорий с цветными иконками (CategoryIcon), под каждой — подкатегории, в две колонки. Ничего не кликается. Общий для выпадающего меню в шапке и страницы `/skills`
- `CategoriesMenu.tsx` — Кнопка «Все навыки ▾» в шапке и выпадающее окно с CategoriesList (на основе Dropdown). Содержимое статичное — клики по подкатегориям ничего не делают. Закрывается по Esc и клику мимо
