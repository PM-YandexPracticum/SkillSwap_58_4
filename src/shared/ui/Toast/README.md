# src/shared/ui/Toast

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Toast**. Уведомление о принятии обмена: сообщение + кнопка закрытия.

## Что внутри

- `Toast.tsx` — Тост: иконка Idea, текст сообщения, кнопка закрытия Cross через `IconButton`.
  Принимает `message` и `onClose`, сам не управляет временем жизни
- `Toast.module.css` — Стили тоста: цвет фона, отступы, позиционирование крестика
- `Toast.stories.tsx` — Stories компонента Toast: `Default` (базовый вид) и
  `AutoDismissDemo` (демо авто-закрытия с таймером 2 секунды для наглядности)
- `index.ts` — публичный API — импортировать снаружи только отсюда
