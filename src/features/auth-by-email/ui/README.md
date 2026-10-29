# src/features/auth-by-email/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `auth-by-email` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `LoginForm.tsx` — Форма входа: Email, Пароль (с глазом), кнопка «Войти», ссылка «Зарегистрироваться». react-hook-form + yup
