# src/widgets/offer-card/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `offer-card` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `OfferCard.tsx` — Карточка в каталоге: UserCard + FavoriteButton со счётчиком лайков + «Подробнее» → `/skill/:id`. Если текущий пользователь уже предложил этому человеку обмен — вместо «Подробнее» бейдж «Обмен предложен»
