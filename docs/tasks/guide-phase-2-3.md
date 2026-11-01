# Справка по фазам 2–3: что уже готово и что дальше

Коротко: что уже есть в проекте и можно брать в свою задачу, что сейчас в работе и что можно начинать.
Перед стартом задачи загляни сюда — возможно, половина нужного уже сделана. Актуально на **01.11.2026**.

## Уже готово — используй, не делай заново

**Компоненты (`src/shared/ui`)**

- `Button` — `import { Button } from '@/shared/ui/Button'`. Пропсы: `variant` (`primary`, `secondary`, `ghost`), `type` (по умолчанию `button`), `disabled`, `onClick`, `children`. Нужна кнопка «Войти», «Подробнее», «Смотреть все» — бери её.
- `IconButton` — `import { IconButton } from '@/shared/ui/IconButton'`. Пропсы: `ariaLabel` (обязательно), `icon`, `onClick`. Для сердечка, колокольчика, «Закрыть», «поделиться».
- `Avatar` — `import { Avatar } from '@/shared/ui/Avatar'`. Пропсы: `src` (путь из моков или `null`), `alt`, `size` (`sm` 48px — шапка, `md` 100px — карточка, `lg` 244px — профиль).

**Утилиты**

- `resolveImageUrl(path, 'AVATAR' | 'SKILL')` из `@/shared/lib/image` — превращает путь из моков в адрес для `<img>`, без фото подставляет заглушку. Все картинки выводим только через неё.
- `useAppSelector`, `useAppDispatch` из `@/shared/lib/store` — хуки Redux с типами.
- `useDebounce`, `useLocalStorage` из `@/shared/lib/hooks`; `formatDate`, `truncate`, `generateId` из `@/shared/lib/helpers`.

**Стили и ресурсы**

- Токены — `src/app/styles/global.css`, только через `var(...)`:
  - цвета: `--color-text`, `--color-accent`, `--color-accent-strong`, `--color-accent-soft`, `--color-hover`, `--color-disabled`, `--color-error`, `--color-border`, цвета тегов `--color-tag-*`;
  - отступы `--space-4` … `--space-132`, шрифты `--font-main`, `--font-title`, размеры `--font-size-*`, скругления `--radius-s`, `--radius-m`, `--radius-l`.
- Иконки (40 шт.) — `src/shared/assets/icons`, импорт компонентом: `import LikeIcon from '@/shared/assets/icons/like.svg?react'`. Какая иконка где в макете — таблица в README папки. Есть всё для чекбоксов и радиокнопок: `checkbox-empty`, `checkbox-done`, `checkbox-remove`, `radio-empty`, `radio-done`.
- Иллюстрации входа, регистрации, 404 и 500 — `src/shared/assets/images`; фото пользователей и навыков — `public/images`.

**Данные (`src/shared/api/mock-db/seed`)**

- 6 категорий и 42 подкатегории, 17 городов — id в `categories.json` и `cities.json`.
- 31 пользователь с навыками и фото (`sample`, `part-1`, `part-3`); ещё 14 добавит P1-07.

**Библиотеки и инструменты**

- Календарь `react-datepicker` (для P2-12) и карусель `embla-carousel-react` (для P2-13) уже установлены.
- Тесты: `it`, `expect`, `vi` работают без импорта, иконки `?react` работают и в тестах. Запуск — `npm run test`.
- Storybook — `npm run storybook`. Story оформляем с типами `Meta` и `StoryObj` из `@storybook/react-vite`.
- Линтер сам проверяет правила импортов FSD; коммит по шагам — `npm run commit`.

**Образец, как оформить задачу целиком** — P2-04 Avatar ([PR #116](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/116)): CSS Modules, тесты, 4 story, JSDoc со ссылками на Figma, обновлённый README и понятное описание PR.

## Сейчас в работе

Не берём — уже заняты:

- P2-01 Logo и Loader — на правках после ревью;
- P2-05 Input и Textarea, P2-07 Checkbox и RadioGroup;
- P2-11 Stepper;
- P1-04 тестовые помощники — после неё станут доступны P2-15, P2-16 и P3-01.

Актуальный список с исполнителями — в [отчёте](report.md#сейчас-в-работе).

## Можно брать сейчас

Все зависимости готовы, исполнителя нет:

- **P2-03 Tag и плашка** 🟢 — иконка крестика `cross.svg` и цвета тегов `--color-tag-*` уже есть;
- **P2-08 Dropdown** 🟡 — от него зависят Select, MultiSelect, шапка и уведомления, поэтому он важнее остальных;
- **P2-10 Modal** 🟡 — кнопку «Закрыть» бери готовую: `IconButton` с иконкой `cross`;
- **P2-13 Carousel** 🟡 — на `embla-carousel-react`, стрелки — `IconButton` с иконкой `chevron-right` (влево — поворот на 180°);
- **P2-14 FileDropzone** 🟡 — иконка `gallery-add` уже есть;
- **P2-18 Toast** 🟡 — крестик — `IconButton` с `cross`.

## Что дальше

**Фаза 2 ждёт:**

- P2-06 PasswordInput и P2-12 DatePicker — после Input (P2-05);
- P2-09 Select — после Input и Dropdown; P2-17 MultiSelect — после Checkbox и Dropdown;
- P2-15 лента с догрузкой и P2-16 правила валидации — после P1-04.

**Фаза 3** открывается по мере готовности компонентов. Первыми станут доступны:

- P3-03 подвал — после Logo (P2-01);
- P3-07 панель фильтров — после Checkbox и RadioGroup (P2-07);
- P3-15 уведомления — после Dropdown (P2-08);
- P3-01 карточка пользователя — после Tag (P2-03) и P1-04.

Шапка (P3-04) ждёт Logo, Input и Dropdown, а за ней — лейауты (P3-05) и почти все страницы. Поэтому Dropdown и Logo сейчас самые нужные.

## Перед PR — частые замечания ревью

- `npx prettier --check` по своим файлам (или «форматировать при сохранении» в VS Code — настройки уже в `.vscode/settings.json`);
- тест на основное поведение и story на каждое состояние, у story — ссылка на фрейм Figma;
- JSDoc над компонентом с `@see Figma: 1:XXXX` (id через двоеточие) и короткие описания пропсов;
- README папки описывает то, что в ней реально лежит; старые пометки «ЗАГЛУШКА» и `// TODO` удалены;
- в названии PR — `[ID]`, в описании — строка `Closes #N` ровно в таком виде;
- `package.json` и общие настройки не трогаем — нужна библиотека, пиши тимлиду.
