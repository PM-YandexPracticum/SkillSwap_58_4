# src/pages/register

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Регистрация — три маршрута `/register/step-1…3` с общей рамкой (Stepper + иллюстрация).

**Текущее состояние:** маршруты и AuthLayout подключены, страницы шагов пока заготовки. Вёрстка — P3-11…P3-13; guard и reducers — P6-01, завершение — P6-06. Описания ниже задают целевую ответственность файлов.

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
