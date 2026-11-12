# src/widgets/profile-sidebar

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Боковое меню личного кабинета.

**Текущее состояние:** ProfileSidebar реализован в P3-14 (PR #183). Пять NavLink ведут во вложенные разделы `/profile`; активный пункт задаётся маршрутом. Добавлены CSS Modules, stories и тесты навигации.

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
