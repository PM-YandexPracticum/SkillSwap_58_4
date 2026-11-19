# src/shared/ui/Dropdown

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Dropdown**. Поповер, привязанный к триггеру: «Все навыки», уведомления, меню пользователя.

## Что внутри

- `Dropdown.tsx` — поповер под кнопкой: закрывается по Esc и клику мимо, не вылезает за край окна (отступ 36px, как в макете)
- `Dropdown.module.css` — стили поповера: белый фон, рамка, скругление 12px
- `Dropdown.test.tsx` — тесты: открытие, Esc, клик мимо, сдвиг внутрь окна и снятие обработчика resize
- `Dropdown.stories.tsx` — stories: «Все навыки», уведомления, меню пользователя, закрытое состояние
- `index.ts` — публичный API — импортировать снаружи только отсюда

## Как использовать

```tsx
import { Dropdown } from '@/shared/ui/Dropdown'

const [isOpen, setIsOpen] = useState(false)

<Dropdown
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  align="end" // кнопки справа в шапке; для «Все навыки» не нужен
  trigger={<IconButton onClick={() => setIsOpen((open) => !open)} ... />}
>
  {/* любое содержимое */}
</Dropdown>
```

Открытый поповер пересчитывает сдвиг при изменении ширины окна. Обработчик `resize`
удаляется при закрытии и размонтировании. Слой `--z-popover` находится ниже модального окна.
