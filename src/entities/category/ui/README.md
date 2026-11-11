# src/entities/category/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `category` — React-компоненты. Получают данные пропсами или из store через селекторы.

**Текущее состояние:** CategoryIcon реализована (P3-06). CategorySubcategorySelect реализует пару MultiSelect в режиме multiple (P3-12); связь списков — P6-03.

## Что внутри

- `CategoryIcon.tsx` — декоративная SVG из shared/assets, круг 40 px и иконка 24 px; цвет — семантический id категории, неизвестные значения безопасны
- `CategoryIcon.module.css` — размеры и цвета из токенов проекта
- `CategoryIcon.test.tsx` — шесть иконок и неизвестные значения
- `CategoryIcon.stories.tsx` — все категории и запасное нейтральное состояние
- `CategorySubcategorySelect.tsx` — независимые списки с чекбоксами; категории и выбранные значения получает пропсами, Redux не подключает. TODO P6-03 — связь через linkCategories. Режим single добавит P3-13.
- `CategorySubcategorySelect.test.tsx` — выбор подкатегорий, отсутствие мутаций и пустой справочник.
- `CategorySubcategorySelect.stories.tsx` — закрытые и раскрытые списки, заполнение, ошибка и настоящие справочники.
