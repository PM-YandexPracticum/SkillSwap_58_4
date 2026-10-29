# .storybook

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../docs/architecture/fsd.md).

## Зачем эта папка

Конфигурация Storybook — витрины компонентов. Сейчас каркас: пакеты ставит задача P1-07. Правила — `docs/rules/storybook.md`.

## Что внутри

- `main.ts` — Конфигурация Storybook — КАРКАС. Пакеты ещё не установлены (задача P1-11 в docs/tasks/phases/phase-01-preparation.md). После установки добавить тип: `import type { StorybookConfig } from '@storybook/react-vite'` и написать `const config: StorybookConfig = { ... }`
- `preview.ts` — Общие настройки всех stories — КАРКАС (пакеты ставит задача P1-11). После установки: `import type { Preview } from '@storybook/react'` и `const preview: Preview = { ... }`
