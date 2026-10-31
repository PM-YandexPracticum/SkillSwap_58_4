# e2e

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../docs/architecture/fsd.md).

## Зачем эта папка

Автотесты главных сценариев на Playwright: робот открывает сайт в браузере и кликает как пользователь. Сценарии пишет задача P8-05.

## Как запустить

1. Один раз поставить браузер: `npx playwright install chromium`.
2. `npm run e2e` — Playwright сам поднимет dev-сервер и прогонит тесты.

Файлы — `*.spec.ts`. Unit-тесты Vitest (`*.test.ts`) лежат рядом с кодом в `src/` и сюда не попадают.

## Что внутри

Пока пусто — сценарии появятся в P8-05.
