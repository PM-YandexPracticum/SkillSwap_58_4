# Справка по фазам 2–3: что уже готово и что дальше

Коротко: что уже есть в проекте и можно брать в свою задачу, что сейчас в работе и что можно начинать.
Перед стартом задачи загляни сюда — возможно, половина нужного уже сделана. Актуально на **13.11.2026**.

## Уже готово — используй, не делай заново

**Компоненты (`src/shared/ui`)**

- `Button` — `import { Button } from '@/shared/ui/Button'`. Пропсы: `variant` (`primary`, `secondary`, `ghost`), `type` (по умолчанию `button`), `disabled`, `onClick`, `children`. Нужна кнопка «Войти», «Подробнее», «Смотреть все» — бери её.
- `IconButton` — `import { IconButton } from '@/shared/ui/IconButton'`. Пропсы: `ariaLabel` (обязательно), `icon`, `onClick`. Для сердечка, колокольчика, «Закрыть», «поделиться».
- `Avatar` — `import { Avatar } from '@/shared/ui/Avatar'`. Пропсы: `src` (путь из моков или `null`), `alt`, `size` (`sm` 48px — шапка, `md` 100px — карточка, `lg` 244px — профиль).
- `Logo` — `import { Logo } from '@/shared/ui/Logo'`. Ссылка на главную, проп `withText` (по умолчанию `true`). Внутри `Link`, поэтому в тестах и stories оборачивай в `MemoryRouter`.
- `Loader` — `import { Loader } from '@/shared/ui/Loader'`. Спиннер «загружается», проп `className` — чтобы поставить его, куда нужно.
- `Dropdown` — `import { Dropdown } from '@/shared/ui/Dropdown'`. Поповер под кнопкой: `trigger`, `isOpen`, `onClose`, `align` (`end` — для кнопок справа в шапке), внутрь — любое содержимое. Состояние `isOpen` хранит родитель; закрывается по Esc и клику мимо, сам не вылезает за край окна. Для меню (шапка, уведомления); для Select и MultiSelect не подходит — у них в макете своя раскрывающаяся рамка (см. P2-09).
- `Select` — `import { Select } from '@/shared/ui/Select'` (P2-09, [PR #145](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/145)). Управляемые `value` / `onChange`, список `options`; вариант `searchable` для города, поиск и очистка, ошибка и disabled. `value: null` выбирает «Не указан», если такой option передан. Стрелки, Enter, Esc и Tab уже обработаны; связь категории и подкатегории выполняет общий `CategorySubcategorySelect` (P6-03).
- `DatePicker` из `@/shared/ui/DatePicker` (P2-12, PR #162) — Input и react-datepicker: ручной ввод `дд.мм.гггг`, календарь с выбором месяца/года, русский язык, подтверждение/отмена. `value` — ISO `YYYY-MM-DD` или `null`, возраст проверяет форма; подключение и внешний сброс описаны в README компонента.
- `MultiSelect` из `@/shared/ui/MultiSelect` (P2-17, PR #163) — управляемый множественный выбор на Checkbox со стилями поля Select; в закрытом поле первое название и «+N». Клавиатура, ошибка и disabled готовы. Связь категорий и подкатегорий готова в общем `CategorySubcategorySelect` (P6-03, PR #186); повторно в форме её не пишем.
- `AuthPageLayout` и `CredentialsForm` — общая область с иллюстрацией и общая вёрстка полей email/пароля (P3-11). Формы передают обработчики и ошибки; правила проверки и сохранение подключаются в своих задачах.
- `ErrorPage` — общая рамка, иллюстрация, заголовок, описание и слот действий 404/500 (P3-16); маршруты передаются страницами, корневой ErrorBoundary готов в P8-01 (PR #189).
- `Stepper` — `import { Stepper } from '@/shared/ui/Stepper'`. «Шаг N из 3» над формой регистрации: `current`, `total`.
- `Tag` — `import { Tag } from '@/shared/ui/Tag'`. Чип навыка: `label`, `color` — id категории (`business`, `creativity`, `languages`, `education`, `health`, `home`) или `more` для «+N»; с `onRemove` появляется крестик — это плашка фильтра. Длинное название обрезается многоточием, полное — в подсказке. `isTagColor(id)` проверяет, есть ли цвет у категории.
- `Input` и `Textarea` — `import { Input } from '@/shared/ui/Input'`, `import { Textarea } from '@/shared/ui/Textarea'`. Подпись `label`, ошибка `error`, декоративная иконка `rightIcon` (карандаш); кликабельная кнопка справа — `rightAction` («глаз», «×» очистки). Работают с `register` из react-hook-form. Высота Input — 48 px, как в макете.
- `PasswordInput` — `import { PasswordInput } from '@/shared/ui/PasswordInput'` (P2-06, [PR #146](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/146)). `hint` передаётся явно, при `error` скрывается; видимость переключается доступной кнопкой. При `disabled` глаз скрыт; `ref` и пропсы Input поддерживают react-hook-form. Валидация пароля остаётся в схеме формы.
- `Checkbox` и `RadioGroup` — `import { Checkbox } from '@/shared/ui/Checkbox'`, `import { RadioGroup } from '@/shared/ui/RadioGroup'`. Управляемые: `checked` / `value` и `onChange`; у Checkbox есть `indeterminate` — частичный выбор категории; у RadioGroup — заголовок группы `label` и стрелки с клавиатуры.
- `Modal` — `import { Modal } from '@/shared/ui/Modal'`. Обёртка: `isOpen`, `onClose`, `children` и обязательный `ariaLabel`. Esc и клик по фону закрывают, фокус остаётся внутри; внутренние отступы задаёт содержимое.
- `FileDropzone` — `import { FileDropzone } from '@/shared/ui/FileDropzone'`. Зона «Перетащите или выберите изображения»: отдаёт `File[]` в `onFiles`, превью (`previews`) и ошибку (`error`) получает пропсами — проверку файлов делает форма. `uploadDisabled` запрещает добавление, сохраняя удаление превью (например, при лимите четырёх фото); `disabled` отключает компонент целиком.
- `Carousel` — `import { Carousel } from '@/shared/ui/Carousel'`. Обёртка над Embla: слайды через `children`, `slidesToShow`, `gap`, `showArrows`, `fullHeight`, `loop`; `onApiReady` и `onSelect` — для галереи и миниатюр. Stories показывают галерею, превью навыка и четыре похожих предложения.
- `Toast` — показывай через `const { showToast } = useToast()` из `@/shared/lib/toast`: `showToast('Вы предложили обмен Ивану')`. `ToastProvider` уже подключён в App; крестик и автоисчезновение через 4 с готовы. Создание обмена и вызов из бизнес-сценария подключены в P7-03 (PR #195).

**Блоки (`src/entities`)**

- `UserCard` — `import { UserCard } from '@/entities/user'`. Карточка каталога: `user`, `cityName`, `teachSkill`, `learnSubcategories`, слоты `topAction` (лайк) и `bottomAction` («Подробнее»). Задача-образец — P3-01 ([PR #133](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/133)).
- `UserProfileCard` из `@/entities/user` — карточка автора с `user`, `cityName`, `teachSkill`, `learnSubcategories`. `SkillInfo` из `@/entities/skill` — `skill` (название, описание, изображения), `categoryTitle`, `subcategoryTitle`, объект `actions` со слотами `like`, `createOffer`, `share`, `more`. Галерея уже внутри `SkillInfo`; блоки собраны в P3-09, данные страницы подключены в P7-01. Готовы в [PR #150](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/150).
- `SkillGallery` из `@/entities/skill` — общая галерея страницы навыка и предпросмотра регистрации (P3-13, PR #196): получает `title` и `images`, сама разрешает адреса фото, показывает Carousel и миниатюры при нескольких фото. Вторую галерею в форме не создаём.
- `UserSummary` — блок «аватар + имя + город, возраст» для карточки автора (P3-02); `SkillTag` из `@/entities/skill` — чип навыка в цвете категории.
- Сессия (P4-05): `selectIsAuth`, `selectSession`, вход `startSession(userId)` и выход `endSession()` из `@/entities/session` — каждое сразу меняет store и localStorage.
- Защита страниц (P4-08): `RequireAuth` закрывает `/profile/*` и `/favorites`, отправляет гостя на вход с `replace` и полным `state.from`; возврат после входа — P4-09.
- Пользователи и навыки (P4-03): `fetchUsers`, `fetchSkills`, селекторы по id, пользователю, популярности и новизне из публичных API сущностей. Полный список и контракты — в README `entities/user/model` и `entities/skill/model`. Общую загрузку при старте запускает `DataProvider` из P4-04, запись готова в P4-06 (PR #191).
- Справочники в store (P4-02): `fetchCategories`, `selectSubcategoryById`, `selectCategoryBySubcategoryId`, `selectCategoryColor` из `@/entities/category`; `fetchCities`, `selectCityById` из `@/entities/city`.

**Блоки (`src/widgets`)**

- `CategoriesList` и `CategoriesMenu` из `@/widgets/categories-menu` (P3-06, PR #165) — единый справочник шести категорий для Header и `/skills`. `DataProvider` загружает справочник до открытия маршрута; список показывает готовые, пустые и ошибочные состояния. Открытием Dropdown управляет Header.
- `FiltersPanel` из `@/widgets/filters-panel` (P3-07, PR #148; подключение P5-02, PR #175) — группы на Checkbox/RadioGroup, данные справочников через селекторы, выборы и сброс связаны с `catalogFilter` в store. Все шесть категорий видимы; дополнительные категории раскрываются кнопкой. Вывод результатов и сортировка подключены в P5-05 (PR #194).
- `Header` — `import { Header } from '@/widgets/header'` (P3-04, [PR #153](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/153)). Вид задают `isAuth`, `userName`, `userAvatar`, `hasUnread`, `onLogout`; меню навыков и уведомления — слоты `categoriesMenu` и `notifications`. Одновременно открыто одно меню, пустой слот не открывает окно. Подключён в MainLayout (P3-05); сессия и выход — P5-09, уведомления — P7-05. `SearchInput` из `@/features/skill-search` подключён к store в P5-03: Enter/лупа применяют запрос, крестик очищает его. Внешние `queryApplied` / `queryCleared` синхронизируют черновик поля, в том числе при повторной команде; callbacks `onSearch` / `onClear` остаются необязательными.
- `OfferCard` — `import { OfferCard } from '@/widgets/offer-card'`: принимает `PublicUser`, читает справочники и уже загруженные обмены из store, собирает `UserCard` со счётчиком лайков и ссылкой на навык. Если текущий пользователь уже предложил обмен этому автору, ссылка заменяется статичным `ExchangeStatusBadge` (P7-04); гость и остальные видят «Подробнее». Сердечко пока без действия — логику добавит P5-07. Каталог уже загружает обмены через `fetchExchanges()` (P5-04), страница навыка получает данные в P7-01, создание обмена готово в P7-03. Лайки остаются в P5-07.
- `OffersSection` — `import { OffersSection } from '@/widgets/offers-section'`: `title`, `users`, `mode`, `renderItem`; сетка по три, в режиме `expandable` раскрытие 3 ⇄ 9 уже работает, в `infinite` виджет показывает переданную порцию и принимает `isLoading`, `hasMore`, `sentinelRef` для спиннера и маркера конца ленты. Порции считает страница через `useInfiniteScroll` (P5-06). Страница передаёт `renderItem={(user) => <OfferCard user={user} />}`. Пример — story `app/CatalogSections`, [PR #142](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/142).
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

- P4-09, вход, и P5-09, шапка вошедшего — `Laurovsky`;
- P5-06, лента с догрузкой — `kkiitlin`;
- P5-07, лайки — `Stanislave0`;
- P8-05, автотесты главных сценариев — `kirill-ai-dev`;
- P6-02, email и пароль — `Al-Du9270-art`;
- P6-05, свой навык и превью — `alicevdr`;
- P8-03, пустые списки — `Nick-Shvd`;
- P7-05, уведомления — `muntaniolirina`; P5-08 уже назначена ей в Todo;
- общая P8-02 — Review с назначением `pwkdmc`; вклады Дианы (PR #159), Андрея (PR #168), мой (PR #169) и Ирины (PR #170) уже приняты. Для остальных участников задача открыта.

P4-04 (PR #181), P3-14 (PR #183), P5-04 (PR #178), P6-03 (PR #186), P8-01 (PR #189), P4-06 (PR #191), P5-05 (PR #194), P7-03 (PR #195), P6-01 (PR #193) и P3-13 (PR #196; исходная история — PR #197) завершены. Полный список назначений и оставшихся зависимостей на 13.11.2026 — в [отчёте](report.md#сейчас-в-работе).

## Можно брать сейчас

В Todo **четыре задачи**: **P5-08 (#66), P6-04 (#71), P6-06 (#73), P7-06 (#79)**. Все они назначены исполнителям: `muntaniolirina`, `sosolet`, `Stanislave0` и `Nick-Shvd` соответственно. P5-06 выполняет `kkiitlin`, P6-05 — `alicevdr`, P8-03 — `Nick-Shvd` (In Progress); P8-05 выполняет `kirill-ai-dev` (In Progress). Оставшиеся зависимости перечислены для каждой задачи в [отчёте](report.md#готовность-к-todo).

В Backlog остались P8-04, P8-06 и P8-07. Полностью закрытых зависимостей у них пока нет: итоговую проверку P8-04 завершаем после фаз 5–7; P8-05 уже в работе, P8-06 — после P8-04, P8-07 — после P8-05/P8-06. P8-04 можно планировать следующей и проверять готовые экраны по мере интеграции; P8-05 уже в работе; перенос на доске согласуем отдельно. Незакрытая зависимость не запрещает Todo; совместимость API и общие файлы согласуем перед интеграцией.

## P5-01 — готово для следующих задач

Из `@/features/catalog-filter` доступны `applyFilters`, `setMode`, `toggleSubcategory`, `toggleCategory`, `setGender`, `toggleCity`, `setSort`, `removeFilter`, `resetFilters`, `selectCatalogFilter`, `selectActiveFiltersCount` и типы. `toggleCategory` принимает id подкатегорий; поиск хранится отдельно, общий сброс координирует вызывающий код. Данные и фильтры соединяются на уровне страницы, соседние фичи друг друга не импортируют.

«Хочу научиться» — желания автора карточки, «Могу научить» — его предложение; поиск — по названию предлагаемого навыка. Ядро готово в [PR #154](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/154); поиск подключён в P5-03, подключение панели — P5-02, вывод результатов — P5-05.

## P4-07 — готово для следующих задач

Эти операции доступны следующим задачам:

- `@/entities/exchange`: `fetchExchanges()`, `addExchange(exchange)`, `selectExchanges` и `selectHasProposed(state, otherUserId)`. Повторный обмен от того же пользователя тому же получателю запрещён.
- `@/entities/notification`: `fetchNotifications()`, `addNotification(notification)`, `markAllRead()`, `clearAllNotifications()`, `selectNotifications` и `selectHasUnread`. Селекторы показывают данные только текущего пользователя; чтение и очистка берут владельца из сессии.
- Бейдж карточки уже подключён в P7-04 ([PR #155](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/155)); загрузку обменов уже подключили в контейнере каталога в P5-04 (PR #178). Сценарий создания обмена/toast завершён в P7-03 (PR #195), панель и колокольчик — в P7-05; их остальные зависимости перечислены в [фазе 7](phases/phase-07-skill-profile.md).

## Что дальше

**Фаза 2 завершена — 18/18.** DatePicker и MultiSelect уже в `develop`, повторно делать их не нужно.

**Фаза 3 завершена — 16/16:**

- P3-09 и P3-10 в Done: страница навыка, каталог, результаты, лейауты и панель собраны; данные страницы подключены в P7-01, панель фильтров — в P5-02, результаты подключены в P5-05;
- P3-12 в Done; Input, DatePicker, MultiSelect, Avatar и общая рамка регистрации готовы;
- P3-13 в Done: форма навыка и оба окна готовы; фото можно удалить и заменить при лимите, повторная отправка блокируется до окончания обработки. Галерея общая с `SkillInfo`; валидация и сохранение остаются в P6-05/P6-06;
- P3-14 в Done: кабинет, меню и вёрстка личных данных готовы; сохранение — P7-06;
- `/skills`, `/about`, 404, 500, вход и шаг 1 уже реализованы; черновик и охрана шагов готовы в P6-01; бизнес-вход, подключение форм и сохранение регистрации остаются в фазах 4 и 6.

## Перед PR — частые замечания ревью

- `npx prettier --check` по своим файлам (или «форматировать при сохранении» в VS Code — настройки уже в `.vscode/settings.json`);
- тест на основное поведение и story на каждое состояние, у story — ссылка на фрейм Figma;
- JSDoc над компонентом с `@see Figma: 1:XXXX` (id через двоеточие) и короткие описания пропсов;
- README папки описывает то, что в ней реально лежит; старые пометки «ЗАГЛУШКА» и `// TODO` удалены;
- в названии PR — `[ID]`, в описании — строка `Closes #N` ровно в таком виде; исключение — личный мини-PR общей P8-02: ссылаемся на #81 без закрытия всей задачи;
- `package.json` и общие настройки не трогаем — нужна библиотека, пиши тимлиду.
