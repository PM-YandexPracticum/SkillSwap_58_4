# src/widgets/offers-carousel/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `offers-carousel` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `OffersCarousel.tsx` — Блок «Похожие предложения» на странице навыка: заголовок + shared/ui/Carousel на 4 карточки; карточку отрисовывает `renderItem` (страница передаёт `OfferCard`), без предложений блок скрыт
- `OffersCarousel.stories.tsx`, `OffersCarousel.test.tsx` — stories и тесты
