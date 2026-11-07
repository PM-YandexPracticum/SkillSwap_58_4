# Справка по фазам 2–3: что уже готово и что дальше

Коротко: что уже есть в проекте и можно брать в свою задачу, что сейчас в работе и что можно начинать.
Перед стартом задачи загляни сюда — возможно, половина нужного уже сделана. Актуально на **07.11.2026**.

## Уже готово — используй, не делай заново

**Компоненты (`src/shared/ui`)**

- `Button` — `import { Button } from '@/shared/ui/Button'`. Пропсы: `variant` (`primary`, `secondary`, `ghost`), `type` (по умолчанию `button`), `disabled`, `onClick`, `children`. Нужна кнопка «Войти», «Подробнее», «Смотреть все» — бери её.
- `IconButton` — `import { IconButton } from '@/shared/ui/IconButton'`. Пропсы: `ariaLabel` (обязательно), `icon`, `onClick`. Для сердечка, колокольчика, «Закрыть», «поделиться».
- `Avatar` — `import { Avatar } from '@/shared/ui/Avatar'`. Пропсы: `src` (путь из моков или `null`), `alt`, `size` (`sm` 48px — шапка, `md` 100px — карточка, `lg` 244px — профиль).
- `Logo` — `import { Logo } from '@/shared/ui/Logo'`. Ссылка на главную, проп `withText` (по умолчанию `true`). Внутри `Link`, поэтому в тестах и stories оборачивай в `MemoryRouter`.
- `Loader` — `import { Loader } from '@/shared/ui/Loader'`. Спиннер «загружается», проп `className` — чтобы поставить его, куда нужно.
- `Dropdown` — `import { Dropdown } from '@/shared/ui/Dropdown'`. Поповер под кнопкой: `trigger`, `isOpen`, `onClose`, `align` (`end` — для кнопок справа в шапке), внутрь — любое содержимое. Состояние `isOpen` хранит родитель; закрывается по Esc и клику мимо, сам не вылезает за край окна. Для меню (шапка, уведомления); для Select и MultiSelect не подходит — у них в макете своя раскрывающаяся рамка (см. P2-09).
- `Select` — `import { Select } from '@/shared/ui/Select'` (P2-09, [PR #145](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/145)). Управляемые `value` / `onChange`, список `options`; вариант `searchable` для города, поиск и очистка, ошибка и disabled. `value: null` выбирает «Не указан», если такой option передан. Стрелки, Enter, Esc и Tab уже обработаны; связь категории и подкатегории остаётся у формы.
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
- `UserProfileCard` из `@/entities/user` — карточка автора с `user`, `cityName`, `teachSkill`, `learnSubcategories`. `SkillInfo` из `@/entities/skill` — `skill` (название, описание, изображения), `categoryTitle`, `subcategoryTitle`, объект `actions` со слотами `like`, `createOffer`, `share`, `more`. Галерея уже внутри `SkillInfo`; сборка страницы — P3-09. Готовы в [PR #150](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/150).
- `UserSummary` — блок «аватар + имя + город, возраст» для карточки автора (P3-02); `SkillTag` из `@/entities/skill` — чип навыка в цвете категории.
- Сессия (P4-05): `selectIsAuth`, `selectSession`, вход `startSession(userId)` и выход `endSession()` из `@/entities/session` — каждое сразу меняет store и localStorage.
- Защита страниц (P4-08): `RequireAuth` закрывает `/profile/*` и `/favorites`, отправляет гостя на вход с `replace` и полным `state.from`; возврат после входа — P4-09.
- Справочники в store (P4-02): `fetchCategories`, `selectSubcategoryById`, `selectCategoryBySubcategoryId`, `selectCategoryColor` из `@/entities/category`; `fetchCities`, `selectCityById` из `@/entities/city`.

**Блоки (`src/widgets`)**

- `Header` — `import { Header } from '@/widgets/header'` (P3-04, [PR #153](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/153)). Вид задают `isAuth`, `userName`, `userAvatar`, `hasUnread`, `onLogout`; меню навыков и уведомления — слоты `categoriesMenu` и `notifications`. Одновременно открыто одно меню, пустой слот не открывает окно. Подключение в лейаут — P3-05, сессия и выход — P5-09, уведомления — P7-05. `SearchInput` из `@/features/skill-search` уже умеет Enter/лупу и очистку через `onSearch` / `onClear`; запись запроса в store и прокидывание обработчиков — P5-03.
- `OfferCard` — `import { OfferCard } from '@/widgets/offer-card'`: принимает `PublicUser`, читает справочники и уже загруженные обмены из store, собирает `UserCard` со счётчиком лайков и ссылкой на навык. Если текущий пользователь уже предложил обмен этому автору, ссылка заменяется статичным `ExchangeStatusBadge` (P7-04); гость и остальные видят «Подробнее». Сердечко пока без действия — логику добавит P5-07. При подключении данных к каталогу контейнер должен вызвать `fetchExchanges()`; текущая страница ещё заглушка.
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
- `useInfiniteScroll(items, batch, delayMs)` из `@/shared/lib/hooks` (P2-15, [PR #152](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/152)) — `visibleItems`, `sentinelRef`, `isLoading`, `hasMore`; каждая порция требует прокрутки. Смена ссылки `items` сбрасывает ленту и отменяет таймер: фильтрацию и сортировку мемоизируй через `useMemo`. Размер и задержку передавай из `CATALOG`, маркер ставь в конце списка.
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

Не берём повторно — уже назначены:

- P2-12 DatePicker и P2-17 MultiSelect — `Laurovsky`; Select уже влит, ожидания P2-09 больше нет;
- P3-05 Лейауты — `Al-Du9270-art`, P3-09 Страница навыка — `sosolet`;
- P3-11 Вход и шаг 1 — `kkiitlin`, P3-16 «О проекте», 404 и 500 — `muntaniolirina`;
- P3-07 Панель фильтров — `alicevdr`, Review (PR #148);
- P4-03 Пользователи и навыки — `Nick-Shvd`; P4-06 Сохранение и P5-02 Панель фильтров в действии — `pwkdmc`.

P2-09, P3-04 и P7-04 завершены и влиты в `develop`. У P2-17 и P3-05 закрыты все прямые зависимости. Полный список текущих назначений — в [отчёте](report.md#сейчас-в-работе).

## Можно брать сейчас

На доске Todo четыре задачи без исполнителей: **P5-03 (#61), P7-01 (#74), P3-06 (#39) и P3-10 (#43)**. У P5-03 закрыты прямые зависимости; интеграцию результатов с реальным каталогом согласуем с P3-10/P5-05 и P4-03. У остальных остаются P3-09/P4-03, P3-05 и P3-07 согласно конкретной карточке.

**Ближайшие кандидаты из Backlog:** P3-12 (#45), P4-04 (#53), P4-09 (#58), P6-01 (#68) и P8-02 (#81). Их оставшиеся прямые зависимости уже в In Progress; точный список — в [отчёте](report.md#готовность-к-todo). P3-11 и P3-16 уже заняты, повторно брать их не нужно.

Todo — ближайшая очередь команды; зависимости не обязаны быть закрыты до переноса. До окончательной интеграции они должны быть готовы и совместимы. В этой актуализации я обновил только локальные документы: карточки и назначения GitHub не менял.

## P5-01 — готово для следующих задач

Из `@/features/catalog-filter` доступны `applyFilters`, `setMode`, `toggleSubcategory`, `toggleCategory`, `setGender`, `toggleCity`, `setSort`, `removeFilter`, `resetFilters`, `selectCatalogFilter`, `selectActiveFiltersCount` и типы. `toggleCategory` принимает id подкатегорий; поиск хранится отдельно, общий сброс координирует вызывающий код. Данные и фильтры соединяются на уровне страницы, соседние фичи друг друга не импортируют.

«Хочу научиться» — желания автора карточки, «Могу научить» — его предложение; поиск — по названию предлагаемого навыка. Ядро готово в [PR #154](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/154); подключение к UI — отдельные задачи P5-02/P5-03.

## P4-07 — готово для следующих задач

Эти операции доступны следующим задачам:

- `@/entities/exchange`: `fetchExchanges()`, `addExchange(exchange)`, `selectExchanges` и `selectHasProposed(state, otherUserId)`. Повторный обмен от того же пользователя тому же получателю запрещён.
- `@/entities/notification`: `fetchNotifications()`, `addNotification(notification)`, `markAllRead()`, `clearAllNotifications()`, `selectNotifications` и `selectHasUnread`. Селекторы показывают данные только текущего пользователя; чтение и очистка берут владельца из сессии.
- Бейдж карточки уже подключён в P7-04 ([PR #155](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/155)); загрузку обменов в контейнер каталога добавят P5-04/P5-06. Сценарий создания обмена/toast остаётся в P7-03, панель и колокольчик — в P7-05; их остальные зависимости перечислены в [фазе 7](phases/phase-07-skill-profile.md).

## Что дальше

**В фазе 2 осталось две задачи:**

- P2-12 DatePicker — в работе у `Laurovsky`; Input и библиотека готовы.
- P2-17 MultiSelect — у того же исполнителя; Select (P2-09) уже готов, устройство раскрытой рамки можно переиспользовать, пункты — `Checkbox`.

**Фаза 3** открывается по мере готовности компонентов. Текущее состояние и ближайшие зависимости:

- P3-05 лейауты — шапка (P3-04) и подвал (P3-03) готовы; за ними «Все навыки» (P3-06), а P3-16 и P3-11 уже взяты в работу;
- P3-09 страница навыка уже в работе: P3-02, P3-08, Carousel и Modal готовы;
- P3-10 каталог — после панели фильтров P3-07 и лейаутов P3-05; карточка и секция P3-08 уже готовы;
- P3-13 шаг 3 регистрации — после шага 2 (P3-12). Carousel и Modal уже готовы.

Шапка P3-04 завершена; лейауты P3-05 ещё в работе. Их завершение позволит интегрировать ближайшую очередь страниц, а подготовку следующих задач можно включать в Todo уже сейчас.

## Перед PR — частые замечания ревью

- `npx prettier --check` по своим файлам (или «форматировать при сохранении» в VS Code — настройки уже в `.vscode/settings.json`);
- тест на основное поведение и story на каждое состояние, у story — ссылка на фрейм Figma;
- JSDoc над компонентом с `@see Figma: 1:XXXX` (id через двоеточие) и короткие описания пропсов;
- README папки описывает то, что в ней реально лежит; старые пометки «ЗАГЛУШКА» и `// TODO` удалены;
- в названии PR — `[ID]`, в описании — строка `Closes #N` ровно в таком виде;
- `package.json` и общие настройки не трогаем — нужна библиотека, пиши тимлиду.
