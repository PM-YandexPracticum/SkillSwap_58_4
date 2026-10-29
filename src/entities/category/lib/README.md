# src/entities/category/lib

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **lib** слайса `category` — чистые вспомогательные функции. Первые кандидаты на unit-тесты.

## Что внутри

- `linkCategories.ts` — Какие подкатегории показывать в списке «Подкатегория» — правило наставника: выбраны категории → только их подкатегории; не выбрано ничего → все подкатегории
