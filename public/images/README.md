# public/images

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../docs/architecture/fsd.md).

## Зачем эта папка

Фото, на которые ссылаются образцы данных (`avatarUrl`, `images`). Загруженные пользователем фото сюда не попадают — они хранятся как data URL.

## Что внутри

- [`avatars/`](avatars/README.md) — Аватары пользователей из образцов данных
- [`skills/`](skills/README.md) — Фото навыков для галереи на странице навыка
