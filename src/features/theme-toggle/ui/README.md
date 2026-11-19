# src/features/theme-toggle/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `theme-toggle` — React-компоненты. Получают данные пропсами или из store через селекторы.

**Текущее состояние:** рабочий переключатель светлой и тёмной темы; выбор доступен с клавиатуры и сохраняется между посещениями. Возможность включается флагом `FEATURE_FLAGS.DARK_THEME`.

## Что внутри

- `ThemeToggle.tsx` — кнопка с иконкой луны/солнца и доступной подписью следующего действия
- `ThemeToggle.stories.tsx` — интерактивная история переключения темы
