# src/widgets/notifications-panel

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Окно колокольчика: «Вы предложили обмен …» → «Перейти», «Прочитать все», «Очистить». Уведомления номинальные: обмены не подтверждаются, просмотренные не кликаются.
Макет: 1:2190 (окно), 1:2148 (экран с открытой панелью), 1:2239 (после «Прочитать все»), 1:2328 (уведомления в действии).

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
  - `NotificationsPanel.tsx` — окно: «Новые уведомления» + «Прочитать все», ниже «Просмотренные» + «Очистить»; пусто — «Уведомлений пока нет»
  - `NotificationsPanel.module.css` — стили панели
  - `NotificationsPanel.test.tsx` — тесты поведения окна
  - `NotificationsPanel.stories.tsx` — сторис в Storybook
  - `README.md` — описание сегмента
- [`model/`](model/README.md) — типы панели и Redux-логика
  - `types.ts` — `NotificationWithName`
  - `useNotifications.ts` — хук чтения уведомлений, сборка с падежом имени
  - `useNotifications.test.tsx` — 3 теста хука
  - `README.md` — описание сегмента
- [`lib/`](lib/README.md) — чистые функции
  - `buildNotificationsWithNames.ts` — фильтрация по адресату и склонение имени
  - `buildNotificationsWithNames.test.ts`
  - `findSkillId.ts` — поиск навыка адресата для кнопки «Перейти»
  - `findSkillId.test.ts`
  - `README.md` — описание сегмента
- `index.ts` — публичный API — импортировать снаружи только отсюда

## Что ещё предстоит

- Подключение панели в `MainLayout.tsx`: `<Header notifications={<NotificationsPanel … />} />` — слот `notifications` в `Header` уже есть. Действия «Прочитать все» / «Очистить» и навигация «Перейти» передаются панели пропсами из `MainLayout` (P7-05). Сейчас `ui/` — «глупый» компонент с пропсами.
- Загрузка уведомлений — из хука `useNotifications` (через `fetchNotifications`), не через `DataProvider`. Сообщение об ошибке + повтор — по аудиту 13.11.2026.
