# src/pages

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../docs/architecture/fsd.md).

## Зачем эта папка

Слой **pages** — страницы приложения. Страница = композиция виджетов под конкретный URL, своей логики почти нет.

Маршруты, AuthLayout, MainLayout, RequireAuth и RegisterStepGuard готовы. Реализованы «Все навыки» (P3-06), каталог и страница навыка (P3-10, P7-01), вёрстка входа и шагов 1–3 регистрации с предпросмотром предложения (P3-11…P3-13), «О проекте», 404 и 500 (P3-16). Профиль свёрстан в P3-14; сохранение остаётся в P7-06. Избранное пока заготовка; формы регистрации ещё не подключены к черновику и сохранению. Бизнес-вход и сохранение остаются в задачах фаз 4–7; стартовую загрузку общих данных выполняет `DataProvider`.

## Что внутри

- [`about/`](about/README.md) — Страница «О проекте» (`/about`) — команда проекта: фото, роли, GitHub
- [`all-skills/`](all-skills/README.md) — Страница «Все навыки» (`/skills`) — ссылка из футера
- [`catalog/`](catalog/README.md) — Главная страница — каталог предложений (`/`)
- [`favorites/`](favorites/README.md) — Избранное (`/favorites`, только для вошедших): люди из `likedUserIds` текущего пользователя
- [`login/`](login/README.md) — Вход (`/login`)
- [`not-found/`](not-found/README.md) — Ошибка 404 — любой неизвестный URL
- [`profile/`](profile/README.md) — Личный кабинет (`/profile/*`): раздел с формой — «Личные данные»; «Заявки», «Мои обмены», «Избранное», «Мои навыки» — заглушки
- [`register/`](register/README.md) — Регистрация — три маршрута `/register/step-1…3` с общей рамкой (Stepper + иллюстрация)
- [`server-error/`](server-error/README.md) — Ошибка 500 (`/500`)
- [`skill/`](skill/README.md) — Страница навыка (`/skill/:id`)

## Правило импортов

Страница импортирует widgets, features, entities, shared. Другие страницы — нельзя.
