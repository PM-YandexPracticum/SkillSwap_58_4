# src/features/notifications-read/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `notifications-read` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `MarkAllReadButton.tsx` — Кнопка «Прочитать все»: все новые уведомления переходят в «Просмотренные» и больше не кликаются
