# src/widgets/skill-details/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `skill-details` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `SkillDetails.tsx` — Верх страницы навыка: UserProfileCard автора (с «О себе», если заполнено в профиле) + SkillInfo + галерея на Carousel. Справа сверху: лайк (FavoriteButton, работает как на карточке), «поделиться» и «⋯» — заглушки, ничего не делают
