# src/features/auth-by-email/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `auth-by-email` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

**Текущее состояние:** login пока бросает `Not implemented`, схема требует перехода на общие поля; поведение ниже реализуется в P4-09.

## Что внутри

- `login.ts` — Вход только по пользователям, которые есть в «базе» (уже загружены в store): найти пользователя по email (без учёта регистра), сравнить пароль с полем `password`, создать сессию (`dispatch(startSession(user.id))` из `@/entities/session`). При неверной паре — одна общая ошибка «Email или пароль введён неверно» (фрейм Error_wrongLogPass): не подсказываем, что именно неверно
- `schema.ts` — Схема формы входа. На входе проверяем только заполненность и формат — подробные требования к паролю показываем при регистрации. Использует emailField() и requiredPasswordField() из @/shared/lib/validation
