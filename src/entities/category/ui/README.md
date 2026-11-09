# src/entities/category/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `category` — React-компоненты. Получают данные пропсами или из store через селекторы.

**Текущее состояние:** CategoryIcon реализована (P3-06). CategorySubcategorySelect остаётся заготовкой P3-12/P6-03.

## Что внутри

- `CategoryIcon.tsx` — декоративная SVG из shared/assets, круг 40 px и иконка 24 px; цвет — семантический id категории, неизвестные значения безопасны
- `CategoryIcon.module.css` — размеры и цвета из токенов проекта
- `CategoryIcon.test.tsx` — шесть иконок и неизвестные значения
- `CategoryIcon.stories.tsx` — все категории и запасное нейтральное состояние
- `CategorySubcategorySelect.tsx` — Два связанных списка «Категория» и «Подкатегория» — правило наставника, логика в `lib/linkCategories.ts`: - выбраны категории → в подкатегориях только их подкатегории; ничего не выбрано → все; - выбрана подкатегория → её категория отмечается сама; несогласованных пар не бывает
