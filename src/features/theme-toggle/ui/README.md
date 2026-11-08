# src/features/theme-toggle/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `theme-toggle` — React-компоненты. Получают данные пропсами или из store через селекторы.

**Текущее состояние:** необязательная фаза 9. `ThemeToggle` возвращает `null`, `useTheme` бросает `Not implemented`; ThemeProvider пропускает children. Описания ниже задают целевую ответственность файлов.

## Что внутри

- `ThemeToggle.tsx` — Иконка луны/солнца в шапке
