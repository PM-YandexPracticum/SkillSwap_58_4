# src/pages/login

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Вход (`/login`).

Страница соединяет OAuthButtons, LoginForm и IllustrationCard в общей рамке AuthPageLayout. Внешний AuthLayout предоставляет логотип и закрытие.

Вход выполняет действие `login` из `auth-by-email`: оно проверяет пару по уже загруженным пользователям и создаёт мок-сессию через `startSession`. Страница показывает общую ошибку неверной пары; при редактировании любого поля ошибка снимается. После входа открывается сохранённый внутренний адрес из `location.state.from` с query и hash, без него — каталог.

Проверка сохранённой сессии находится в `app/router/RestoreSession`, после `DataProvider`. Шапка и выход подключаются отдельно в P5-09 и используют общие `selectIsAuth`, `selectCurrentUser` и `endSession`, без собственной проверки существования пользователя.

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
