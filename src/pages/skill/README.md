# src/pages/skill

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Страница навыка (`/skill/:id`).

**Текущее состояние:** SkillPage собирает страницу из `SkillDetails`, `OffersCarousel` и `ExchangeProposedModal`. Общий `DataProvider` загружает данные до открытия маршрута, а страница читает навык, автора и справочники из Redux через селекторы. Для неизвестного навыка открывается 404, ошибка загрузки ведёт на 500, во время переходного состояния показывается `Loader`.

## Что внутри

- [`model/`](model/README.md) — композиция пользователей и навыков для похожих предложений
- [`lib/`](lib/README.md) — чистая сборка данных страницы из сущностей и справочников
- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
