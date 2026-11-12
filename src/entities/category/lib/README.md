# src/entities/category/lib

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **lib** слайса `category` — чистые вспомогательные функции. Первые кандидаты на unit-тесты.

**Текущее состояние:** функции `linkCategories.ts` пока бросают `Not implemented` и остаются в P6-03.
`createCategory` и `findSubcategories` реализованы.

## Что внутри

- `createCategory.ts` — фабрика для тестов и stories, импорт через `@/entities/category/testing`.

- `linkCategories.ts` — Какие подкатегории показывать в списке «Подкатегория» — правило наставника: выбраны категории → только их подкатегории; не выбрано ничего → все подкатегории

- `findSubcategories.test.ts` — порядок выбора, отсутствующие id и пустые списки.

- `findSubcategories.ts` — общая подготовка интересов автора по справочнику: сохраняет порядок id,
  пропускает отсутствующие записи. Используется карточкой предложения и страницей навыка.
