# src/shared/ui/IllustrationCard

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **IllustrationCard**. Правая половина экранов входа и регистрации: белая карточка с иллюстрацией,
заголовком и текстом по центру. Одна и та же для `/login` и шагов регистрации, поэтому лежит в `shared`,
а не дублируется в двух страницах (страницы не импортируют друг друга).

## Что внутри

- `IllustrationCard.tsx` — компонент и интерфейс `IllustrationCardProps`
- `IllustrationCard.module.css` — стили (CSS Modules)
- `IllustrationCard.test.tsx` — тесты (Vitest + React Testing Library)
- `IllustrationCard.stories.tsx` — stories для Storybook
- `index.ts` — публичный API — импортировать снаружи только отсюда

## Использование

```tsx
import lightBulb from '@/shared/assets/images/light-bulb.svg'
import { IllustrationCard } from '@/shared/ui/IllustrationCard'

<IllustrationCard
  image={lightBulb}
  title="С возвращением в SkillSwap!"
  text="Обменивайтесь знаниями и навыками с другими людьми"
/>
```

## Пропсы

| Проп | Тип | Обязательный | Описание |
|---|---|---|---|
| `image` | `string` | да | Адрес картинки (импорт из `shared/assets/images`) |
| `title` | `string` | да | Заголовок `h2` |
| `text` | `string` | нет | Текст под заголовком |

## Характеристики по макету

| Параметр | Значение |
|---|---|
| Карточка | 556 × 688, фон `--color-bg-secondary`, радиус `--radius-s`, поля 60 px |
| Иллюстрация | 300 × 300, декоративная (`alt=""`) |
| Заголовок | Jost Medium 24 / 28, −1,1 % |
| Текст | Roboto 16 / 24, 2 %, отступ от заголовка 8 px |

## Figma

- [Вход](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2400)
- [Регистрация, шаг 1](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2548)
