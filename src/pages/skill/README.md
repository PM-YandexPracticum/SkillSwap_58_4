# src/pages/skill

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Страница навыка (`/skill/:id`).

**Текущее состояние:** SkillPage пока выводит заголовок и «Страница в разработке». UserProfileCard, SkillInfo и Carousel готовы; сборка страницы — P3-09, данные — P7-01.

## Что внутри

- [`lib/`](lib/README.md) — сборка данных страницы
- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
