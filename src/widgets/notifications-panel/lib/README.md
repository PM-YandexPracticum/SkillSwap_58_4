# src/widgets/notifications-panel/lib — чистые функции виджета уведомлений

Утилиты без React и Redux. На них пишутся обычные unit-тесты
(`expect(...).toEqual(...)` в `.test.ts`), без `renderWithProviders`.

Зачем это здесь, а не в `ui/`: панель `NotificationsPanel` по P3-15 «глупая»,
она только отображает данные. Сборкой и падежом занимаются эти функции —
их можно тестировать отдельно от React и переиспользовать.

## Что внутри

- `buildNotificationsWithNames.ts` — оставляет только уведомления текущего
  пользователя (фильтр по `userId === currentUserId`) и подставляет
  `userName` в дательном падеже по данным адресата (`toUserId`).
  Использует `formatRecipientName` из `@/shared/lib/formatRecipientName`.

- `buildNotificationsWithNames.test.ts` — тесты: изоляция по владельцу,
  склонение имени, отбрасывание уведомлений без адресата, пустой вход.

- `findSkillId.ts` — по `notification.exchangeId` находит `skillId` навыка
  получателя для кнопки «Перейти» (P7-05: «Перейти» → страница навыка того,
  кому предложили обмен). Возвращает `undefined`, если обмена нет — в этом
  случае обработчик в `MainLayout` не вызывает `navigate`: перехода не будет.

- `findSkillId.test.ts` — тесты: находит нужный обмен по id, возвращает
  `undefined`, если обмена нет.
