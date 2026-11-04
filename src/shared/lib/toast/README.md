# src/shared/lib/toast

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Публичный API уведомлений для компонентов приложения. `ToastProvider` подключён в `App`:

```tsx
import { useToast } from '@/shared/lib/toast'

const { showToast } = useToast()
showToast('Вы предложили обмен Ивану')
```

## Что внутри

- `toastContext.ts` — контекст и типы `ToastItem`, `ToastContextValue`
- `useToast.ts` — возвращает `showToast(message)` и `removeToast(id)`; вне провайдера бросает понятную ошибку
- `useToast.test.ts` — проверяет ошибку вызова вне провайдера; показ и удаление проверяются в `app/providers/ToastProvider.test.tsx`
- `index.ts` — публичный API; импортировать снаружи только отсюда

`showToast` принимает обычный текст. Провайдер присваивает уведомлению внутренний id,
закрывает его через 4000 мс или по крестику. Каждое сообщение имеет собственный таймер.
