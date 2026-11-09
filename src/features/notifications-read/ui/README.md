# src/features/notifications-read/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `notifications-read` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `MarkAllReadButton.tsx` — кнопка «Прочитать все»: новые уведомления переходят в просмотренные и больше не кликаются. В P3-15 вызывает переданный `onClick` (без Redux).
- `MarkAllReadButton.module.css` — локальные стили кнопки: зелёный текст `#508826` и вес 500 по макету 1:2148. Остальная типографика наследуется из `shared/ui/Button`.
- `MarkAllReadButton.test.tsx` — тесты: отрисовка и вызов `onClick`.
- `MarkAllReadButton.stories.tsx` — story для Storybook (`features/notifications-read/MarkAllReadButton`), фрейм 1:2239.
