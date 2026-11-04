# src/entities/notification/lib

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **lib** слайса `notification` — чистые вспомогательные функции. Первые кандидаты на unit-тесты.

## Что внутри

- `formatNotificationDate.ts` — дата уведомления в формате макета 1:2190: «Сегодня», «Вчера» или «22 октября» (без года). Сравнивает календарные дни, а не прошедшее время; второй аргумент `now` — для тестов с фиксированным временем.
- `formatNotificationDate.test.ts` — тесты Vitest с фиксированным «сейчас»: сегодня, вчера, граница месяца, старые даты без года.
- `createNotification.ts` — фабрика уведомления для тестов и stories. Значения по умолчанию — нейтральные, не копии из `public/db` (правило `docs/rules/testing.md`). Экспортируется через `entities/notification/testing.ts`.
