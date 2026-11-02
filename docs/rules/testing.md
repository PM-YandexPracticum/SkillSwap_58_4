# Тесты

Инструменты: **Vitest** (запуск, `describe` / `it` / `expect`), **Testing Library** (рендер компонентов), **jsdom** (браузер в Node).
Настройки — `vitest.config.ts`, `src/setupTests.ts`. Их не трогаем.

**Образец:** [`src/entities/user/lib/getAge.test.ts`](../../src/entities/user/lib/getAge.test.ts) — пиши свои тесты так же.
Образец теста компонента: [`src/app/test/renderWithProviders.test.tsx`](../../src/app/test/renderWithProviders.test.tsx).

## Где лежат и как называются

- Тест лежит **рядом с файлом**, который проверяет: `getAge.ts` → `getAge.test.ts`, `UserCard.tsx` → `UserCard.test.tsx`.
- Отдельной папки `__tests__` нет.
- `describe` — имя функции или компонента, `it` — что должно происходить, по-русски:
  `it('не добавляет год, пока день рождения не наступил')`.

## Как запускать

| Команда | Что делает |
|---|---|
| `npm run test` | все тесты один раз (обязательно перед PR) |
| `npm run test:watch` | перезапуск при сохранении файла — удобно, пока пишешь тест |
| `npx vitest run src/entities/user/lib/getAge.test.ts` | один файл |
| `npx vitest run -t "29 февраля"` | тесты, в названии которых есть текст |
| `npm run test:coverage` | отчёт о покрытии тестами (порог 70 % — цель к финишу) |

## Что проверяем

| Что | Как | Пример |
|---|---|---|
| Чистые функции (`lib/`) | вход → выход, включая крайние случаи | `getAge`, `applyFilters`, `pluralize` |
| Редьюсеры и селекторы | действие → новое состояние; состояние → результат | `catalogFilterSlice`, `selectIsAuth` |
| Компоненты | **поведение глазами пользователя**: что видно, что происходит после клика | «после клика на сердечко счётчик стал 8» |

**Не проверяем:** стили, классы, порядок `div`'ов, snapshot-тесты, код библиотек.

## Тестовые помощники

### Фабрики данных: `createUser()`, `createSkill()`

Возвращают полного валидного пользователя или навык. Передаёшь только то поле, которое важно для теста:

```ts
import { createUser } from '@/entities/user/testing'
import { createSkill } from '@/entities/skill/testing'

const user = createUser({ gender: 'female' })
const skill = createSkill({ title: 'Игра на барабанах', authorId: user.id })
const list = [createUser({ id: 'u1' }), createUser({ id: 'u2', likesCount: 99 })]
```

- Импорт — из `@/entities/<сущность>/testing`. В `index.ts` под теми же именами лежат функции api, которые пишут в «базу».
- Линтер разрешает `…/testing` только в тестах (`*.test.ts(x)`) и stories (`*.stories.tsx`); в коде приложения фабрик быть не должно.
- У всех пользователей фабрики одинаковый `id` (`u-test`). В списке задавай `id` сам.
- Фабрики используют и stories (см. [storybook.md](storybook.md)). Не копируй куски JSON из `seed/`.

### `renderWithProviders`

Рендерит компонент вместе с Redux store и роутером. Без них компонент с `useAppSelector` или `<Link>` в тесте падает.

```tsx
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/app/test/renderWithProviders'

const { store, user } = renderWithProviders(<FavoriteButton userId="u02" />, {
  preloadedState: { session: { session: { userId: 'u01', token: 'test' } } }, // вошедший
  route: '/favorites',                    // адрес страницы, по умолчанию '/'
  // path: ROUTES.SKILL, route: getSkillRoute('s01')  — если компонент читает useParams
})
await user.click(screen.getByRole('button', { name: 'Добавить в избранное' }))
```

- Роутер внутри уже настроен с флагами `ROUTER_FUTURE` из `@/shared/config`. Если оборачиваешь компонент в `MemoryRouter` сам (тест или story в `shared`), передай `future={ROUTER_FUTURE}` — иначе в консоли предупреждения React Router.
- На каждый вызов создаётся **новый store** (`createAppStore()` из `app/store`), поэтому тесты не влияют друг на друга.
- `user` — уже настроенный `userEvent`, кликать и печатать через него, а не через `fireEvent`.
- Импорт `@/app/test` в тестах нижних слоёв — исключение из правила FSD «только вниз». Линтер разрешает его только в `*.test.ts` и `*.test.tsx`.

## Правила

- **Никаких «сегодня» в тестах.** Дату передавай явно (`getAge(birth, NOW)`), иначе тест сломается через год.
- **Тесты независимы.** Каждый можно запустить отдельно и в любом порядке, общего изменяемого состояния нет.
- **Ищем элементы, как пользователь:** `getByRole('button', { name: '…' })`, `getByLabelText`, `getByText`. `data-testid` — в крайнем случае.
- Данные «базы» приходят с задержкой (`MOCK_DB.DELAY_MS`). То, что появится после загрузки, ищи через `await screen.findBy…`.
- Одна проверяемая мысль на `it`. Повторяющиеся случаи — таблицей через `it.each` (см. образец).
- Тест сначала должен упасть: сломай код на секунду и убедись, что тест это заметил.
