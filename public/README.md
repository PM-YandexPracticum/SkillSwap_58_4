# public

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../docs/architecture/fsd.md).

## Зачем эта папка

Статические файлы, которые Vite отдаёт как есть по корневому URL: `/favicon.svg`, фото образцов `/images/...`.

## Что внутри

- [`db/`](db/README.md) — образцы данных «базы»: пользователи, навыки, категории, города, обмены, уведомления
- [`images/`](images/README.md) — Фото, на которые ссылаются образцы данных (`avatarUrl`, `images`)
- `favicon.svg` — иконка вкладки браузера
