# SkillSwap

Платформа обмена навыками.

📚 **Документация команды — [docs/](docs/README.md)**: ТЗ, правила разработки, архитектура, задачи.
📋 **Канбан-доска задач — [GitHub Project #133](https://github.com/orgs/PM-YandexPracticum/projects/133/views/1)**, план по фазам — [docs/tasks/roadmap.md](docs/tasks/roadmap.md).
В каждой папке `src/` есть `README.md` с описанием, зачем она нужна и что в ней лежит.

---

## Быстрый старт

```bash
npm install
npm run dev
```

Открой [http://localhost:5173](http://localhost:5173)

---

## State management

Проект использует **Redux Toolkit**. Store настроен в `src/app/store/index.ts`, слайсы подключаются в `src/app/store/rootReducer.ts`.

Для работы со store используй типизированные хуки из `@/shared/lib/store` — `useAppDispatch` и `useAppSelector` вместо оригинальных из react-redux.

---

## Структура проекта (FSD)

Подробно — в [docs/architecture/fsd.md](docs/architecture/fsd.md): правила импортов, структура слайса, карта «макет → код».

```
src/
├── app/            # providers, router (RequireAuth), store, layouts, styles
├── pages/          # catalog, skill, all-skills, favorites, profile, login, register (3 шага), about, not-found, server-error
├── widgets/        # header, footer, categories-menu, filters-panel, offer-card, offers-section,
│                   # offers-carousel, skill-details, notifications-panel, profile-sidebar
├── features/       # auth-by-email, auth-oauth, register, logout, catalog-filter, skill-search,
│                   # favorite-toggle, exchange-propose, notifications-read,
│                   # theme-toggle, profile-edit, avatar-upload, skill-create
├── entities/       # user, skill, category, city, session, exchange, notification
└── shared/         # api, config, lib (hooks, store, helpers), types, ui, assets

src/shared/api/mock-db/
├── createMockCollection.ts   # «база» в браузере: образцы + изменения в localStorage
└── seed/                     # начальные данные: 45 пользователей с навыками, справочники
```

Импорт только вниз: `app → pages → widgets → features → entities → shared`, и только через `index.ts` слайса.

---

## Моки данных

Данные — внутри приложения, в `src/shared/api/mock-db/seed/`: 45 пользователей с навыками и фото, 6 категорий с 42 подкатегориями, 17 городов, образцы обменов и уведомлений. Изменения сохраняются в localStorage.
Читать и писать данные — только через `entities/*/api`: потом этот слой можно заменить на настоящую БД. Демо-вход — в [docs/architecture/fsd.md](docs/architecture/fsd.md).

Структура объектов описана в `model/types.ts` соответствующей сущности: `src/entities/user`, `skill`, `category`, `city`, `exchange`, `notification`.

---

## Доступные скрипты

| Скрипт | Что делает |
|--------|------------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Сборка для продакшена |
| `npm run lint` | Проверка ESLint + Stylelint |
| `npm run lint:fix` | Автоисправление lint-ошибок |
| `npm run format` | Форматирование через Prettier |
| `npm run test` | Запуск тестов |
| `npm run test:watch` | Тесты в watch-режиме |
| `npm run test:coverage` | Отчёт о покрытии тестами. Порог 70 % — цель к финишу (P8-07): пока тестов мало, команда сообщает, что порог не достигнут, — это нормально |
| `npm run e2e` | Автотесты сценариев в браузере (Playwright, папка `e2e/`). Перед первым запуском: `npx playwright install chromium` |
| `npm run storybook` | Storybook — каталог UI-компонентов |
| `npm run build-storybook` | Сборка Storybook |
| `npm run commit` | Коммит по шагам в формате Conventional Commits |
| `npm run verify` | Линтер и тесты — то же, что хук перед push |

**Storybook не запускается на Windows** с ошибкой `ERR_DLOPEN_FAILED`: не хватает системной библиотеки Microsoft.
Установи [Microsoft Visual C++ Redistributable 2015–2022 (x64)](https://aka.ms/vs/17/release/vc_redist.x64.exe) и перезапусти терминал.
`npm ci` и `npm rebuild` здесь не помогают.

---

## Роутинг

Маршруты объявлены в `src/shared/config/routes.ts` → `ROUTES` и `PROFILE_ROUTES`.

Lazy-загрузка уже настроена в `src/app/providers/RouterProvider.tsx`.

Закрытые маршруты (`/profile/*`, `/favorites`) обёрнуты в `RequireAuth`, шаги 2 и 3 регистрации — в `RegisterStepGuard` (оба — `src/app/router/`).

---

## Переменные окружения

Сейчас не нужны: все данные внутри приложения, ключей и адресов серверов нет.
Если понадобятся — `.env.local` (он уже в `.gitignore`), имена переменных начинаются с `VITE_`.

Доступ в коде: `import.meta.env.VITE_APP_TITLE`

---

## Git-процесс

Коротко (подробно — [docs/rules/git-workflow.md](docs/rules/git-workflow.md)):

- работаем от `develop`, `main` не трогаем; одна задача = одна ветка = один PR в `develop`;
- ветка начинается с ID задачи: `feature/p2-02-buttons`;
- одновременно — только одна задача; в коммит — только свои файлы, никогда `git add .`;
- `package.json` и зависимости меняют только тимлид и помощник (задачи 👑);
- коммиты по [Conventional Commits](https://www.conventionalcommits.org/ru/): `feat: …`, `fix: …`;
- PR проверяет и вливает тимлид или помощник.

---

## Проверки качества

CI/CD в проекте нет — всё проверяется локально.
Файл `.github/workflows/ci.yml` из стартового шаблона оставлен как есть: GitHub может показывать его проверки в PR, но мы его не развиваем и на него не опираемся.

| Команда | Что проверяет |
|---|---|
| `npm run lint` | ESLint + Stylelint, в том числе правила импортов FSD — только вниз по слоям и через `index.ts` |
| `npx tsc --noEmit` | типы TypeScript |
| `npm run test` | unit- и компонентные тесты |
| `npm run build` | сборка проходит |

Часть проверок запускается сама (Husky, P1-14): тесты — перед коммитом, линтер и тесты (`npm run verify`) — перед push.
Красные проверки — PR не мержится.
