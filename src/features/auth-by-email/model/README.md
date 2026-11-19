# src/features/auth-by-email/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Схема формы и проверка учётных данных.

## Что внутри

- `login.ts` — Вход только по пользователям, которые есть в «базе» (уже загружены в store): найти пользователя по email (без учёта регистра), сравнить пароль с полем `password`, создать сессию (`dispatch(startSession(user.id))` из `@/entities/session`). Возвращает `true` после создания сессии или `false` при неверной паре
- `schema.ts` — Схема формы входа. На входе проверяем только заполненность и формат — подробные требования к паролю показываем при регистрации. Использует emailField() и requiredPasswordField() из @/shared/lib/validation
