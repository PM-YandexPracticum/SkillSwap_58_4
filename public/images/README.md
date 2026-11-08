# public/images

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../docs/architecture/fsd.md).

## Зачем эта папка

Фото образцов данных (`avatarUrl`, `images`) и участников команды (`TEAM.photoUrl`). Загруженные пользователем фото сюда не попадают — они хранятся как data URL.

## Что внутри

- [`avatars/`](avatars/README.md) — Аватары пользователей из образцов данных
- [`skills/`](skills/README.md) — Фото навыков для галереи на странице навыка
- [`team/`](team/README.md) — фото участников для страницы «О проекте» (P8-02)
