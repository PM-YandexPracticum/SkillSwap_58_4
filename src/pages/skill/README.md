# src/pages/skill

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Страница навыка (`/skill/:id`).

**Текущее состояние:** SkillPage собирает страницу из `SkillDetails`, `OffersCarousel` и `ExchangeProposedModal`. Навык, автора и справочники страница читает из Redux через селекторы и при необходимости запускает загрузочные thunk-и до появления общего DataProvider (P4-04). Для неизвестного навыка открывается 404, ошибка загрузки ведёт на 500, во время загрузки показывается `Loader`.

## Что внутри

- [`lib/`](lib/README.md) — чистая сборка данных страницы из сущностей и справочников
- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
