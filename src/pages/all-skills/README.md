# src/pages/all-skills

Страница «Все навыки» (`/skills`), P3-06. Сюда ведёт ссылка из Footer.

**Текущее состояние:** P3-06 завершена (PR #165). Страница выводит заголовок и общий CategoriesMenu; предусмотрены загрузка, ошибка с повтором и пустой справочник. Header и Footer подключаются через MainLayout.

## Что внутри

- [`ui/`](ui/README.md) — страница, её стили и тесты.
- `index.ts` — публичный экспорт `AllSkillsPage`.

Страница использует общий CategoriesMenu из `widgets/categories-menu`; Header и Footer предоставляет MainLayout.
Бизнес-логики фильтрации и переходов по подкатегориям нет.
