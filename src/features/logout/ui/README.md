# src/features/logout/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `logout` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `LogoutButton.tsx` — Пункт «Выйти» в меню пользователя: clearSession() + dispatch(clearSession) + редирект на каталог
