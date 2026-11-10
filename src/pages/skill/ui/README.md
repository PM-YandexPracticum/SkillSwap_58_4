# src/pages/skill/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `skill` — React-компоненты. Получают данные пропсами или из store через селекторы.

**Текущее состояние:** SkillPage подключена к Redux-состоянию: отображает данные навыка и автора, обрабатывает loading/error/404 и передаёт готовые пропсы виджетам. Временная загрузка thunk-ами останется до появления общего DataProvider (P4-04).

## Что внутри

- `SkillPage.tsx` — Страница навыка `/skill/:id`: SkillDetails + OffersCarousel + окно «Вы предложили обмен»; данные из Redux-селекторов, недостающие справочники загружаются thunk-ами
- `SkillPage.stories.tsx`, `SkillPage.test.tsx` — stories и тесты
