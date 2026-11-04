# src/entities/notification/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `notification` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `NotificationItem.tsx` — строка уведомления: иконка, «Вы предложили обмен {userName}», дата и кнопка «Перейти». Кликабельна только кнопка, у прочитанного её нет; клик передаётся наружу через `onGo`. Figma: «Каталог -» (1:2148).
- `NotificationItem.module.css` — стили строки.
- `NotificationItem.test.tsx` — тесты Vitest + Testing Library: имя получателя, форматированная дата, наличие и отсутствие кнопки по `isRead`, вызов `onGo` по клику.
- `NotificationItem.stories.tsx` — stories Storybook: `Unread` (с кнопкой) и `Read` (без кнопки); данные из локальной фабрики уведомления и `createUser()` из `entities/user/testing`.
