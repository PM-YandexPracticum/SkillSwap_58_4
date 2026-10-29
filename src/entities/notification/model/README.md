# src/entities/notification/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `notification` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

## Что внутри

- `notificationsSlice.ts` — Уведомления текущего пользователя. TODO: notificationAdded, allMarkedAsRead
- `selectors.ts` — Все уведомления
- `types.ts` — Уведомление в колокольчике шапки. Уведомления номинальные — один вид: «Вы предложили обмен Ивану». «Перейти» открывает карточку Ивана
