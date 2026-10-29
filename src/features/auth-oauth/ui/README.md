# src/features/auth-oauth/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `auth-oauth` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `OAuthButtons.tsx` — Кнопки «Продолжить с Google» / «Продолжить с Apple» + разделитель «или». Заглушки: по клику ничего не происходит
