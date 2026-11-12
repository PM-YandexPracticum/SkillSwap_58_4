# src/widgets/profile-sidebar/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `profile-sidebar` — React-компоненты. Получают данные пропсами или из store через селекторы.

**Текущее состояние:** ProfileSidebar реализован в P3-14 (PR #183). Пять NavLink ведут во вложенные разделы `/profile`; активный пункт задаётся маршрутом. Добавлены CSS Modules, stories и тесты навигации.

## Что внутри

- `ProfileSidebar.tsx` — Меню личного кабинета: Заявки, Мои обмены, Избранное, Мои навыки, Личные данные (NavLink с активным пунктом)
