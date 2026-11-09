# src/widgets/filters-panel

> **SkillSwap** — платформа обмена навыками (React + TypeScript + Redux Toolkit).
> Архитектура — [Feature-Sliced Design](../../../docs/architecture/fsd.md).

## Зачем эта папка

Левая колонка «Фильтры» в каталоге и избранном. В P3-07 реализована вёрстка: панель читает категории и города готовыми селекторами и передаёт их компонентам `catalog-filter`. Выбор пока визуальный; применение фильтров — P5-02. Загрузка справочников принадлежит странице.

## Что внутри

- [`ui/`](ui/README.md) — панель, CSS Modules, истории Storybook и тесты; здесь же описан контракт и границы ответственности.
- `index.ts` — публичный API: `FiltersPanel` и `FiltersPanelProps`.
