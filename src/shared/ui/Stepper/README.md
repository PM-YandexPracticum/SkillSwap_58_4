# src/shared/ui/Stepper

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Stepper**. Индикатор шагов «Шаг N из 3» с полосками прогресса (регистрация).
Компонент только показывает состояние: текущий шаг приходит через проп `current`,
переходами между шагами управляют страницы регистрации.

## Что внутри

- `Stepper.tsx` — компонент и интерфейс `StepperProps`
- `Stepper.module.css` — стили (CSS Modules)
- `Stepper.test.tsx` — тесты (Vitest + React Testing Library)
- `Stepper.stories.tsx` — stories для Storybook
- `index.ts` — публичный API — импортировать снаружи только отсюда

## Использование

```tsx
import { Stepper } from '@/shared/ui/Stepper'

<Stepper current={2} total={3} />
```

## Пропсы

| Проп | Тип | Обязательный | Описание |
|---|---|---|---|
| `current` | `number` | да | Текущий шаг, начиная с 1 |
| `total` | `number` | да | Всего шагов — по макету регистрации 3 |

Полоски с номером `<= current` получают класс `done`, остальные — `todo`.
Для тестов у каждой полоски есть `data-testid="stepper-line"` и `data-state="done" | "todo"`.

## Характеристики по макету

| Параметр | Значение |
|---|---|
| Заголовок | Jost Medium 24 px / 28 px, letter-spacing −1,1 %, цвет `--color-text` |
| Полоска | 60 × 4 px, радиус 8 px |
| Зазор между полосками | `--space-16` (16 px) |
| Отступ заголовок → полоски | `--space-12` (12 px) |
| Цвет пройденной полоски | `--color-accent` |
| Цвет предстоящей полоски | `--color-disabled` |

## Figma

- Шаг 1 из 3: `1:2548`, `1:2627`
- Шаг 2 из 3: `1:1497`, `1:1541`, `1:1585`, `1:1629`, `1:1673`, `1:1717`
- Шаг 3 из 3: `1:1761`
