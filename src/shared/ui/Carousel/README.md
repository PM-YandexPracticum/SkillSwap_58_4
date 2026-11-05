# src/shared/ui/Carousel

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Карусель на `embla-carousel-react` 8: листание и состояние стрелок управляются библиотекой.
Компонент готов в P2-13 ([PR #127](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/127)).
Используется для галереи навыка, превью на шаге 3 регистрации и похожих предложений.

## Что внутри

- `Carousel.tsx` — обёртка Embla; слайды передаются через `children`
- `Carousel.module.css` — стили слайдов и стрелок
- `Carousel.stories.tsx` — галерея с 4, 3 или 1 фото, превью навыка и четыре похожих предложения
- `Carousel.test.tsx` — 6 тестов: слайды, стрелки и их вызовы, disabled, отписка от событий и ширина слайда
- `index.ts` — публичный API: `Carousel` и `CarouselProps`

## Использование

```tsx
import { Carousel } from '@/shared/ui/Carousel'

<Carousel slidesToShow={4} gap={24}>
  {cards}
</Carousel>
```

По умолчанию виден один слайд, интервал 24 px, стрелки включены, зацикливание выключено.
`showArrows` скрывает стрелки, `fullHeight` растягивает карусель на высоту родителя,
`loop` включает зацикливание. `onApiReady` отдаёт API Embla, `onSelect` — индекс активного слайда:
они нужны для синхронизации миниатюр и переключения фото, как в story `Preview`.

Данные, карточки и миниатюры передаёт родитель. Интеграция в страницу навыка, похожие предложения
и превью регистрации выполняется в соответствующих задачах фаз 3, 6 и 7.
