# src/widgets/offers-carousel

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Карусель «Похожие предложения» на странице навыка.

**Текущее состояние:** OffersCarousel показывает переданных пользователей в готовом Carousel и скрывается при пустом списке. Отбор похожих предложений и селектор для него относятся к P7-02.

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
