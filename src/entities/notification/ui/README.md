# src/entities/notification/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `notification` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `NotificationItem.tsx` — Строка уведомления: иконка, «Вы предложили обмен Ивану», дата и кнопка «Перейти» — открывает карточку Ивана. Прочитанное уведомление показывается без кнопки и не кликается
