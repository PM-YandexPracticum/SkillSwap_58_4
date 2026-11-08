# src/widgets/offers-carousel

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Карусель «Похожие предложения» на странице навыка.

**Текущее состояние:** OffersCarousel пока возвращает `null`; карусель похожих предложений подключается в P7-02 на готовом Carousel. Описания ниже задают целевую ответственность файлов.

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
