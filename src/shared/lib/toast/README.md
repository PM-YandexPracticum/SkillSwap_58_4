# src/shared/lib/toast

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Библиотека для управления тостами (уведомлениями) в приложении.
Обеспечивает единый способ показа уведомлений из любой части приложения через хук `useToast`.

## Что внутри

- `toastContext.ts` — Контекст React и типы (`ToastItem`, `ToastContextValue`). Определяет интерфейс API тостов.
- `useToast.ts` — Хук `useToast()`. Гарантирует, что вызов возможен только внутри `<ToastProvider>`, и предоставляет методы `showToast` и `removeToast`.
- `index.ts` — публичный API — импортировать снаружи только отсюда
