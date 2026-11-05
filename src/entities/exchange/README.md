# src/entities/exchange

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Предложение обмена (номинальное): кто, кому и на какой навык предложил. Принять или отклонить нельзя; второй раз тому же человеку — тоже.

## Что внутри

- [`api/`](api/README.md) — загрузка и сохранение предложений, защита от повторной пары
- [`model/`](model/README.md) — типы, слайс, селекторы
- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда

## Использование (P4-07)

```ts
import { addExchange, fetchExchanges, selectHasProposed } from '@/entities/exchange'

await dispatch(fetchExchanges()).unwrap()
await dispatch(addExchange(exchange)).unwrap()
const hasProposed = selectHasProposed(state, recipientId)
```

`exchange` — полный `Exchange` с id и фиксированной датой создания: сценарий формирует их с помощью `generateId()` и текущего времени. Повторная пара отправитель/получатель запрещена, в том числе после перезагрузки. Вызов обмена вместе с созданием уведомления и toast — P7-03; бейдж на карточке — P7-04.
