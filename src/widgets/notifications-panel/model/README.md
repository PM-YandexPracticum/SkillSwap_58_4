# src/widgets/notifications-panel/model — типы и Redux-логика панели

Здесь — типы виджета и хук чтения уведомлений. Без React-компонентов.

Зачем сегмент: `NotificationWithName` — общий тип панели, его используют `lib/`, `ui/` и `useNotifications`. По [fsd.md](../../../../docs/architecture/fsd.md) сегменты создаются «по необходимости»; в `widgets` этот сегмент первый.

## Что внутри

- `types.ts` — `NotificationWithName`: `Notification` плюс `userName`, готовое имя в дательном падеже. Панель склонений не делает, имя готовит вызывающий код (P3-15, P7-05).
- `useNotifications.ts` — хук панели: читает сессию, уведомления, пользователей, флаг новых уведомлений, статус и ошибку; собирает `NotificationWithName[]` через `buildNotificationsWithNames` и возвращает `notifications`, `hasUnread`, `isLoading`, `error`. Действия («Прочитать все», «Очистить») и навигацию «Перейти» выполняет `MainLayout` — он передаёт обработчики в пропсы панели.
- `useNotifications.test.tsx` — тесты чтения: без сессии не падает и отдаёт пустой список, `hasUnread: false`; вошедшему — только свои уведомления со склонённым именем и `hasUnread: true`; статус `loading` даёт `isLoading: true`. Тесты повтора загрузки добавятся вместе с `fetchNotifications` в хуке (аудит P7-05 от 13.11.2026).

## Тестирование

- Store для теста — `createTestStore` из `@/app/test/createTestStore` (алиас `createAppStore`): импорт `@/app/store` из теста нижнего слоя запрещён FSD-правилом линтера.
- `renderHook` не принимает `renderWithProviders` (тот рендерит компонент), поэтому обёртка своя: `Provider store={store}`, ничего больше не нужно — хук не использует `useToast`, `useNavigate`, `useLocation`.
- `preloadedState` намеренно неполный (`items` без `pendingRequests`, `users` без `saveStatus` и т. п.): тесту важны только поля, которые он читает. Redux дополнит недостающее из `initialState` слайсов в рантайме, а `as never` снимает проверку типов на этом объекте. Полный `RootState` в тесте не собирается — иначе он начнёт ломаться при любом новом поле слайса.

## Открыто на следующие шаги

- Колокольчик виден только вошедшему — `Header.isAuth`, P5-09. Хук обязан выдерживать `session === null`, но UI-скрытие проверяется отдельно, не здесь.
