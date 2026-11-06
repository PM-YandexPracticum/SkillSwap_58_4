# src/entities/notification

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Уведомления в колокольчике шапки: «Вы предложили обмен …» → «Перейти»; новые и просмотренные.

## Что внутри

- [`api/`](api/README.md) — загрузка, сохранение, чтение и очистка уведомлений
- [`lib/`](lib/README.md) — вспомогательные функции (даты)
- [`model/`](model/README.md) — типы, слайс, селекторы
- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда

## Использование (P4-07)

```ts
import {
  addNotification, fetchNotifications, markAllRead, clearAllNotifications,
  selectNotifications, selectHasUnread,
} from '@/entities/notification'

await dispatch(fetchNotifications()).unwrap()
await dispatch(addNotification(notification)).unwrap()
await dispatch(markAllRead()).unwrap()
await dispatch(clearAllNotifications()).unwrap()
```

`notification` — полный `Notification` с id, датой и ссылкой на обмен; `userId` — автор предложения, который видит уведомление. `selectNotifications(state)` и `selectHasUnread(state)` учитывают текущую сессию. Для показа ошибки нужны `selectNotificationsError` и `selectNotificationsStatus`.

`createNotification` из `index.ts` — функция сохранения API; одноимённая фабрика тестовых данных — только из `@/entities/notification/testing`.

Панель, строки и кнопки не менялись. Связать селекторы/обработчики с шапкой — P7-05, создать уведомление из сценария предложения обмена — P7-03. Для обработки ошибки вызывающий код использует `.unwrap()` и `try/catch`.
