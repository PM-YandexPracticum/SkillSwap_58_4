# src/entities/category

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Категории и подкатегории навыков («Творчество и искусство» → «Музыка и звук»). Справочник для меню «Все навыки», фильтров и цвета чипов.

**Текущее состояние:** API, загрузочный thunk и селекторы готовы (P4-02). CategoryIcon и CategorySubcategorySelect пока возвращают `null`; linkCategories бросает `Not implemented`. Иконка — P3-06, вёрстка пары списков — P3-12, связь — P6-03.

## Что внутри

- [`api/`](api/README.md) — загрузка данных
- [`lib/`](lib/README.md) — чистые функции
- [`model/`](model/README.md) — типы, слайс, селекторы
- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
