# src/entities/category

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Категории и подкатегории навыков («Творчество и искусство» → «Музыка и звук»). Справочник для меню «Все навыки», фильтров и цвета чипов.

**Текущее состояние:** API, загрузочный thunk и селекторы готовы (P4-02). CategoryIcon реализована в P3-06: SVG 24 px в круге 40 px с цветом из токенов. CategorySubcategorySelect получает справочник и выбор пропсами: `multiple` использует MultiSelect, `single` — Select. Чистые функции linkCategories связывают списки (P6-03): фильтруют подкатегории, отмечают их категории и убирают подкатегории снятых категорий. Поиск подкатегорий переиспользует findSubcategories.

Тестовые данные: `createCategory` из `@/entities/category/testing` — только для тестов и stories.

## Что внутри

- [`api/`](api/README.md) — загрузка данных
- [`lib/`](lib/README.md) — чистые функции
- [`model/`](model/README.md) — типы, слайс, селекторы
- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
