# src/widgets/skill-details/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `skill-details` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `SkillDetails.tsx` — Верх страницы навыка: UserProfileCard автора + SkillInfo с галереей на Carousel. Данные приходят пропсами (собирает страница). Справа сверху: лайк (FavoriteButton — только вид), «поделиться» и «⋯» — заглушки; кнопка «Предложить обмен» в двух состояниях (`isExchangeProposed`)
- `SkillDetails.stories.tsx`, `SkillDetails.test.tsx` — stories и тесты
