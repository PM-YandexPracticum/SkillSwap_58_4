# src/features/theme-toggle/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `theme-toggle` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

## Что внутри

- `useTheme.ts` — ⭐ Необязательная фича (фаза 9, флаг `FEATURES.DARK_THEME`). Текущая тема и переключатель. Пишет `data-theme` на <html> и сохраняет в localStorage. Тёмные токены уже заготовлены в app/styles/global.css
