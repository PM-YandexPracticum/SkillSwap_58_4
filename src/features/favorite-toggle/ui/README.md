# src/features/favorite-toggle/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `favorite-toggle` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `FavoriteButton.tsx` — Сердечко со счётчиком лайков (`likesCount`) на карточке и странице навыка. Закрашено, если пользователь есть в `likedUserIds` текущего пользователя. Себя лайкнуть нельзя. Гость → регистрация (`/register/step-1`) с запоминанием страницы, после «Готово» — возврат обратно
