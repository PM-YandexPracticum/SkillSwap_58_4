# src/features/theme-toggle

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Переключение светлой / тёмной темы — необязательная фича (фаза 9).

**Текущее состояние:** необязательная фаза 9. `ThemeToggle` возвращает `null`, `useTheme` бросает `Not implemented`; ThemeProvider пропускает children. Описания ниже задают целевую ответственность файлов.

## Что внутри

- [`model/`](model/README.md) — типы, слайс, селекторы
- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
