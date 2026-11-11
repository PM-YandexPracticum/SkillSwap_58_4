# Справка по фазам 2–3: что уже готово и что дальше

Коротко: что уже есть в проекте и можно брать в свою задачу, что сейчас в работе и что можно начинать.
Перед стартом задачи загляни сюда — возможно, половина нужного уже сделана. Актуально на **11.11.2026**.

## Уже готово — используй, не делай заново

**Компоненты (`src/shared/ui`)**

- `Button` — `import { Button } from '@/shared/ui/Button'`. Пропсы: `variant` (`primary`, `secondary`, `ghost`), `type` (по умолчанию `button`), `disabled`, `onClick`, `children`. Нужна кнопка «Войти», «Подробнее», «Смотреть все» — бери её.
- `IconButton` — `import { IconButton } from '@/shared/ui/IconButton'`. Пропсы: `ariaLabel` (обязательно), `icon`, `onClick`. Для сердечка, колокольчика, «Закрыть», «поделиться».
- `Avatar` — `import { Avatar } from '@/shared/ui/Avatar'`. Пропсы: `src` (путь из моков или `null`), `alt`, `size` (`sm` 48px — шапка, `md` 100px — карточка, `lg` 244px — профиль).
- `Logo` — `import { Logo } from '@/shared/ui/Logo'`. Ссылка на главную, проп `withText` (по умолчанию `true`). Внутри `Link`, поэтому в тестах и stories оборачивай в `MemoryRouter`.
- `Loader` — `import { Loader } from '@/shared/ui/Loader'`. Спиннер «загружается», проп `className` — чтобы поставить его, куда нужно.
- `Dropdown` — `import { Dropdown } from '@/shared/ui/Dropdown'`. Поповер под кнопкой: `trigger`, `isOpen`, `onClose`, `align` (`end` — для кнопок справа в шапке), внутрь — любое содержимое. Состояние `isOpen` хранит родитель; закрывается по Esc и клику мимо, сам не вылезает за край окна. Для меню (шапка, уведомления); для Select и MultiSelect не подходит — у них в макете своя раскрывающаяся рамка (см. P2-09).
- `Select` — `import { Select } from '@/shared/ui/Select'` (P2-09, [PR #145](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/145)). Управляемые `value` / `onChange`, список `options`; вариант `searchable` для города, поиск и очистка, ошибка и disabled. `value: null` выбирает «Не указан», если такой option передан. Стрелки, Enter, Esc и Tab уже обработаны; связь категории и подкатегории остаётся у формы.
- `DatePicker` из `@/shared/ui/DatePicker` (P2-12, PR #162) — Input и react-datepicker: ручной ввод `дд.мм.гггг`, календарь с выбором месяца/года, русский язык, подтверждение/отмена. `value` — ISO `YYYY-MM-DD` или `null`, возраст проверяет форма; подключение и внешний сброс описаны в README компонента.
- `MultiSelect` из `@/shared/ui/MultiSelect` (P2-17, PR #163) — управляемый множественный выбор на Checkbox со стилями поля Select; в закрытом поле первое название и «+N». Клавиатура, ошибка и disabled готовы. Отбор подкатегорий остаётся у формы (P6-03).
- `AuthPageLayout` и `CredentialsForm` — общая область с иллюстрацией и общая вёрстка полей email/пароля (P3-11). Формы передают обработчики и ошибки; правила проверки и сохранение подключаются в своих задачах.
- `ErrorPage` — общая рамка, иллюстрация, заголовок, описание и слот действий 404/500 (P3-16); маршруты передаются страницами, ErrorBoundary — P8-01.
- `Stepper` — `import { Stepper } from '@/shared/ui/Stepper'`. «Шаг N из 3» над формой регистрации: `current`, `total`.
- `Tag` — `import { Tag } from '@/shared/ui/Tag'`. Чип навыка: `label`, `color` — id категории (`business`, `creativity`, `languages`, `education`, `health`, `home`) или `more` для «+N»; с `onRemove` появляется крестик — это плашка фильтра. Длинное название обрезается многоточием, полное — в подсказке. `isTagColor(id)` проверяет, есть ли цвет у категории.
- `Input` и `Textarea` — `import { Input } from '@/shared/ui/Input'`, `import { Textarea } from '@/shared/ui/Textarea'`. Подпись `label`, ошибка `error`, декоративная иконка `rightIcon` (карандаш); кликабельная кнопка справа — `rightAction` («глаз», «×» очистки). Работают с `register` из react-hook-form. Высота Input — 48 px, как в макете.
- `PasswordInput` — `import { PasswordInput } from '@/shared/ui/PasswordInput'` (P2-06, [PR #146](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/146)). `hint` передаётся явно, при `error` скрывается; видимость переключается доступной кнопкой. При `disabled` глаз скрыт; `ref` и пропсы Input поддерживают react-hook-form. Валидация пароля остаётся в схеме формы.
- `Checkbox` и `RadioGroup` — `import { Checkbox } from '@/shared/ui/Checkbox'`, `import { RadioGroup } from '@/shared/ui/RadioGroup'`. Управляемые: `checked` / `value` и `onChange`; у Checkbox есть `indeterminate` — частичный выбор категории; у RadioGroup — заголовок группы `label` и стрелки с клавиатуры.
- `Modal` — `import { Modal } from '@/shared/ui/Modal'`. Обёртка: `isOpen`, `onClose`, `children` и обязательный `ariaLabel`. Esc и клик по фону закрывают, фокус остаётся внутри; внутренние отступы задаёт содержимое.
- `FileDropzone` — `import { FileDropzone } from '@/shared/ui/FileDropzone'`. Зона «Перетащите или выберите изображения»: отдаёт `File[]` в `onFiles`, превью (`previews`) и ошибку (`error`) получает пропсами — проверку файлов делает форма.
- `Carousel` — `import { Carousel } from '@/shared/ui/Carousel'`. Обёртка над Embla: слайды через `children`, `slidesToShow`, `gap`, `showArrows`, `fullHeight`, `loop`; `onApiReady` и `onSelect` — для галереи и миниатюр. Stories показывают галерею, превью навыка и четыре похожих предложения.
- `Toast` — показывай через `const { showToast } = useToast()` из `@/shared/lib/toast`: `showToast('Вы предложили обмен Ивану')`. `ToastProvider` уже подключён в App; крестик и автоисчезновение через 4 с готовы. Создание обмена и вызов из бизнес-сценария — P7-03.

**Блоки (`src/entities`)**

- `UserCard` — `import { UserCard } from '@/entities/user'`. Карточка каталога: `user`, `cityName`, `teachSkill`, `learnSubcategories`, слоты `topAction` (лайк) и `bottomAction` («Подробнее»). Задача-образец — P3-01 ([PR #133](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/133)).
- `UserProfileCard` из `@/entities/user` — карточка автора с `user`, `cityName`, `teachSkill`, `learnSubcategories`. `SkillInfo` из `@/entities/skill` — `skill` (название, описание, изображения), `categoryTitle`, `subcategoryTitle`, объект `actions` со слотами `like`, `createOffer`, `share`, `more`. Галерея уже внутри `SkillInfo`; блоки собраны в P3-09, данные страницы подключаются в P7-01. Готовы в [PR #150](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/150).
- `UserSummary` — блок «аватар + имя + город, возраст» для карточки автора (P3-02); `SkillTag` из `@/entities/skill` — чип навыка в цвете категории.
- Сессия (P4-05): `selectIsAuth`, `selectSession`, вход `startSession(userId)` и выход `endSession()` из `@/entities/session` — каждое сразу меняет store и localStorage.
- Защита страниц (P4-08): `RequireAuth` закрывает `/profile/*` и `/favorites`, отправляет гостя на вход с `replace` и полным `state.from`; возврат после входа — P4-09.
- Пользователи и навыки (P4-03): `fetchUsers`, `fetchSkills`, селекторы по id, пользователю, популярности и новизне из публичных API сущностей. Полный список и контракты — в README `entities/user/model` и `entities/skill/model`. Запуск общей загрузки — P4-04, запись — P4-06.
- Справочники в store (P4-02): `fetchCategories`, `selectSubcategoryById`, `selectCategoryBySubcategoryId`, `selectCategoryColor` из `@/entities/category`; `fetchCities`, `selectCityById` из `@/entities/city`.

**Блоки (`src/widgets`)**

- `CategoriesList` и `CategoriesMenu` из `@/widgets/categories-menu` (P3-06, PR #165) — единый справочник шести категорий для Header и `/skills`. До P4-04 загружает категории при `idle`, показывает Loader, ошибку с повтором и пустой список; параллельные запросы не дублируются. Открытием Dropdown управляет Header.
- `FiltersPanel` из `@/widgets/filters-panel` (P3-07, PR #148; подключение P5-02, PR #175) — группы на Checkbox/RadioGroup, данные справочников через селекторы, выборы и сброс связаны с `catalogFilter` в store. Все шесть категорий видимы; дополнительные категории раскрываются кнопкой. Вывод результатов и сортировка — P5-05.
- `Header` — `import { Header } from '@/widgets/header'` (P3-04, [PR #153](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/153)). Вид задают `isAuth`, `userName`, `userAvatar`, `hasUnread`, `onLogout`; меню навыков и уведомления — слоты `categoriesMenu` и `notifications`. Одновременно открыто одно меню, пустой слот не открывает окно. Подключён в MainLayout (P3-05); сессия и выход — P5-09, уведомления — P7-05. `SearchInput` из `@/features/skill-search` подключён к store в P5-03: Enter/лупа применяют запрос, крестик очищает его. Внешние `queryApplied` / `queryCleared` синхронизируют черновик поля, в том числе при повторной команде; callbacks `onSearch` / `onClear` остаются необязательными.
- `OfferCard` — `import { OfferCard } from '@/widgets/offer-card'`: принимает `PublicUser`, читает справочники и уже загруженные обмены из store, собирает `UserCard` со счётчиком лайков и ссылкой на навык. Если текущий пользователь уже предложил обмен этому автору, ссылка заменяется статичным `ExchangeStatusBadge` (P7-04); гость и остальные видят «Подробнее». Сердечко пока без действия — логику добавит P5-07. При подключении данных к каталогу контейнер должен вызвать `fetchExchanges()`; вёрстка страницы собрана в P3-10; подключение данных и обменов остаётся задачам фазы 5/7.
- `OffersSection` — `import { OffersSection } from '@/widgets/offers-section'`: `title`, `users`, `mode`, `renderItem`; сетка по три, в режиме `expandable` раскрытие 3 ⇄ 9 уже работает, в `infinite` выводятся все переданные карточки (догрузка — P5-06). Страница передаёт `renderItem={(user) => <OfferCard user={user} />}`. Пример — story `app/CatalogSections`, [PR #142](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/142).
- `Footer` — `import { Footer } from '@/widgets/footer'`: логотип, `/about`, `/skills`, четыре неинтерактивные заглушки и копирайт. Компонент подключён в MainLayout (P3-05). Для stories и тестов нужен роутер.
- `NotificationsPanel` — `import { NotificationsPanel } from '@/widgets/notifications-panel'`: содержимое окна колокольчика с секциями новых и просмотренных уведомлений, пустым состоянием и callback-пропсами. `NotificationItem` и `MarkAllReadButton` готовы; хранение готово в P4-07, подключение к Header относится к P7-05.
- `MainLayout` и `AuthLayout` готовы в `src/app/layouts` (P3-05, PR #157). Первый собирает Header, Outlet и Footer; второй — Logo, Button «Закрыть» и Outlet. Единственный `<main>` и `<h1>` предоставляет страница; формы и Stepper остаются в ней. Отдельные stories для app-слоя не требуются, поведение интеграции покрыто тестами.

**Утилиты**

- `resolveImageUrl(path, 'AVATAR' | 'SKILL')` из `@/shared/lib/image` — превращает путь из моков в адрес для `<img>`, без фото подставляет заглушку. Все картинки выводим только через неё.
- `validateImageFile(file)` из `@/shared/lib/validation` — тип и размер картинки (текст ошибки или `null`); `fileToDataUrl(file)` из `@/shared/lib/image` — уменьшает фото до 800 px и отдаёт data URL для сохранения.
- `pluralize(n, ['год', 'года', 'лет'])` из `@/shared/lib/pluralize` — склонение слова после числа.
- `useAppSelector`, `useAppDispatch` из `@/shared/lib/store` — хуки Redux с типами.
- «База данных» в браузере (P4-01, P4-10) — данные берём только через `entities/*/api` (`getUsers()`, `getSkills()`…): ответ приходит через ~300 мс, изменения сохраняются в localStorage. Напрямую в localStorage и в файлы `public/db` не ходим.
- Правила полей для форм — `emailField()`, `passwordField()`, `nameField()`, `birthDateField()`, `textField(min, max)`, `cityField(cityIds)` из `@/shared/lib/validation` (yup, тексты ошибок как в `validation.md`).
- `useInfiniteScroll(items, batch, delayMs)` из `@/shared/lib/hooks` (P2-15, [PR #152](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/152)) — `visibleItems`, `sentinelRef`, `isLoading`, `hasMore`; каждая порция требует прокрутки. Смена ссылки `items` сбрасывает ленту и отменяет таймер: фильтрацию и сортировку мемоизируй через `useMemo`. Размер и задержку передавай из `CATALOG`, маркер ставь в конце списка.
- `useLocalStorage` и `useClickOutside` из `@/shared/lib/hooks`. Неиспользуемые заготовки `useDebounce` и `shared/lib/helpers.ts` удалены; готовую логику поиска и форматирования уведомлений используем из соответствующих слайсов.

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

Не берём повторно — уже назначены:

- P3-14, личный кабинет — `alicevdr`;
- P4-04, загрузка при старте, и P4-09, вход — `Laurovsky`;
- P6-01, черновик и охрана шагов — `kkiitlin`;
- P6-03, связь категории и подкатегории — `muntaniolirina`;
- P4-06, сохранение пользователей и навыков — `Nick-Shvd`;
- P5-04, секции каталога — `sosolet`;
- P5-05, результаты и сортировка — `viceede`;
- P3-09, страница навыка — `sosolet`, Done, PR #166; исправление галереи — PR #172;
- P7-01, данные страницы навыка — `kirill-ai-dev`, Done, PR #173; P7-02, похожие предложения — Done, PR #177;
- общая P8-02 — Review с назначением `pwkdmc`, но вклады Дианы (PR #159), Андрея (PR #168), мой (PR #169) и Ирины (PR #170) уже приняты. Для остальных участников задача открыта.

Полный список назначений и оставшихся зависимостей — в [отчёте](report.md#сейчас-в-работе).

## Можно брать сейчас

В Todo **пять задач без исполнителей**: **P3-13 (#46), P5-07 (#65), P5-09 (#67), P6-02 (#69), P8-01 (#80)**. Для P3-13 P3-12 уже Done; для P5-07 остаются P4-06 и P4-09; для P5-09 — P4-09 (In Progress), для P6-02 — P6-01 (In Progress), для P8-01 — P4-04 (In Progress).

Из Backlog следующими можно планировать P5-06, P5-08, P6-04, P6-05, P6-06, P7-03, P7-05, P7-06, P8-03, P8-04, P8-05, P8-06 и P8-07; их порядок и зависимости перечислены в [отчёте](report.md#готовность-к-todo). Для остальных участников общую P8-02 можно вернуть из Review в Todo. Незакрытая зависимость не запрещает Todo; совместимость API и общие файлы согласуем перед интеграцией.

## P5-01 — готово для следующих задач

Из `@/features/catalog-filter` доступны `applyFilters`, `setMode`, `toggleSubcategory`, `toggleCategory`, `setGender`, `toggleCity`, `setSort`, `removeFilter`, `resetFilters`, `selectCatalogFilter`, `selectActiveFiltersCount` и типы. `toggleCategory` принимает id подкатегорий; поиск хранится отдельно, общий сброс координирует вызывающий код. Данные и фильтры соединяются на уровне страницы, соседние фичи друг друга не импортируют.

«Хочу научиться» — желания автора карточки, «Могу научить» — его предложение; поиск — по названию предлагаемого навыка. Ядро готово в [PR #154](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/154); поиск подключён в P5-03, подключение панели — P5-02, вывод результатов — P5-05.

## P4-07 — готово для следующих задач

Эти операции доступны следующим задачам:

- `@/entities/exchange`: `fetchExchanges()`, `addExchange(exchange)`, `selectExchanges` и `selectHasProposed(state, otherUserId)`. Повторный обмен от того же пользователя тому же получателю запрещён.
- `@/entities/notification`: `fetchNotifications()`, `addNotification(notification)`, `markAllRead()`, `clearAllNotifications()`, `selectNotifications` и `selectHasUnread`. Селекторы показывают данные только текущего пользователя; чтение и очистка берут владельца из сессии.
- Бейдж карточки уже подключён в P7-04 ([PR #155](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/155)); загрузку обменов в контейнер каталога добавят P5-04/P5-06. Сценарий создания обмена/toast остаётся в P7-03, панель и колокольчик — в P7-05; их остальные зависимости перечислены в [фазе 7](phases/phase-07-skill-profile.md).

## Что дальше

**Фаза 2 завершена — 18/18.** DatePicker и MultiSelect уже в `develop`, повторно делать их не нужно.

**Фаза 3 — 14/16:**

- P3-09 и P3-10 в Done: страница навыка, каталог, результаты, лейауты и панель собраны; данные страницы подключены в P7-01, панель фильтров — в P5-02, результаты остаются в P5-05;
- P3-12 в Done; Input, DatePicker, MultiSelect, Avatar и общая рамка регистрации готовы;
- P3-13 в Todo, шаг 2 уже готов; Carousel, Modal и FileDropzone готовы;
- P3-14 в работе; вёрстка DatePicker готова;
- `/skills`, `/about`, 404, 500, вход и шаг 1 уже реализованы; бизнес-вход, черновик и сохранение регистрации остаются в фазах 4 и 6.

## Перед PR — частые замечания ревью

- `npx prettier --check` по своим файлам (или «форматировать при сохранении» в VS Code — настройки уже в `.vscode/settings.json`);
- тест на основное поведение и story на каждое состояние, у story — ссылка на фрейм Figma;
- JSDoc над компонентом с `@see Figma: 1:XXXX` (id через двоеточие) и короткие описания пропсов;
- README папки описывает то, что в ней реально лежит; старые пометки «ЗАГЛУШКА» и `// TODO` удалены;
- в названии PR — `[ID]`, в описании — строка `Closes #N` ровно в таком виде; исключение — личный мини-PR общей P8-02: ссылаемся на #81 без закрытия всей задачи;
- `package.json` и общие настройки не трогаем — нужна библиотека, пиши тимлиду.
