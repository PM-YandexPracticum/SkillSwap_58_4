# Справка по фазам 2–3: что уже готово и что дальше

Коротко: что уже есть в проекте и можно брать в свою задачу, что сейчас в работе и что можно начинать.
Перед стартом задачи загляни сюда — возможно, половина нужного уже сделана. Актуально на **06.11.2026**.

## Уже готово — используй, не делай заново

**Компоненты (`src/shared/ui`)**

- `Button` — `import { Button } from '@/shared/ui/Button'`. Пропсы: `variant` (`primary`, `secondary`, `ghost`), `type` (по умолчанию `button`), `disabled`, `onClick`, `children`. Нужна кнопка «Войти», «Подробнее», «Смотреть все» — бери её.
- `IconButton` — `import { IconButton } from '@/shared/ui/IconButton'`. Пропсы: `ariaLabel` (обязательно), `icon`, `onClick`. Для сердечка, колокольчика, «Закрыть», «поделиться».
- `Avatar` — `import { Avatar } from '@/shared/ui/Avatar'`. Пропсы: `src` (путь из моков или `null`), `alt`, `size` (`sm` 48px — шапка, `md` 100px — карточка, `lg` 244px — профиль).
- `Logo` — `import { Logo } from '@/shared/ui/Logo'`. Ссылка на главную, проп `withText` (по умолчанию `true`). Внутри `Link`, поэтому в тестах и stories оборачивай в `MemoryRouter`.
- `Loader` — `import { Loader } from '@/shared/ui/Loader'`. Спиннер «загружается», проп `className` — чтобы поставить его, куда нужно.
- `Dropdown` — `import { Dropdown } from '@/shared/ui/Dropdown'`. Поповер под кнопкой: `trigger`, `isOpen`, `onClose`, `align` (`end` — для кнопок справа в шапке), внутрь — любое содержимое. Состояние `isOpen` хранит родитель; закрывается по Esc и клику мимо, сам не вылезает за край окна. Для меню (шапка, уведомления); для Select и MultiSelect не подходит — у них в макете своя раскрывающаяся рамка (см. P2-09).
- `Stepper` — `import { Stepper } from '@/shared/ui/Stepper'`. «Шаг N из 3» над формой регистрации: `current`, `total`.
- `Tag` — `import { Tag } from '@/shared/ui/Tag'`. Чип навыка: `label`, `color` — id категории (`business`, `creativity`, `languages`, `education`, `health`, `home`) или `more` для «+N»; с `onRemove` появляется крестик — это плашка фильтра. Длинное название обрезается многоточием, полное — в подсказке. `isTagColor(id)` проверяет, есть ли цвет у категории.
- `Input` и `Textarea` — `import { Input } from '@/shared/ui/Input'`, `import { Textarea } from '@/shared/ui/Textarea'`. Подпись `label`, ошибка `error`, декоративная иконка `rightIcon` (карандаш); кликабельная кнопка справа — `rightAction` («глаз», «×» очистки). Работают с `register` из react-hook-form. Высота Input — 48 px, как в макете.
- `Checkbox` и `RadioGroup` — `import { Checkbox } from '@/shared/ui/Checkbox'`, `import { RadioGroup } from '@/shared/ui/RadioGroup'`. Управляемые: `checked` / `value` и `onChange`; у Checkbox есть `indeterminate` — частичный выбор категории; у RadioGroup — заголовок группы `label` и стрелки с клавиатуры.
- `Modal` — `import { Modal } from '@/shared/ui/Modal'`. Обёртка: `isOpen`, `onClose`, `children` и обязательный `ariaLabel`. Esc и клик по фону закрывают, фокус остаётся внутри; внутренние отступы задаёт содержимое.
- `FileDropzone` — `import { FileDropzone } from '@/shared/ui/FileDropzone'`. Зона «Перетащите или выберите изображения»: отдаёт `File[]` в `onFiles`, превью (`previews`) и ошибку (`error`) получает пропсами — проверку файлов делает форма.
- `Carousel` — `import { Carousel } from '@/shared/ui/Carousel'`. Обёртка над Embla: слайды через `children`, `slidesToShow`, `gap`, `showArrows`, `fullHeight`, `loop`; `onApiReady` и `onSelect` — для галереи и миниатюр. Stories показывают галерею, превью навыка и четыре похожих предложения.
- `Toast` — показывай через `const { showToast } = useToast()` из `@/shared/lib/toast`: `showToast('Вы предложили обмен Ивану')`. `ToastProvider` уже подключён в App; крестик и автоисчезновение через 4 с готовы. Создание обмена и вызов из бизнес-сценария — P7-03.

