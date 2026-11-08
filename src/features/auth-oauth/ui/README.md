# src/features/auth-oauth/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `auth-oauth` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `OAuthButtons.tsx` — кнопки «Продолжить с Google» / «Продолжить с Apple» + разделитель «или». Заглушки: по клику ничего не происходит. На странице ставятся над формой входа или шага 1 регистрации (фича не импортирует другие фичи, поэтому собирает их страница)
- `OAuthButtons.module.css` — стили кнопок и разделителя
- `OAuthButtons.stories.tsx` — story по макету
- `OAuthButtons.test.tsx` — тесты: подписи, не отправляют форму, порядок фокуса
