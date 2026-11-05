# src/widgets/notifications-panel/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `notifications-panel` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `NotificationsPanel.tsx` — Окно колокольчика: «Новые уведомления» + «Прочитать все», ниже «Просмотренные». Уведомления номинальные: «Вы предложили обмен Ивану» + «Перейти» → страница навыка Ивана. Просмотренные — без кнопки, не кликаются. Пусто — «Уведомлений пока нет»
- `NotificationsPanel.module.css` — стили панели: ширина 556 (Figma: 1:2190), секции и заголовки (Figma: 1:2148)
- `NotificationsPanel.stories.tsx` — истории Storybook: новые / просмотренные / смешанные / пусто (Figma: 1:2190, 1:2148)
- `NotificationsPanel.test.tsx` — тесты панели: секции по `isRead`, пустое состояние, обработчики кнопок
