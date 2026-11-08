# src/widgets/categories-menu

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

«Все навыки»: статичный список категорий (`CategoriesList`) и выпадающее меню в шапке (`CategoriesMenu`).

**Текущее состояние:** CategoriesMenu пока возвращает `null`; список категорий, меню и страница `/skills` — P3-06. Описания ниже задают целевую ответственность файлов.

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
