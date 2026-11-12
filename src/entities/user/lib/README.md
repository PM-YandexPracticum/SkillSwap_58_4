# src/entities/user/lib

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **lib** слайса `user` — чистые вспомогательные функции. Первые кандидаты на unit-тесты.

## Что внутри

- `getAge.ts` — совместимый экспорт единого расчёта возраста из `shared/lib/validation`
- `getAge.test.ts` — тест-образец для всей команды ([docs/rules/testing.md](../../../../docs/rules/testing.md))
- `createUser.ts` — фабрика тестового пользователя для тестов и stories (снаружи — через `testing.ts`)

- `normalizeEmail.ts` — единое сравнение email в селекторе и ограничении записи: без регистра и краевых пробелов