**Блоки (`src/entities`)**

- `UserCard` — `import { UserCard } from '@/entities/user'`. Карточка каталога: `user`, `cityName`, `teachSkill`, `learnSubcategories`, слоты `topAction` (лайк) и `bottomAction` («Подробнее»). Задача-образец — P3-01 ([PR #133](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/133)).
- `UserProfileCard` из `@/entities/user` — карточка автора с `user`, `cityName`, `teachSkill`, `learnSubcategories`. `SkillInfo` из `@/entities/skill` — `skill` (название, описание, изображения), `categoryTitle`, `subcategoryTitle`, объект `actions` со слотами `like`, `createOffer`, `share`, `more`. Галерея уже внутри `SkillInfo`; сборка страницы — P3-09. Готовы в [PR #150](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/150).
- `UserSummary` — блок «аватар + имя + город, возраст» для карточки автора (P3-02); `SkillTag` из `@/entities/skill` — чип навыка в цвете категории.
- Сессия (P4-05): `selectIsAuth`, `selectSession`, вход `startSession(userId)` и выход `endSession()` из `@/entities/session` — каждое сразу меняет store и localStorage.
- Защита страниц (P4-08): `RequireAuth` закрывает `/profile/*` и `/favorites`, отправляет гостя на вход с `replace` и полным `state.from`; возврат после входа — P4-09.
- Справочники в store (P4-02): `fetchCategories`, `selectSubcategoryById`, `selectCategoryBySubcategoryId`, `selectCategoryColor` из `@/entities/category`; `fetchCities`, `selectCityById` из `@/entities/city`.

**Блоки (`src/widgets`)**

- `OfferCard` — `import { OfferCard } from '@/widgets/offer-card'`: принимает `PublicUser`, читает справочники из store, собирает UserCard со счётчиком лайков и ссылкой на навык. Сердечко пока без действия — логику добавит P5-07.
- `OffersSection` — `import { OffersSection } from '@/widgets/offers-section'`: `title`, `users`, `mode`, `renderItem`; сетка по три, в режиме `expandable` раскрытие 3 ⇄ 9 уже работает, в `infinite` выводятся все переданные карточки (догрузка — P5-06). Страница передаёт `renderItem={(user) => <OfferCard user={user} />}`. Пример — story `app/CatalogSections`, [PR #142](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/142).
- `Footer` — `import { Footer } from '@/widgets/footer'`: логотип, `/about`, `/skills`, четыре неинтерактивные заглушки и копирайт. Компонент готов; подключение в MainLayout — P3-05. Для stories и тестов нужен роутер.
- `NotificationsPanel` — `import { NotificationsPanel } from '@/widgets/notifications-panel'`: содержимое окна колокольчика с секциями новых и просмотренных уведомлений, пустым состоянием и callback-пропсами. `NotificationItem` и `MarkAllReadButton` готовы; хранение готово в P4-07, подключение к Header относится к P7-05.

**Утилиты**

- `resolveImageUrl(path, 'AVATAR' | 'SKILL')` из `@/shared/lib/image` — превращает путь из моков в адрес для `<img>`, без фото подставляет заглушку. Все картинки выводим только через неё.
- `validateImageFile(file)` из `@/shared/lib/validation` — тип и размер картинки (текст ошибки или `null`); `fileToDataUrl(file)` из `@/shared/lib/image` — уменьшает фото до 800 px и отдаёт data URL для сохранения.
- `pluralize(n, ['год', 'года', 'лет'])` из `@/shared/lib/pluralize` — склонение слова после числа.
- `useAppSelector`, `useAppDispatch` из `@/shared/lib/store` — хуки Redux с типами.
- «База данных» в браузере (P4-01, P4-10) — данные берём только через `entities/*/api` (`getUsers()`, `getSkills()`…): ответ приходит через ~300 мс, изменения сохраняются в localStorage. Напрямую в localStorage и в файлы `public/db` не ходим.
- Правила полей для форм — `emailField()`, `passwordField()`, `nameField()`, `birthDateField()`, `textField(min, max)`, `cityField(cityIds)` из `@/shared/lib/validation` (yup, тексты ошибок как в `validation.md`).
- `useDebounce`, `useLocalStorage`, `useClickOutside` из `@/shared/lib/hooks`; `formatDate`, `truncate`, `generateId` из `@/shared/lib/helpers`.

**Стили и ресурсы**

- Токены — `src/app/styles/global.css`, только через `var(...)`:
  - цвета: `--color-text`, `--color-accent`, `--color-accent-strong`, `--color-accent-soft`, `--color-hover`, `--color-disabled`, `--color-error`, `--color-border`, цвета тегов `--color-tag-*`;
  - отступы `--space-4` … `--space-132`, шрифты `--font-main`, `--font-title`, размеры `--font-size-*`, скругления `--radius-s`, `--radius-m`, `--radius-l`.
- Иконки (40 шт.) — `src/shared/assets/icons`, импорт компонентом: `import LikeIcon from '@/shared/assets/icons/like.svg?react'`. Какая иконка где в макете — таблица в README папки. Есть всё для чекбоксов и радиокнопок: `checkbox-empty`, `checkbox-done`, `checkbox-remove`, `radio-empty`, `radio-done`.
- Иллюстрации входа, регистрации, 404 и 500 — `src/shared/assets/images`; фото пользователей и навыков — `public/images`.

**Данные (`public/db`)**

- 6 категорий и 42 подкатегории, 17 городов — id в `categories.json` и `cities.json`.
- 45 пользователей с навыками и фото (`users.json`, `skills.json`); навыки есть в 38 подкатегориях из 42 (нет в «Резюме и собеседование», «Актёрское мастерство», «Креативное письмо», «Арт-терапия»).

**Библиотеки и инструменты**

- Календарь `react-datepicker` (для P2-12) и карусель `embla-carousel-react` (для P2-13) уже установлены.
- Тесты: `it`, `expect`, `vi` работают без импорта, иконки `?react` работают и в тестах. Запуск — `npm run test`. Правила и примеры — [testing.md](../rules/testing.md), образец — `getAge.test.ts`.
- Тестовые данные: `createUser()` из `@/entities/user/testing`, `createSkill()` из `@/entities/skill/testing` и `createNotification()` из `@/entities/notification/testing` — полный объект нужной сущности, меняешь только нужное поле. Только в тестах и stories.
- `renderWithProviders` из `@/app/test/renderWithProviders` — рендер в тесте со store и роутером, если в компоненте `useAppSelector`, `<Link>` или `useParams`. Только в тестах.
- Storybook — `npm run storybook`. Story оформляем с типами `Meta` и `StoryObj` из `@storybook/react-vite`.
- Линтер сам проверяет правила импортов FSD; коммит по шагам — `npm run commit`.

**Образец, как оформить задачу целиком** — P2-04 Avatar ([PR #116](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/116)): CSS Modules, тесты, 4 story, JSDoc со ссылками на Figma, обновлённый README и понятное описание PR. Для блока с данными — P3-01 UserCard ([PR #133](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/133)): данные пропсами, story на настоящих данных из базы.
Как сделать живые stories с состоянием (кнопка открывает, Esc закрывает) — `Dropdown.stories.tsx` ([PR #119](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/119)).

## Сейчас в работе

Не берём — уже назначены:

- P2-06 PasswordInput, P2-09 Select, P2-12 DatePicker, P2-15 Лента с догрузкой, P2-17 MultiSelect;
- P3-04 Шапка, P3-07 Панель фильтров, P3-09 Страница навыка;
- P7-04 «Обмен предложен» на карточке;
- P4-03 Пользователи и навыки.

P2-17 уже в In Progress у `Laurovsky` и ждёт влития Select (P2-09). Ожидание зависимости не возвращает взятую задачу в Backlog.
Актуальный список с исполнителями — в [отчёте](report.md#сейчас-в-работе).

## Можно брать сейчас

Свободных задач MVP с готовыми зависимостями на 06.11.2026 нет. **P7-04 «Обмен предложен» на карточке** 🟢 уже взята `alicevdr` и находится в In Progress; P3-08 и P4-07 готовы.

**P4-07 Обмены и уведомления** завершена: API и Redux сохраняют обмены и уведомления, а операции чтения и очистки учитывают текущую сессию.

Новых свободных задач MVP для переноса из Backlog в Todo сейчас нет. P3-09 уже в In Progress у `sosolet`, все её зависимости готовы. P3-05 (ждёт P3-04), P4-06 и P5-01 (обе ждут P4-03) возвращены в Backlog; P2-17 остаётся в In Progress у `Laurovsky` и ждёт Select (P2-09). Todo пуст; P7-04 уже в работе. Полный список ближайших разблокировок — в [отчёте](report.md#готовность-к-todo).

## P4-07 — готово для следующих задач

Эти операции доступны следующим задачам:

- `@/entities/exchange`: `fetchExchanges()`, `addExchange(exchange)`, `selectExchanges` и `selectHasProposed(state, otherUserId)`. Повторный обмен от того же пользователя тому же получателю запрещён.
- `@/entities/notification`: `fetchNotifications()`, `addNotification(notification)`, `markAllRead()`, `clearAllNotifications()`, `selectNotifications` и `selectHasUnread`. Селекторы показывают данные только текущего пользователя; чтение и очистка берут владельца из сессии.
- Подключение сценария обмена/toast — P7-03, бейджа — P7-04, панели и колокольчика — P7-05. P7-04 уже в работе у `alicevdr`: P3-08 и P4-07 готовы. P7-03 и P7-05 дополнительно ждут остальные зависимости из [фазы 7](phases/phase-07-skill-profile.md).

## Что дальше

**Фаза 2 ждёт:**

- P2-17 MultiSelect — после Select (P2-09): устроен так же, как открытый Select, пункты — `Checkbox`.

**Фаза 3** открывается по мере готовности компонентов. Текущее состояние и ближайшие зависимости:

- P3-05 лейауты — после шапки (P3-04); подвал (P3-03) уже готов; за ними «Все навыки» (P3-06), «О проекте», 404 и 500 (P3-16), вход и регистрация (P3-11);
- P3-09 страница навыка уже в работе: P3-02, P3-08, Carousel и Modal готовы;
- P3-10 каталог — после панели фильтров P3-07 и лейаутов P3-05; карточка и секция P3-08 уже готовы;
- P3-13 шаг 3 регистрации — после шага 2 (P3-12). Carousel и Modal уже готовы.

Шапка (P3-04) в работе и остаётся ближайшей зависимостью: от неё через лейауты зависят почти все страницы.

## Перед PR — частые замечания ревью

- `npx prettier --check` по своим файлам (или «форматировать при сохранении» в VS Code — настройки уже в `.vscode/settings.json`);
- тест на основное поведение и story на каждое состояние, у story — ссылка на фрейм Figma;
- JSDoc над компонентом с `@see Figma: 1:XXXX` (id через двоеточие) и короткие описания пропсов;
- README папки описывает то, что в ней реально лежит; старые пометки «ЗАГЛУШКА» и `// TODO` удалены;
- в названии PR — `[ID]`, в описании — строка `Closes #N` ровно в таком виде;
- `package.json` и общие настройки не трогаем — нужна библиотека, пиши тимлиду.
