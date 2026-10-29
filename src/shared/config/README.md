# src/shared/config

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Конфигурация и константы: маршруты, числа каталога, ключи localStorage, настройки «базы», лимиты валидации.

## Что внутри

- `catalog.ts` — Числа каталога, которые назвал наставник. Менять только здесь
- `index.ts` — публичный API — импортировать снаружи только отсюда
- `mockDb.ts` — Настройки «базы данных» в браузере (`shared/api/mock-db`)
- `routes.ts` — Маршруты приложения. В коде — только эти константы, никаких строк '/profile'
- `storageKeys.ts` — Ключи localStorage для состояния браузера. Данные «базы» (пользователи, навыки, обмены…) хранятся под ключами с префиксом `MOCK_DB.STORAGE_PREFIX` — см. `shared/config/mockDb.ts`
- `validation.ts` — Правила валидации всех полей проекта. Одни и те же значения используют yup-схемы форм (`@/shared/lib/validation`) — проверка на входе в форму. Подробно и с текстами ошибок — `docs/rules/validation.md`
