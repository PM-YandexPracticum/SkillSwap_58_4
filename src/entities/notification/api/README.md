# src/entities/notification/api

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **api** слайса `notification` — единственное место, которое знает, откуда берутся данные (сейчас — «база» `shared/api/mock-db`). Переход на настоящую БД — меняется только этот сегмент.

## Что внутри

- `notificationApi.ts` — Хранилище уведомлений. Единственное место, которое знает, откуда берутся данные. Переход на настоящую БД — меняется только этот файл
