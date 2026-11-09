# src/pages/login

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Вход (`/login`).

**Текущее состояние:** страница свёрстана в P3-11: OAuthButtons, LoginForm и IllustrationCard в общей рамке AuthPageLayout. Внешний AuthLayout предоставляет логотип и закрытие. Проверка данных, вход и возврат на исходный адрес — P4-09.

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
