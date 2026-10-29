# src/pages/favorites/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `favorites` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `FavoritesPage.tsx` — Избранное (`/favorites`, только для вошедших): пользователи из `likedUserIds` текущего пользователя, FiltersPanel работает и здесь, лента с догрузкой по 6. Снятый лайк сразу убирает карточку
