# src/entities/exchange/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `exchange` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

## Что внутри

- `exchangesSlice.ts` — Все обмены текущего пользователя (входящие = «Заявки», исходящие и принятые = «Мои обмены»). Загружаются и сохраняются через `entities/exchange/api` («база» в localStorage). TODO: exchangeAdded — без мутаций; дубль (тот же fromUserId + toUserId) не добавлять
- `selectors.ts` — Все обмены
- `types.ts` — Предложение обмена. По решению наставника обмен «номинальный»: второй стороны нет, предложение только создаётся — статусов «принят / отклонён» не делаем
