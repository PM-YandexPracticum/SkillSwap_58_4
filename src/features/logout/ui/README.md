# src/features/logout/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `logout` — React-компоненты. Получают данные пропсами или из store через селекторы.

**Текущее состояние:** `LogoutButton` возвращает `null`; подключение готового `endSession()` и перехода — P5-09. Описания ниже задают целевую ответственность файлов.

## Что внутри

- `LogoutButton.tsx` — Пункт «Выйти» в меню пользователя: `dispatch(endSession())` из `@/entities/session` (стирает сессию в store и localStorage) + переход на главную
