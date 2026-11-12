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
| `npm run test:coverage` | отчёт о покрытии; Vitest проверяет порог statements 70 %; отдельно покрытие ядра — P8-07 |

## Что проверяем

| Что | Как | Пример |
|---|---|---|
| Чистые функции (`lib/`) | вход → выход, включая крайние случаи | `getAge`, `applyFilters`, `pluralize` |
| Редьюсеры и селекторы | действие → новое состояние; состояние → результат | `catalogFilterSlice`, `selectIsAuth` |
| Компоненты | **поведение глазами пользователя**: что видно, что происходит после клика | «после клика на сердечко счётчик стал 8» |

**Не проверяем:** стили, классы, порядок `div`'ов, snapshot-тесты, код библиотек.

## Тестовые помощники

### Фабрики данных: `createUser()`, `createSkill()`, `createNotification()`

Возвращают полного валидного пользователя, навык или уведомление. Передаёшь только то поле, которое важно для теста:

```ts
import { createUser } from '@/entities/user/testing'
import { createSkill } from '@/entities/skill/testing'
import { createNotification } from '@/entities/notification/testing'

const user = createUser({ gender: 'female' })
const skill = createSkill({ title: 'Игра на барабанах', authorId: user.id })
const notification = createNotification({ isRead: true })
const list = [createUser({ id: 'u1' }), createUser({ id: 'u2', likesCount: 99 })]
```

- Импорт — из `@/entities/<сущность>/testing`. В `index.ts` под теми же именами лежат функции api, которые пишут в «базу».
- Линтер разрешает `…/testing` только в тестах (`*.test.ts(x)`) и stories (`*.stories.tsx`); в коде приложения фабрик быть не должно.
- У всех пользователей фабрики одинаковый `id` (`u-test`). В списке задавай `id` сам.
- Фабрики используют и stories (см. [storybook.md](storybook.md)). Не копируй куски JSON из `public/db/`.

### `createTestStore`

Для тестов логики с несколькими слайсами используй `createTestStore` из `@/app/test/createTestStore`: это `createAppStore` по разрешённому для тестов FSD-пути. Передавай сессию через `preloadedState`; для проверки перезагрузки создай новый store и загрузи данные API-thunk. Не импортируй `@/app/store` или соседние сущности напрямую из теста сущности.

### `renderWithProviders`

Рендерит компонент вместе с Redux store и роутером. Без них компонент с `useAppSelector` или `<Link>` в тесте падает.

```tsx
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import { SearchInput, selectSearchQuery } from '@/features/skill-search'

const { store, user } = renderWithProviders(<SearchInput />)
await user.type(screen.getByRole('textbox', { name: 'Искать навык' }), '  Барабаны  {Enter}')
expect(selectSearchQuery(store.getState())).toBe('Барабаны')
```

- Для начальных данных передай `preloadedState`; адрес задаётся через `route` (по умолчанию `/`), шаблон маршрута для `useParams` — через `path`.
- Проект использует React Router 7. Если оборачиваешь компонент в `MemoryRouter` сам (тест или story в `shared`), передай только нужные `initialEntries`; отдельные `future`-флаги больше не нужны.
- На каждый вызов создаётся **новый store** (`createAppStore()` из `app/store`), поэтому тесты не влияют друг на друга.
- `user` — уже настроенный `userEvent`, кликать и печатать через него, а не через `fireEvent`.
- Импорт `@/app/test` в тестах нижних слоёв — исключение из правила FSD «только вниз». Линтер разрешает его только в `*.test.ts` и `*.test.tsx`.

## Правила

- **Никаких «сегодня» в тестах.** Дату передавай явно (`getAge(birth, NOW)`), иначе тест сломается через год.
- **Тесты независимы.** Каждый можно запустить отдельно и в любом порядке, общего изменяемого состояния нет.
  После каждого теста `src/setupTests.ts` сам очищает localStorage и вызывает `resetMockDb()` — изменения «базы», сессия и тема в следующий тест не попадают.
- **Ищем элементы, как пользователь:** `getByRole('button', { name: '…' })`, `getByLabelText`, `getByText`. `data-testid` — в крайнем случае.
- «База» в тестах читает файлы `public/db` напрямую (это делает `src/setupTests.ts`), сервер не нужен. Проверить ошибку загрузки — `vi.spyOn(globalThis, 'fetch').mockRejectedValue(…)`.
  Подмена сработает, только пока файл коллекции ещё не скачан: `loadSeed` скачивает его один раз и дальше до конца тестового файла берёт из памяти.
  Поэтому статус `failed` у слайса проверяй через редьюсер: `reducer(state, fetchX.rejected(new Error('…'), 'req'))` — образец в `categoriesSlice.test.ts`.
- Данные «базы» приходят с задержкой (`MOCK_DB.DELAY_MS`). То, что появится после загрузки, ищи через `await screen.findBy…`.
- Одна проверяемая мысль на `it`. Повторяющиеся случаи — таблицей через `it.each` (см. образец).
- Тест сначала должен упасть: сломай код на секунду и убедись, что тест это заметил.
