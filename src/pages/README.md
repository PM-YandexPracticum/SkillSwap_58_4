# src/pages

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../docs/architecture/fsd.md).

## Зачем эта папка

Слой **pages** — страницы приложения. Страница = композиция виджетов под конкретный URL, своей логики почти нет.

Маршруты, AuthLayout, MainLayout и RequireAuth готовы. Реализованы «Все навыки» (P3-06), вёрстка входа и шага 1 с общей рамкой регистрации (P3-11), «О проекте», 404 и 500 (P3-16). Каталог, навык, избранное, профиль и формы шагов 2–3 пока заготовки. Бизнес-вход, загрузка при старте и сохранение остаются в задачах фаз 4–7; подробности — в README экранов.

## Что внутри

- [`about/`](about/README.md) — Страница «О проекте» (`/about`) — команда проекта: фото, роли, GitHub
- [`all-skills/`](all-skills/README.md) — Страница «Все навыки» (`/skills`) — ссылка из футера
- [`catalog/`](catalog/README.md) — Главная страница — каталог предложений (`/`)
- [`favorites/`](favorites/README.md) — Избранное (`/favorites`, только для вошедших): люди из `likedUserIds` текущего пользователя
- [`login/`](login/README.md) — Вход (`/login`)
- [`not-found/`](not-found/README.md) — Ошибка 404 — любой неизвестный URL
- [`profile/`](profile/README.md) — Личный кабинет (`/profile/*`): рабочий раздел — «Личные данные»; «Заявки», «Мои обмены», «Избранное», «Мои навыки» — заглушки
- [`register/`](register/README.md) — Регистрация — три маршрута `/register/step-1…3` с общей рамкой (Stepper + иллюстрация)
- [`server-error/`](server-error/README.md) — Ошибка 500 (`/500`)
- [`skill/`](skill/README.md) — Страница навыка (`/skill/:id`)

## Правило импортов

Страница импортирует widgets, features, entities, shared. Другие страницы — нельзя.
