# src/app/layouts

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Каркасы страниц: обычный (шапка, страница, подвал) и упрощённый для входа и регистрации (логотип и «Закрыть ×»).

## Текущее состояние

Оба лейаута пока выводят только `Outlet`. Header, Footer, Logo и кнопку закрытия подключаем в P3-05. Сам Footer готов в P3-03; Header находится в работе (P3-04). Ниже — состав лейаутов после реализации.

## Что внутри

## Текущее состояние

- `MainLayout` — `Header` (обёрнут, чтобы контент встал в контейнер `--container-width`), `main` с контейнером `--container-width` (1368) по центру, `Footer`.
- `AuthLayout` — полоса с `Logo` и `Button` «Закрыть» (`navigate(-1)`), `main` с узким контейнером `--container-width-narrow` (1136) по центру.
