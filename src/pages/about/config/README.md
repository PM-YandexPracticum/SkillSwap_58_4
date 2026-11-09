# src/pages/about/config

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Данные страницы «О проекте»: список участников команды (`team.ts`). Каждый добавляет себя сам.

## Что внутри

- `team.ts` — тип `TeamMember` и массив `TEAM`. Приняты вклады Дианы (`pwkdmc`, PR #159, `/images/team/t0.jpg`) и Андрея (`viceede`, PR #168, `/images/team/t1.jpg`). Страница уже отображает обе записи (P3-16). Остальные участники добавляют себя в P8-02; общая issue остаётся открытой.
