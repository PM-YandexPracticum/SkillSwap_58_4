# Storybook

> Storybook установлен в P1-11 вместе с Vite-фреймворком и аддонами a11y, docs и designs.
> Для проверки всех stories запускайте `npm run build-storybook` перед PR.

## Зачем

Наставник: «я крайне рекомендую Storybook — живая документация лишней не бывает; команды, которые отказались, потом жалеют».

Storybook — витрина компонентов. Компонент верстается и проверяется **отдельно от приложения**:
не нужно собирать целую страницу. Если компонент использует Link или store, добавь нужный провайдер в decorator. Ревьюер сверяет story с макетом, не проходя пользовательский сценарий в приложении.

## Где что лежит

```
.storybook/
├── main.ts        # где искать stories, аддоны (docs, a11y), сборщик — Vite
└── preview.tsx    # общее для всех stories: global.css, фон, layout

src/shared/ui/Button/
├── Button.tsx
├── Button.stories.tsx   ← story лежит рядом с компонентом
└── index.ts
```

## Что обязательно

- **Нет story — нет PR** для `src/shared/ui/*` и `src/entities/*/ui/*`.
- Одна story на каждое **состояние из макета**: обычное, hover/focus (если отличается), disabled, ошибка, пустое, заполненное.
  Список нужных состояний уже записан в JSDoc каждой заглушки.
- Название — `слой/сегмент/Компонент`: `shared/ui/Button`, `entities/user/UserCard`.
- Данные — из фабрик тестовых данных (`createUser()`, P1-04), а не скопированные куски JSON.
- В описании story — ссылка на фрейм Figma.
- Вкладка **Accessibility** (аддон a11y) без ошибок.

## Как писать story

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'shared/ui/Button',
  component: Button,
  tags: ['autodocs'],          // страница документации из props и JSDoc
}
export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { variant: 'primary', children: 'Подробнее' } }
export const Secondary: Story = { args: { variant: 'secondary', children: 'Войти' } }
export const Disabled: Story = { args: { variant: 'primary', children: 'Далее', disabled: true } }
```

## Story с настоящими данными из базы

Обычные stories собираем на фабриках (`createUser()`, `createSkill()`) — они одинаковые при каждом запуске.
Если нужно показать компонент на настоящих данных из `public/db`, добавь отдельную story с загрузчиком `loaders`:
Storybook сам скачает файлы базы, а компонент получит готовые пропсы. Образец — story «From Database» в
[`UserCard.stories.tsx`](../../src/entities/user/ui/UserCard.stories.tsx): там же видно, как из данных собираются пропсы карточки.

```tsx
export const FromDatabase: Story = {
  loaders: [async () => ({ card: await loadCardFromDatabase('u01') })],
  render: (args, { loaded }) => <UserCard {...args} {...loaded.card} />,
}
```

Файлы базы в story читаем загрузчиком `loadSeed` из `@/shared/api`: story сущности не может импортировать соседние
сущности, а `shared` доступен всем. В коде приложения так не делаем — там данные идут через `entities/*/api` и store.

## Команды

| Команда | Что делает |
|---|---|
| `npm run storybook` | открыть Storybook на http://localhost:6006 |
| `npm run build-storybook` | проверить, что все stories собираются (делать перед PR) |
