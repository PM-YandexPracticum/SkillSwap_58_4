# Отчёт о задачах

Кто какую задачу сделал, что получилось и кто что делает сейчас. Отчёт нужен для команды, наставников и итоговой защиты.

**На 13.11.2026:** завершены **69 из 86 задач MVP** (80,2 %); вместе с девятью задачами фундамента — **78**. По фазам: 1 — 14/14, 2 — 18/18, 3 — 16/16, 4 — 9/10, 5 — 5/9, 6 — 2/6, 7 — 4/6, 8 — 1/7. Общая P8-02 пока не завершена: приняты четыре личных вклада.

Статусы, назначения и результаты сверены с issues, влитыми PR и [доской GitHub](https://github.com/orgs/PM-YandexPracticum/projects/133/views/1). Снимок: **Backlog — 3, Todo — 4, In Progress — 9, Review — 1, Need fix — 0, Done — 70**. Всего 87 карточек: 86 задач MVP и общая карточка фундамента #1. Done = 69 + 1; в плане фундамент состоит из девяти задач. Девять дополнительных задач фазы 9 вне доски MVP; старые ICS-задачи #90/#91 исключены, действующие P9-04/P9-05 — #92/#93.

## Последние принятые результаты — 10–13.11.2026

| Задача | Исполнитель | Итог |
|---|---|---|
| P3-13 «Шаг 3 регистрации и окна (вёрстка)» | sosolet | [PR #196](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/196) влит 13.11.2026, issue #46 закрыта. Готовы форма навыка, превью с общей SkillGallery и окно успешного завершения. Обработаны лимит фото, удаление и замена, ожидание чтения и повтор после ошибки; окна сверены с Figma, добавлены тесты, stories и README. Обычный merge исходной истории выполнен в [PR #197](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/197), без изменения файлов и повторного зачёта задачи. Валидация и сохранение остаются в P6-05/P6-06. |
| P6-01 «Черновик регистрации и охрана шагов» | kkiitlin | [PR #193](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/193) влит 13.11.2026, issue #68 закрыта. Черновик и пройденные шаги хранятся в Redux, guard не пускает напрямую на шаги 2–3, а lifecycle сбрасывает состояние только при выходе из регистрации. Поведение закрытия входа и регистрации разделено; добавлены тесты переходов, истории и JSDoc. Заполнение форм и валидация остаются в P6-02/P6-04/P6-05. |
| P7-03 «Предложить обмен» | kirill-ai-dev | [PR #195](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/195) влит 13.11.2026, issue #76 закрыта. Авторизованный пользователь создаёт обмен и уведомление без дублей, получает toast и окно подтверждения; гость переходит на вход с адресом возврата (обработчик входа — P4-09), повторная попытка после частичного сбоя восстанавливает уведомление. Состояние обмена сохраняется после перезагрузки; добавлены тесты сценария и документация. |
| P5-05 «Результаты: плашки и сортировка» | viceede | [PR #194](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/194) влит 13.11.2026, issue #63 закрыта. Каталог переключается на результаты при фильтре или поиске, показывает число совпадений, плашки удаляются через `parseFilterRemoval`, сортировка использует общий store. Страница переиспользует `applyFilters` без второго алгоритма фильтрации и сортировки; добавлены тесты и README. Догрузка остаётся в P5-06. |
| P4-06 «Сохранение пользователей и навыков» | Nick-Shvd | [PR #191](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/191) влит 12.11.2026, issue #55 закрыта. Добавлены операции записи пользователей и навыков через существующий mock API с обновлением Redux-store, отдельные статусы сохранения и загрузки, проверка уникальности email в API с нормализацией и защитой конкурентных запросов. Обработаны повторные записи, нехватка места и технические ошибки; добавлены регрессионные тесты, README и JSDoc. |
| P6-03 «Связь „категория ↔ подкатегория“» | muntaniolirina | [PR #186](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/186) влит 12.11.2026, issue #70 закрыта. Общий `CategorySubcategorySelect` поддерживает режимы `multiple` и `single`, чистые функции связывают выбор категорий и подкатегорий, удаляют устаревшие значения и не мутируют входные данные. Добавлены тесты, stories, README и JSDoc; черновик регистрации и обязательная валидация остаются в P6-04/P6-05. |
| P8-01 «Ошибка 500 и ErrorBoundary» | alicevdr | [PR #189](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/189) влит 12.11.2026, issue #80 закрыта. Корневой ErrorBoundary расположен над провайдерами приложения. Общий ServerErrorView используется на /500 и при ошибке рендера без зависимости от Router/Redux. После аварии «На главную» перезагружает приложение с учётом BASE_URL; обычная /500 сохраняет навигацию и повтор загрузки. Добавлены тесты, stories, README и снимок интерфейса. |
| P5-04 «Секции „Популярное“ и „Новое“» | sosolet | [PR #178](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/178) влит 12.11.2026, issue #62 закрыта. CatalogPage передаёт в CatalogView отдельные списки из selectPopularUsers и selectNewUsers: по убыванию likesCount и createdAt. Секции независимо раскрываются 3 ⇄ 9 через общий OffersSection; повторы между секциями допустимы. Загрузка обменов защищена от повторного запуска в StrictMode; обновлены тесты, stories и README. |
| P3-14 «Личный кабинет (вёрстка)» | alicevdr | [PR #183](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/183) влит 12.11.2026, issue #47 закрыта. Собраны ProfilePage с вложенными разделами, ProfileSidebar с активным пунктом и ProfilePersonal с формой и аватаром. Четыре остальных раздела показывают общий ProfileStub. Добавлены CSS Modules, тесты и stories. Поля пока используют демонстрационное локальное состояние; сохранение, смена пароля и аватара остаются в P7-06. |
| P4-04 «Загрузка при старте» | Laurovsky | [PR #181](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/181) влит 12.11.2026, issue #53 закрыта. DataProvider загружает пользователей, навыки, категории и города перед открытием страниц. Во время загрузки показан Loader, ошибка ведёт на /500, повтор запрашивает только неуспешные коллекции. Убраны локальные загрузчики страниц; добавлены тесты маршрутизации и защиты от повторных запросов в StrictMode. |
| P3-12 «Шаг 2 регистрации (вёрстка)» | Al-Du9270-art | [PR #174](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/174) влит 11.11.2026, issue #45 закрыта. Шаг собран на готовых Input, DatePicker, Select, MultiSelect, Button и Avatar; добавлены состояния загрузки/ошибки справочников, тесты, stories, README и JSDoc. Черновик готов в P6-01, запись полей и файлы остаются в P6-04; связь категорий готова в P6-03 (PR #186). |
| P5-02 «Панель фильтров в действии» | viceede | [PR #175](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/175) влит 11.11.2026, issue #60 закрыта. Выборы панели пишутся в `catalogFilter`, счётчик берётся селектором, общий сброс очищает store; результаты, плашки и сортировка завершены в P5-05 (PR #194). |
| P7-01 «Страница навыка с данными» | kirill-ai-dev | [PR #173](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/173) влит 10.11.2026, issue #74 закрыта. Подключены селекторы и загрузочные thunk-и для прямого `/skill/:id`, состояния загрузки/ошибки и 404; обновлены тесты, stories и документация. Создание обмена завершено в P7-03 (PR #195). |
| P7-02 «Похожие предложения» | kirill-ai-dev | [PR #177](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/177) влит 11.11.2026, issue #75 закрыта. Добавлен мемоизированный `selectSimilarUsers`, исключён автор навыка, пустой блок скрывается; переиспользованы `OfferCard` и `OffersCarousel`, добавлены тесты и документация. |
| P3-09 «Страница навыка (вёрстка)» | sosolet | [PR #166](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/166) влит 10.11.2026, issue #42 закрыта. Страница собрана из готовых UserProfileCard, SkillInfo, OffersCarousel и ExchangeProposedModal; добавлены stories и тесты. Исправление отображения галереи вошло в [PR #172](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/172). Данные подключены в P7-01, действия обмена подключены в P7-03 (PR #195). |
| P3-10 «Каталог (вёрстка)» | kirill-ai-dev | [PR #171](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/171) влит 10.11.2026, issue #43 закрыта. CatalogPage собирает панель фильтров и секции «Популярное», «Новое», «Рекомендуем», а режим результатов — `ActiveFilters` и `SortToggle`. Переиспользованы готовые `OffersSection`, `OfferCard`, `FiltersPanel` и `Tag`; добавлены stories, тесты и скриншоты. Бизнес-логика фильтров, поиска, лайков и догрузки остаётся в задачах фаз 4–5. |
| P3-05 «Лейауты страниц» | Al-Du9270-art | [PR #157](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/157) влит. MainLayout собирает готовые Header и Footer, AuthLayout — Logo и Button; рамки на токенах, main предоставляет страница. Проверены навигация и клавиатура. Issue #38 закрыта, Done. |
| P5-03 «Поиск» | pwkdmc | [PR #158](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/158) влит. Я исправил внешнее применение/сброс, включая повторные команды, убрал копии store в тестах и stories, актуализировал README/JSDoc. Проверил сохранение применённого запроса при переходе на вход и обратно; добавлен интеграционный тест лейаутов. Issue #61 закрыта, Done. |
| P2-12 | Laurovsky | [PR #162](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/162) влит, issue #28 закрыта. DatePicker на Input и react-datepicker: ручной ввод и календарь, русский язык, месяц/год, «Отменить» / «Выбрать», ISO без часового пояса, ошибка и сброс. Добавлены тесты и stories; правила возраста задаёт форма. |
| P2-17 | Laurovsky | [PR #163](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/163) влит, issue #33 закрыта. MultiSelect переиспользует стили раскрывающегося поля Select и Checkbox; управляемый множественный выбор, первое выбранное название и «+N», клавиатура, ошибка и disabled. Добавлены тесты и stories; связь категорий реализована в P6-03 (PR #186). |
| P3-06 | kirill-ai-dev | [PR #165](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/165) влит, issue #39 закрыта. CategoriesList и CategoriesMenu переиспользуются в слоте Header и на /skills; CategoryIcon использует токены. Предусмотрены загрузка, ошибка и пустой список; тесты, stories и скриншоты в docs/assets. После P4-04 запросы и повтор при ошибке выполняет DataProvider, список только читает store. |
| P3-07 | alicevdr | [PR #148](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/148) влит, issue #40 закрыта. Панель и группы фильтров свёрстаны на общих Checkbox/RadioGroup и токенах, справочники поступают через селекторы. Все 6 категорий видимы как в макете; раскрытие нужно только для дополнительных категорий. В границе P3-07 выбор был визуальным; подключение к Redux выполнено отдельно в P5-02. |
| P3-11 | kkiitlin | [PR #164](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/164) влит, issue #44 закрыта. Вход и шаг 1 регистрации собирают общие AuthPageLayout, CredentialsForm, Input, PasswordInput, Button и OAuthButtons. Поддержаны callback-пропсы, ошибки и отправка формы; добавлены тесты и stories. Вход с сессией — P4-09, черновик и валидация регистрации — фаза 6. |
| P3-16 | muntaniolirina | [PR #167](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/167) влит, issue #49 закрыта. Готовы /about с карточками TEAM, 404 и /500; ErrorPage переиспользует иллюстрацию, заголовок и описание, действия собраны страницами. ErrorBoundary добавлен в P8-01 (PR #189); наполнение всей команды — P8-02. |
| P4-03 | Nick-Shvd | [PR #161](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/161) влит, issue #52 закрыта. Готовы загрузочные thunks пользователей и навыков, статусы/ошибки и селекторы по id, пользователю, популярности и новизне. Учтены пустые данные и отсутствующие ссылки, добавлены тесты. Загрузка при старте добавлена в P4-04 (PR #181); запись завершена в P4-06 (PR #191). |
| P8-02, личные вклады | pwkdmc, viceede, kirill-ai-dev, muntaniolirina | [PR #159](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/159), [PR #168](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/168), [PR #169](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/169) и [PR #170](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/170) влиты; в TEAM на `develop` четыре записи. Общая issue #81 открыта. |

P8-02 остаётся в Review с назначением `pwkdmc`; четыре личных вклада приняты. Я добавил свою карточку (`kirill-ai-dev`): роль тимлида и архитектора, GitHub и рассказ о себе. Добавил фото `public/images/team/t2.jpg`; карточка и фото включены в [PR #169](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/169). Общую карточку закрываем после наполнения команды; её текущее положение на доске — Review.

## Проверки текущего состояния

Основа сверки — `origin/develop` (`125a681`, после PR #197) на 13.11.2026. Для этого коммита успешно завершился [CI](https://github.com/PM-YandexPracticum/SkillSwap_58_4/actions/runs/43475765561): линтеры, TypeScript, 1210 тестов в 147 файлах и сборка. В архитектурной ветке отдельно пройден `npm run verify`: TypeScript, ESLint/Stylelint и 1220 тестов в 147 файлах. Разница в десять тестов относится к ранее подготовленным техническим правкам архитектурной ветки, которые ещё не влиты в `develop`; они не считаются новыми выполненными задачами. Результаты покрытия и Storybook ниже относятся к указанным ревью.

| Проверка | Результат |
|---|---|
| `npm run typecheck` | Пройдена в CI `125a681` |
| `npm run lint` | ESLint и Stylelint пройдены в CI `125a681` |
| `npm run test` | 147 файлов, 1210 тестов — все проходят в CI `125a681` (13.11.2026) |
| Покрытие модулей записи P4-06 | 98,73 % строк, 93,85 % ветвей; целевая проверка изменённых модулей данных при ревью PR #191 |
| Покрытие UI при ревью P3-13 | statements 97,18 %, branches 89,18 %; только затронутые UI-компоненты, не весь проект |
| Общее покрытие на `c42284e` (исторический прогон 12.11.2026) | 125 файлов, 1009 тестов; statements/lines 98,75 %, branches 97,67 %, functions 89,00 % |
| `npm run build` | Пройдена в CI `125a681`; предупреждение Vite о крупном общем чанке остаётся |
| `npm run build-storybook` | Пройдена при ревью P3-13 (PR #196); Vite предупреждает о крупных чанках Storybook |
| Документация | Статусы доски, назначения issues, принятые результаты и оставшиеся зависимости сверены на 13.11.2026; проверены счётчики и относительные ссылки изменённых документов |
Покрытие считается по текущему `vitest.config.ts`, включая тестовые файлы; оно не заменяет отдельную оценку ядра в P8-07. Результаты браузерных проверок относятся к соответствующим ревью. Согласованное замечание по контрасту P3-15 остаётся в [бэклоге](backlog.md). Сквозные сценарии Playwright, Lighthouse и финальная сверка всех экранов с макетом остаются в P8-04…P8-07; готовность всего MVP пока не подтверждена.

## P4-07 — результат проверки

Я завершил реализацию P4-07: подготовил операции API/Redux для обменов и уведомлений. Сводка завершённых задач выше включает эту задачу. Ниже — результаты на момент её влития 05.11.2026; текущие общие проверки приведены выше.

- 54 тестовых файла, 399 тестов — все проходят без пропусков (44 новых теста P4-07).
- `npm run test:coverage`: statements/lines 91,36 %, branches 92,00 % по текущему конфигу проекта.
- Отдельно API и model обменов/уведомлений, без тестовых файлов и типов: statements/lines 99,62 %, branches 97,58 %, functions 100 %.
- Пройдены ESLint/Stylelint, Prettier по изменённому коду, TypeScript, сборка Vite и Storybook; относительные ссылки в Markdown проверены, отсутствующих файлов нет.
- Проверены перезагрузка store и повторный импорт модулей API, повторная пара пользователей (в том числе одновременно), смена настоящей сессии во время записи, сохранение чтения/очистки, частичная ошибка записи и повтор операции.
- Повторное ревью выявило и исправило преждевременный `succeeded` при параллельных запросах. `pendingRequests` удерживает `loading`, пока группа не завершена; ошибка одной операции не затирается успехом другой. На оба случая добавлены регрессионные тесты для двух слайсов.

На момент P4-07 UI не менялся. Кнопка и toast затем подключены в P7-03 (PR #195); панель и колокольчик остаются в P7-05. Макет и скриншот UI для этой задачи не требуются.

P7-04 (#77) завершена в PR #155, P7-03 (#76) — в PR #195. P7-05 (#78, In Progress) зависит от P5-09 (In Progress). Загрузка сохранённых обменов в каталог уже подключена в P5-04 (PR #178).

## Сверка описаний задач

Для всех **95 задач фаз 1–9** сверены issue, статус, назначение и оставшиеся прямые зависимости. Для 86 задач MVP указан фактический статус доски; для фазы 9 — issues вне доски MVP, закрытые как `not planned`, без зачёта в выполненные. Для каждой завершённой задачи результат и PR отражены ниже и в файле фазы; P1-13 принята как работа на доске и встрече без отдельного PR. Общая P8-02 учитывается отдельно от завершённых задач.

Статусы и результаты в документации сверены с `develop` и GitHub на 13.11.2026; исторические проверки помечены датой. Ранее в PR #190 уточнены описания задач по текущему коду: готовые API и компоненты, оставшаяся интеграция и границы соседних задач. На момент той актуализации я обновил описания 19 открытых issues: #55, #58, #63–66, #68–73, #76, #78–79, #81–82, #84 и #86. После записи тексты перечитаны; названия, назначения и состояния issues сохранены, колонки доски не менялись. В текущей сверке обновлена только локальная документация. Ревью реализации и сверка экранов с Figma выполняются в соответствующих задачах.

## Как заполнять

- После влития PR отмечаем ✅ в файле фазы, результат и PR, счётчики roadmap и отчёта.
- **Исполнитель завершённой задачи** — автор PR; дата влития — по Москве. В личных мини-PR P8-02 отмечаем участника карточки, даже если PR по его данным оформил тимлид. Для открытой задачи показываем текущее назначение GitHub.
- P8-02 состоит из личных мини-PR: вклад отмечаем отдельно; всю задачу закрываем после добавления команды. В мини-PR пишем `Refs #81`, без `Closes #81`.

## Сейчас в работе

Ориентиры по срокам — в [README задач](README.md#сроки). Таблица отражает фактические колонки и назначения на 13.11.2026.

| Задача | Исполнитель | Состояние и оставшиеся зависимости |
|---|---|---|
| [P4-09 Вход 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/58) | `Laurovsky` | In Progress; все прямые зависимости закрыты |
| [P5-06 Лента «Рекомендуем» и результатов 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/64) | `kkiitlin` | In Progress; все прямые зависимости закрыты |
| [P5-07 Лайки со счётчиком 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/65) | `Stanislave0` | In Progress; P4-09 (In Progress), запись через P4-06 готова |
| [P5-09 Шапка вошедшего и выход 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/67) | `Laurovsky` | In Progress; P4-09 (In Progress) |
| [P6-02 Шаг 1: email и пароль 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/69) | `Al-Du9270-art` | In Progress; все прямые зависимости закрыты |
| [P6-05 Шаг 3: свой навык и превью 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/72) | `alicevdr` | In Progress; все прямые зависимости закрыты, форма и окна P3-13 готовы |
| [P7-05 Уведомления в действии 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/78) | `muntaniolirina` | In Progress; P5-09 (In Progress) |
| [P8-02 Команда на странице «О проекте» 🟢](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/81) | `pwkdmc` | Review; четыре личных вклада приняты, общая задача открыта; все прямые зависимости закрыты |
| [P8-03 Пустые списки 🟢](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/82) | `Nick-Shvd` | In Progress; P5-05 (Done), P5-08 (Todo) |
| [P8-05 Автотесты главных сценариев 🔴](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/84) | `kirill-ai-dev` | In Progress; итоговые сценарии после интеграции фаз 5–7, готовые проверяются по частям |

Текущие назначения сохраняют владельцев задач и их очередь. P8-05 уже в In Progress у `kirill-ai-dev`; в Backlog остаются P8-04/P8-06 (`viceede`) и P8-07 (`kirill-ai-dev`).

## Готовность к Todo

Todo — ближайшая очередь фиксированного состава команды после текущих In Progress / Review. Незавершённая зависимость не запрещает перенос: её статус указываем явно, API и общие файлы согласуем перед интеграцией.

В Todo **четыре задачи**: P5-08 — `muntaniolirina`, P6-04 — `sosolet`, P6-06 — `Stanislave0`, P7-06 — `Nick-Shvd`. Все задачи имеют назначенного исполнителя.

| Задача | Исполнитель | Для интеграции остаётся |
|---|---|---|
| [P5-08 Страница избранного 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/66) | `muntaniolirina` | P5-07 (In Progress), P4-09 (In Progress) |
| [P6-04 Шаг 2: о себе и «Хочу научиться» 🔴](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/71) | `sosolet` | P6-01 (Done), P6-02 (In Progress) |
| [P6-06 Завершение регистрации 🔴](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/73) | `Stanislave0` | P6-02 (In Progress), P6-04 (Todo), P6-05 (In Progress) |
| [P7-06 «Личные данные»: сохранение 🔴](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/79) | `Nick-Shvd` | P4-09 (In Progress), P6-04 (Todo); запись через P4-06 готова |

В Backlog остаются **три финальные задачи**:

| Задача Backlog | Исполнитель | Оставшиеся прямые зависимости |
|---|---|---|
| [P8-04 Доступность 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/83) | `viceede` | завершение фаз 5–7 |
| [P8-06 Сверка с макетом и демо 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/85) | `viceede` | P8-04 (Backlog) |
| [P8-07 Проверка критериев приёмки 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/86) | `kirill-ai-dev` | P8-05 (In Progress), P8-06 (Backlog) |

Новых задач Backlog с полностью закрытыми зависимостями нет. P8-04 можно перенести в Todo как следующую проверку готовых экранов; завершение фаз 5–7 остаётся условием итоговой проверки. P8-05 уже в работе. P8-06 идёт после P8-04, P8-07 — после P8-05/P8-06. Переносы на доске согласуем отдельно. Девять дополнительных задач фазы 9 остаются вне ближайшей очереди до завершения MVP.

## По исполнителям

Считаю все полностью завершённые задачи MVP фаз 1–8, включая подготовку. Девять задач фундамента и личные вклады P8-02 указаны отдельно; дополнительные технические правки не считаются новыми задачами. Исполнители принятых работ — по подробным таблицам ниже; текущие назначения — по GitHub.

| Исполнитель | Сделано MVP | Завершённые задачи | Текущие назначения |
|---|---|---|---|
| kirill-ai-dev | 14; ещё 9 задач фундамента; личный вклад P8-02 принят | P1-10, P1-12, P3-01, P3-06, P3-08, P3-10, P4-01, P4-05, P4-07, P4-10, P5-01, P7-01, P7-02, P7-03 | P8-05 (In Progress), P8-07 (Backlog) |
| viceede | 7; личный вклад P8-02 принят | P1-09, P1-11, P1-13, P1-14, P3-02, P5-02, P5-05 | P8-04 (Backlog), P8-06 (Backlog) |
| muntaniolirina | 8; личный вклад P8-02 принят | P1-02, P2-04, P2-11, P2-14, P3-15, P3-16, P4-08, P6-03 | P7-05 (In Progress), P5-08 (Todo) |
| pwkdmc | 7; личный вклад P8-02 принят | P1-03, P1-08, P2-08, P2-13, P2-16, P4-02, P5-03 | P8-02 (Review) |
| Laurovsky | 6 | P1-05, P2-05, P2-07, P2-12, P2-17, P4-04 | P4-09 (In Progress), P5-09 (In Progress) |
| Al-Du9270-art | 5 | P2-02, P2-10, P2-15, P3-05, P3-12 | P6-02 (In Progress) |
| alicevdr | 6 | P1-06, P2-03, P3-07, P3-14, P7-04, P8-01 | P6-05 (In Progress) |
| sosolet | 5 | P1-01, P2-18, P3-09, P3-13, P5-04 | P6-04 (Todo) |
| Stanislave0 | 2 | P2-01, P2-09 | P5-07 (In Progress), P6-06 (Todo) |
| Nick-Shvd | 3 | P1-07, P4-03, P4-06 | P7-06 (Todo), P8-03 (In Progress) |
| kkiitlin | 6 | P1-04, P2-06, P3-03, P3-04, P3-11, P6-01 | P5-06 (In Progress) |

**Всего:** 69 завершённых задач MVP у 11 участников; с фундаментом — 78. Четыре личных вклада P8-02 учитываются отдельно.

## Фаза 0 — Фундамент

| Задача | Исполнитель | Итог | Влито | PR |
|---|---|---|---|---|
| Фаза 0 (P0-01…P0-09) | kirill-ai-dev | Структура FSD с заглушками и README в каждой папке, модель данных и образцы, ТЗ, правила и план из 104 задач | 2026-10-29 | [#4](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/4) |

## Фаза 1 — Подготовка

| Задача | Исполнитель | Итог | Влито | PR |
|---|---|---|---|---|
| [P1-11](phases/phase-01-preparation.md) 👑 Установка Storybook 🟡 | viceede | Storybook установлен с аддонами a11y, docs и designs (ссылка на фрейм Figma), настроены `main.ts` и `preview.tsx`, команды `storybook` и `build-storybook` | 2026-10-29 | [#99](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/99) |
| [P1-01](phases/phase-01-preparation.md) Дизайн-токены из Figma 🟡 | sosolet | Цвета, шрифты, отступы и размеры макета записаны CSS-переменными в `global.css`, шрифты подключены в `index.html` | 2026-10-30 | [#98](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/98) |
| [P1-09](phases/phase-01-preparation.md) 👑 Окружение разработчика 🟢 | viceede | Одна версия Node для всех (`.nvmrc`, `engines`), рекомендуемые расширения и форматирование при сохранении в `.vscode/` | 2026-10-30 | [#100](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/100) |
| [P1-03](phases/phase-01-preparation.md) Картинки и иллюстрации 🟢 | pwkdmc | Аватары и фото навыков для Ивана, Анны и Марии, заглушки, иллюстрации входа, шагов регистрации, 404 и 500. После влития я сжал фото с 5,8 МБ до 1 МБ для будущей оптимизации по производительности | 2026-10-30 | [#101](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/101) |
| [P1-02](phases/phase-01-preparation.md) Иконки из Figma 🟢 | muntaniolirina | 40 иконок, сверенных с макетом: имена по слоям Figma, подпапки `categories/` и `brands/`, README с id фреймов. На ревью: зеркально отражён `logout`, добавлены радиокнопки, настроен импорт `?react` в TypeScript и тестах | 2026-10-30 | [#102](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/102) |
| [P1-14](phases/phase-01-preparation.md) 👑 Инструменты коммитов 🟡 | viceede | Commitizen и команда `npm run commit` для сообщений по Conventional Commits, Husky: проверки перед коммитом и push, раздел в `git-workflow.md` | 2026-10-30 | [#103](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/103) |
| [P1-05](phases/phase-01-preparation.md) Моки: города и категории 🟢 | Laurovsky | 6 категорий и 42 подкатегории, 15 городов — всё по макету, старые id сохранены. На ревью: добавлены Самара и Саратов (пример поиска «Са» в макете), `icon` категорий приведены к файлам иконок | 2026-10-31 | [#108](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/108) |
| [P1-10](phases/phase-01-preparation.md) 👑 Библиотеки: календарь, карусель, тесты 🟢 | kirill-ai-dev | `react-datepicker` 9 и `embla-carousel-react` 8 для P2-12 и P2-13; пакет покрытия и Playwright с командой `npm run e2e`; README и задачи P2-12, P2-13, P8-05, P8-07 обновлены | 2026-10-31 | [#110](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/110) |
| [P1-12](phases/phase-01-preparation.md) 👑 Линтер правил FSD 🟡 | kirill-ai-dev | ESLint проверяет импорты FSD: только вниз по слоям, без соседних слайсов, через `index.ts`; текст ошибки подсказывает, как исправить; исключение для тестов (`@/app/test`) | 2026-10-31 | [#111](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/111) |
| [P1-08](phases/phase-01-preparation.md) Моки: пользователи и навыки, часть 3 🟢 | pwkdmc | 14 пользователей и навыков «Здоровье и лайфстайл» и «Дом и уют», фото сжаты до 400×400 и 800×800. На ревью: «Хочу научиться» больше не совпадает со своим навыком, email уникальные (имя + номер), убрана ссылка на отсутствующее фото | 2026-11-01 | [#115](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/115) |
| [P1-06](phases/phase-01-preparation.md) Моки: пользователи и навыки, часть 1 🟢 | alicevdr | 14 пользователей и навыков «Бизнес и карьера» и «Творчество и искусство» с фото. На ревью: id подкатегорий приведены к справочнику P1-05, у навыков добавлен `createdAt`, добавлены недостающие фото; я дописал ссылки на 10 загруженных фото | 2026-11-01 | [#112](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/112) |
| [P1-07](phases/phase-01-preparation.md) Моки: пользователи и навыки, часть 2 🟢 | Nick-Shvd | 14 пользователей и навыков «Иностранные языки» и «Образование и развитие» с фото. На ревью я добавил 14-го пользователя (u31, фото из макета), исправил автора s18 и ссылку на фото s20, сделал уникальными email, лайки и даты | 2026-11-01 | [#120](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/120) |
| [P1-13](phases/phase-01-preparation.md) 👑 Доска, шаблоны и онбординг 🟢 | viceede | Доска с колонками Backlog, Todo, In progress, Review, Need fix, Done; онбординг команды проведён на видеовстрече. Шаблон PR и `onboarding.md` не дописывали — главное было в доске и встрече | 2026-11-01 | — |
| [P1-04](phases/phase-01-preparation.md) Подготовка к тестам: образец и помощники 🟡 | kkiitlin | `getAge` с тестом-образцом (9 случаев, в том числе 29 февраля), фабрики `createUser()` и `createSkill()` в `@/entities/*/testing`, `createAppStore()` и `renderWithProviders` со store и роутером, правила в `testing.md`. На ревью я разрешил в линтере импорт фабрик в тестах и stories, убрал BOM и выровнял образец | 2026-11-02 | [#122](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/122) |

## Фаза 2 — UI-кит

| Задача | Исполнитель | Итог | Влито | PR |
|---|---|---|---|---|
| [P2-04](phases/phase-02-ui-kit.md) Avatar 🟢 | muntaniolirina | Аватар трёх размеров по макету (48, 100, 244 px), заглушка без фото, `resolveImageUrl`, 7 тестов, 4 story. Я добавил описания пропсов и тесты через `getByRole` | 2026-11-01 | [#116](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/116) |
| [P2-02](phases/phase-02-ui-kit.md) Кнопки Button и IconButton 🟢 | Al-Du9270-art | Button (primary, secondary, ghost) и IconButton, цвета наведения, нажатия и disabled по переменным макета (поправлены токены), 5 тестов. На ревью: исправлены `onClick` и `type`; тимлид отформатировал stories и обновил README | 2026-11-01 | [#114](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/114) |
| [P2-11](phases/phase-02-ui-kit.md) Stepper 🟢 | muntaniolirina | Индикатор «Шаг N из 3» с тремя полосками, пройденные шаги зелёные; тесты и stories | 2026-11-01 | [#118](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/118) |
| [P2-08](phases/phase-02-ui-kit.md) Dropdown 🟡 | pwkdmc | Поповер под кнопкой: закрытие по Esc и клику мимо, хук `useClickOutside` с тестом, stories трёх меню. На ревью: сдвиг внутрь окна на 36px по макету без мигания, выравнивание `end` для правых кнопок шапки, живые stories с `onClose` | 2026-11-01 | [#119](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/119) |
| [P2-01](phases/phase-02-ui-kit.md) Logo и Loader 🟢 | Stanislave0 | Логотип-ссылка на главную по макету шапки (1:2870), вариант без текста; спиннер с `role="status"`; CSS Modules, тесты. На ревью: JSDoc перенесён к функциям и пропсам, ссылки на макет в stories, из lock-файла убран clsx | 2026-11-01 | [#113](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/113) |
| [P2-03](phases/phase-02-ui-kit.md) Tag и плашка 🟢 | alicevdr | Цветной чип навыка с цветом снаружи (`color`) и крестиком по `onRemove` — один компонент для чипа и плашки фильтра; stories со всеми цветами категорий, тесты. Ревью — viceede | 2026-11-03 | [#121](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/121) |
| [P2-16](phases/phase-02-ui-kit.md) Общие правила валидации 🟡 | pwkdmc | Шесть правил полей (email, пароль, имя, дата рождения, текст, город) на лимитах и текстах из конфигов и `validation.md`; 36 тестов, повторяющиеся случаи таблицей. Ревью — viceede | 2026-11-03 | [#128](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/128) |
| [P2-14](phases/phase-02-ui-kit.md) FileDropzone 🟡 | muntaniolirina | Зона загрузки фото: перетаскивание и выбор файла, превью с крестиком, с клавиатуры — одна кнопка; `validateImageFile` и `fileToDataUrl` с уменьшением фото до 800 px в JPEG; 23 теста, 9 stories. На ревью я влил develop, вынес 800 px и качество JPEG в `VALIDATION.IMAGE`, перевёл тесты на поиск по роли, добавил тест белой заливки холста | 2026-11-03 | [#132](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/132) |
| [P2-05](phases/phase-02-ui-kit.md) Поля Input и Textarea 🟢 | Laurovsky | Поля с подписью, ошибкой и иконкой справа, `forwardRef` для react-hook-form, ошибка связана через `aria-describedby`; 18 тестов, stories. На ревью я добавил кликабельную кнопку справа `rightAction` (для PasswordInput и поиска в Select), высоту 48 px и интервал по макету | 2026-11-03 | [#135](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/135) |
| [P2-07](phases/phase-02-ui-kit.md) Checkbox и RadioGroup 🟡 | Laurovsky | Настоящие `input` под значками — клавиатура и скринридер работают без своего кода; частичный выбор категории; 17 тестов, живые stories. На ревью я привёл заголовок группы и интервалы к макету, убрал лишний `aria-checked` | 2026-11-03 | [#137](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/137) |
| [P2-10](phases/phase-02-ui-kit.md) Modal 🟡 | Al-Du9270-art | Обёртка поверх затемнённой страницы: portal, Esc и клик по фону, фокус внутри окна и возврат после закрытия; содержимое через `children`. На ревью я исправил сброс фокуса при перерисовке родителя, добавил прокрутку высокого окна и блокировку страницы, убрал внутренние отступы (у окон они разные), сделал `ariaLabel` обязательным; 7 тестов | 2026-11-03 | [#138](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/138) |
| [P2-13](phases/phase-02-ui-kit.md) Carousel 🟡 | pwkdmc | Обёртка над `embla-carousel-react` со стрелками, настройками числа слайдов и обратными вызовами API и выбора; тесты и stories галереи, превью навыка и похожих предложений | 2026-11-03 | [#127](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/127) |
| [P2-18](phases/phase-02-ui-kit.md) Toast 🟡 | sosolet | Toast, контекст и `useToast`, подключённый в App провайдер с независимыми таймерами на 4 с; закрытие мышью и клавиатурой, область объявлений скринридером. На ревью тимлид сверил вёрстку с Figma, исправил перенос текста и очистку ресурсов, добавил живые stories и тесты; бизнес-сценарий обмена остаётся в P7-03 | 2026-11-04 | [#140](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/140) |
| [P2-15](phases/phase-02-ui-kit.md) Лента с догрузкой 🟡 | Al-Du9270-art | `useInfiniteScroll` с порциями по прокрутке, состояниями загрузки и окончания списка; сброс при смене данных, отмена таймеров и очистка наблюдателей. На ревью я дополнил обработку пограничных ситуаций и 36 тестов; подключение в каталоге и избранном остаётся в P5-06/P5-08 | 2026-11-06 | [#152](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/152) |
| [P2-06](phases/phase-02-ui-kit.md) PasswordInput 🟢 | kkiitlin | Поле на основе Input: показать/скрыть пароль, подсказка через `hint`, ошибка вместо подсказки, доступная кнопка, ref и совместимость с react-hook-form. При disabled глаз скрыт; 9 тестов, 5 stories. Ревью и влитие — viceede | 2026-11-07 | [#146](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/146) |
| [P2-09](phases/phase-02-ui-kit.md) Select 🟡 | Stanislave0 | Обычный и searchable Select с единым раскрывающимся полем, поиском и очисткой; клавиатура, ошибки и disabled. На ревью я уточнил ARIA, фокус и обновление вариантов, дополнил тесты; MultiSelect готов в P2-17 | 2026-11-07 | [#145](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/145) |
| [P2-12](phases/phase-02-ui-kit.md) DatePicker 🟡 | Laurovsky | DatePicker на Input и react-datepicker: ручной ввод и календарь, русский язык, месяц/год, «Отменить» / «Выбрать», ISO без часового пояса, ошибка и сброс. Добавлены тесты и stories; правила возраста задаёт форма. | 2026-11-08 | [#162](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/162) |
| [P2-17](phases/phase-02-ui-kit.md) MultiSelect 🟡 | Laurovsky | MultiSelect переиспользует стили раскрывающегося поля Select и Checkbox; управляемый множественный выбор, первое выбранное название и «+N», клавиатура, ошибка и disabled. Добавлены тесты и stories; связь категорий готова в P6-03 (PR #186). | 2026-11-08 | [#163](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/163) |

## Фаза 3 — Вёрстка блоков и страниц

| Задача | Исполнитель | Итог | Влито | PR |
|---|---|---|---|---|
| [P3-01](phases/phase-03-layout.md) Карточка пользователя UserCard 🔴 | kirill-ai-dev | Карточка каталога по макету: `UserSummary` (общий с P3-02), `SkillTag`, «+N» по `CATALOG.CARD_LEARN_TAGS`, `pluralize`; данные пропсами, лайк и «Подробнее» — слотами; длинные названия обрезаются с подсказкой; story на настоящих данных из `public/db`. Задача-образец для команды | 2026-11-03 | [#133](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/133) |
| [P3-03](phases/phase-03-layout.md) Подвал 🟢 | kkiitlin | Готовый Logo, три колонки ссылок и «SkillSwap — 2025»; рабочие переходы на `/about` и `/skills`, остальные пункты — неинтерактивные заглушки; 8 тестов и story. На ревью уточнён интервал копирайта и подключён общий `ROUTER_FUTURE`; подключён в MainLayout в P3-05 | 2026-11-04 | [#141](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/141) |
| [P3-08](phases/phase-03-layout.md) Карточка предложения и секция 🟡 | kirill-ai-dev | `OfferCard` собирает UserCard, визуальное сердечко со счётчиком и ссылку на навык; `OffersSection` — сетка по три и независимое раскрытие 3 ⇄ 9 с анимацией и поддержкой reduced motion. Карточка передаётся через `renderItem`; 14 новых тестов, stories и сверка с Figma. Лайки и догрузка остаются в P5-07/P5-06; бейдж обмена уже добавлен в P7-04 | 2026-11-04 | [#142](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/142) |
| [P3-15](phases/phase-03-layout.md) Уведомления (вёрстка) 🟢 | muntaniolirina | `NotificationItem`, `NotificationsPanel` и `MarkAllReadButton` со состояниями новых, просмотренных и пустого списка; callback-пропсы без Redux и сохранения, 24 новых теста, stories, README и сверка размеров с Figma. Сохранение готово в P4-07; подключение к шапке остаётся в P7-05 | 2026-11-05 | [#143](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/143) |
| [P3-02](phases/phase-03-layout.md) Карточка автора и блок навыка 🟡 | viceede | `UserProfileCard` с данными автора и чипами, `SkillInfo` с описанием и галереей на Carousel, слоты действий через пропсы; публичные экспорты, тесты и stories. Сборка блоков выполнена в P3-09, данные подключены в P7-01 | 2026-11-06 | [#150](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/150) |
| [P3-04](phases/phase-03-layout.md) Шапка (вёрстка) 🟡 | kkiitlin | Header гостя и вошедшего, меню через слоты и SearchInput с Enter/лупой и очисткой; тесты, stories и README. На ревью я уточнил ARIA-связи, пустые слоты и клавиатуру, сохранил нативные ссылки и кнопки; лейаут и поиск подключены в P3-05/P5-03, сессия и уведомления остаются в P5-09/P7-05 | 2026-11-07 | [#153](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/153) |
| [P3-05](phases/phase-03-layout.md) Лейауты страниц 🟢 | Al-Du9270-art | MainLayout с готовыми Header/Footer и AuthLayout с Logo/Button; контейнеры на токенах, main и формы остаются у страниц. На ревью я уточнил переиспользование и навигацию, добавил тесты клавиатуры и обновил README; подключение поиска проверено дополнительно в P5-03 | 2026-11-08 | [#157](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/157) |
| [P3-06](phases/phase-03-layout.md) Все навыки: меню и страница 🟡 | kirill-ai-dev | CategoriesList и CategoriesMenu переиспользуются в слоте Header и на /skills; CategoryIcon использует токены. Предусмотрены загрузка, ошибка и пустой список; тесты, stories и скриншоты в docs/assets. После P4-04 запросы и повтор при ошибке выполняет DataProvider, список только читает store. | 2026-11-08 | [#165](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/165) |
| [P3-07](phases/phase-03-layout.md) Панель фильтров (вёрстка) 🟡 | alicevdr | Панель и группы фильтров свёрстаны на общих Checkbox/RadioGroup и токенах, справочники поступают через селекторы. Все 6 категорий видимы как в макете; раскрытие нужно только для дополнительных категорий. В границе P3-07 выбор был визуальным; подключение к Redux выполнено отдельно в P5-02. | 2026-11-09 | [#148](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/148) |
| [P3-11](phases/phase-03-layout.md) Вход и шаг 1 регистрации (вёрстка) 🟢 | kkiitlin | Вход и шаг 1 регистрации собирают общие AuthPageLayout, CredentialsForm, Input, PasswordInput, Button и OAuthButtons. Поддержаны callback-пропсы, ошибки и отправка формы; добавлены тесты и stories. Вход с сессией — P4-09, черновик и валидация регистрации — фаза 6. | 2026-11-09 | [#164](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/164) |
| [P3-12](phases/phase-03-layout.md) Шаг 2 регистрации (вёрстка) 🟡 | Al-Du9270-art | Шаг «Расскажите немного о себе» собран на готовых Input, DatePicker, Select, MultiSelect, Button и Avatar. Добавлены состояния загрузки/ошибки справочников, тесты, stories, README и JSDoc; черновик готов в P6-01, запись полей и файлы остаются в P6-04; связь категорий реализована в P6-03 (PR #186). | 2026-11-11 | [#174](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/174) |
| [P3-10](phases/phase-03-layout.md) Каталог (вёрстка) 🟡 | kirill-ai-dev | CatalogPage собирает панель фильтров и секции «Популярное», «Новое», «Рекомендуем», а режим результатов — `ActiveFilters` и `SortToggle`. Переиспользованы готовые `OffersSection`, `OfferCard`, `FiltersPanel` и `Tag`; добавлены stories, тесты и скриншоты. Логика фильтров, поиска, лайков и догрузки остаётся в фазах 4–5. | 2026-11-10 | [#171](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/171) |
| [P3-16](phases/phase-03-layout.md) «О проекте», 404 и 500 🟢 | muntaniolirina | Готовы /about с карточками TEAM, 404 и /500; ErrorPage переиспользует иллюстрацию, заголовок и описание, действия собраны страницами. ErrorBoundary добавлен в P8-01 (PR #189); наполнение всей команды — P8-02. | 2026-11-09 | [#167](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/167) |
| [P3-14](phases/phase-03-layout.md) Личный кабинет (вёрстка) 🟡 | alicevdr | Собраны ProfilePage с вложенными разделами, ProfileSidebar с активным пунктом и ProfilePersonal с формой и аватаром. Четыре остальных раздела показывают общий ProfileStub. Добавлены CSS Modules, тесты и stories. Поля пока используют демонстрационное локальное состояние; сохранение, смена пароля и аватара остаются в P7-06. | 2026-11-12 | [#183](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/183) |
| [P3-09](phases/phase-03-layout.md) Страница навыка (вёрстка) 🟡 | sosolet | Страница собрана из UserProfileCard, SkillInfo, OffersCarousel и ExchangeProposedModal; добавлены stories и тесты. Галерея уточнена в PR #172, подключение данных выполнено в P7-01. | 2026-11-10 | [#166](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/166) |
| [P3-13](phases/phase-03-layout.md) Шаг 3 регистрации и окна (вёрстка) 🟡 | sosolet | Форма навыка собрана на готовых полях, CategorySubcategorySelect и FileDropzone; страница соединяет features через слоты StepSkill. Предпросмотр и SkillInfo переиспользуют SkillGallery. При четырёх фото доступны удаление и замена, отправка ждёт обработки; ошибка чтения допускает повтор. Окна сверены с актуальной Figma, исправлен локальный контраст, добавлены тесты, stories, README и снимки. Валидация и сохранение остаются в P6-05/P6-06. | 2026-11-13 | [#196](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/196), история — [#197](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/197) |

## Фаза 4 — Данные и вход

| Задача | Исполнитель | Итог | Влито | PR |
|---|---|---|---|---|
| [P4-01](phases/phase-04-data.md) «База данных» в браузере 🔴 | kirill-ai-dev | `createMockCollection` (получить, создать, изменить, удалить) поверх localStorage с задержкой как у сервера и без мутаций; повреждённые данные, недоступный localStorage и нехватка места не ломают сайт; `resetMockDb()`; 18 тестов, сброс «базы» после каждого теста | 2026-11-02 | [#124](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/124) |
| [P4-10](phases/phase-04-data.md) 👑 Перенос образцов данных в `public/db` 🟡 | kirill-ai-dev | Образцы — JSON в `public/db` по ТЗ наставника, загрузка через `fetch` (`loadSeed`) один раз при первом обращении; действия коллекции по очереди; тесты читают `public/db` без сервера; данные ушли из JS (236 → 195 КБ) | 2026-11-02 | [#125](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/125) |
| [P4-02](phases/phase-04-data.md) Справочники: категории и города 🟡 | pwkdmc | Загрузка категорий и городов в store (`fetchCategories`, `fetchCities`) и селекторы: подкатегория по id, категория подкатегории, цвет категории, город по id. На ревью я добавил экспорт в `index.ts`, тесты статусов и загрузки из `public/db`, упростил `selectCategoryColor`; в `testing.md` — как проверять ошибку загрузки | 2026-11-03 | [#131](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/131) |
| [P4-05](phases/phase-04-data.md) Сессия 🟡 | kirill-ai-dev | Вход и выход одним действием (`startSession`, `endSession`) — сразу в store и localStorage; сессия переживает перезагрузку; повреждённые данные и недоступный localStorage не ломают сайт; 17 тестов | 2026-11-03 | [#136](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/136) |
| [P4-07](phases/phase-04-data.md) Обмены и уведомления 🟡 | kirill-ai-dev | API и Redux сохраняют обмены и уведомления в «базе», запрещают повторное предложение тому же пользователю, фильтруют данные по текущей сессии и поддерживают прочтение и очистку уведомлений; 44 новых теста | 2026-11-05 | [#147](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/147) |
| [P4-08](phases/phase-04-data.md) Защита закрытых страниц 🟢 | muntaniolirina | `RequireAuth` закрывает `/profile/*` и `/favorites`, гостя отправляет на вход с `replace` и полным `state.from`. На ревью я дополнил тесты до 10 случаев, экспорт типа пропсов и README роутера; возврат после входа остаётся в P4-09 | 2026-11-06 | [#149](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/149) |
| [P4-03](phases/phase-04-data.md) Пользователи и навыки 🟡 | Nick-Shvd | Готовы загрузочные thunks пользователей и навыков, статусы/ошибки и селекторы по id, пользователю, популярности и новизне. Учтены пустые данные и отсутствующие ссылки, добавлены тесты. Загрузка при старте добавлена в P4-04 (PR #181); запись готова в P4-06 (PR #191). | 2026-11-09 | [#161](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/161) |
| [P4-06](phases/phase-04-data.md) Сохранение пользователей и навыков 🟡 | Nick-Shvd | Добавлены операции записи через существующий mock API, отдельные статусы сохранения, нормализация и проверка уникальности email в API, обработка ошибок и регрессионные тесты. | 2026-11-12 | [#191](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/191) |
| [P4-04](phases/phase-04-data.md) Загрузка при старте 🟢 | Laurovsky | DataProvider загружает пользователей, навыки, категории и города перед открытием страниц. Во время загрузки показан Loader, ошибка ведёт на /500, повтор запрашивает только неуспешные коллекции. Убраны локальные загрузчики страниц; добавлены тесты маршрутизации и защиты от повторных запросов в StrictMode. | 2026-11-12 | [#181](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/181) |

## Фаза 5 — Каталог и избранное

| Задача | Исполнитель | Итог | Влито | PR |
|---|---|---|---|---|
| [P5-01](phases/phase-05-catalog.md) Логика фильтров 🔴 | kirill-ai-dev | Я реализовал `applyFilters`, Redux-действия, селекторы и публичный API: AND между блоками и поиском, OR внутри блока, режимы по данным автора, поиск по названию предложения, сортировки, удаление и сброс. 53 теста, 100 % покрытия ядра; поиск подключён в P5-03; панель подключена в P5-02; результаты завершены в P5-05 (PR #194) | 2026-11-07 | [#154](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/154) |
| [P5-02](phases/phase-05-catalog.md) Панель фильтров в действии 🟡 | viceede | Выборы панели фильтров пишутся в `catalogFilter`, счётчик берётся селектором, общий сброс очищает store. Компоненты и тесты переведены на реальное состояние Redux; вывод результатов, плашки и сортировка завершены в P5-05 (PR #194). | 2026-11-11 | [#175](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/175) |
| [P5-03](phases/phase-05-catalog.md) Поиск 🟡 | pwkdmc | SearchInput подключён к Redux: Enter/лупа, trim, очистка и фокус. На ревью я исправил внешние и повторные команды, переиспользовал общий renderWithProviders, сократил store stories и проверил переходы между лейаутами. Вёрстка списка готова в P3-10; данные и счётчик результатов подключены в P5-05 (PR #194) | 2026-11-08 | [#158](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/158) |
| [P5-04](phases/phase-05-catalog.md) Секции «Популярное» и «Новое» 🟢 | sosolet | CatalogPage передаёт в CatalogView отдельные списки из selectPopularUsers и selectNewUsers: по убыванию likesCount и createdAt. Секции независимо раскрываются 3 ⇄ 9 через общий OffersSection; повторы между секциями допустимы. Загрузка обменов защищена от повторного запуска в StrictMode; обновлены тесты, stories и README. | 2026-11-12 | [#178](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/178) |
| [P5-05](phases/phase-05-catalog.md) Результаты: плашки и сортировка 🟡 | viceede | `CatalogPage` применяет общую `applyFilters`, строит плашки и обрабатывает удаление и сортировку через действия store. Пустая выдача показывает сообщение; догрузка остаётся в P5-06. | 2026-11-13 | [#194](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/194) |

## Фаза 6 — Регистрация

| Задача | Исполнитель | Итог | Влито | PR |
|---|---|---|---|---|
| [P6-01](phases/phase-06-register.md) Черновик регистрации и охрана шагов 🟡 | kkiitlin | Черновик и прогресс шагов хранятся в Redux, guard защищает шаги 2–3, lifecycle очищает состояние только при выходе из регистрации. | 2026-11-13 | [#193](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/193) |
| [P6-03](phases/phase-06-register.md) Связь «категория ↔ подкатегория» 🟡 | muntaniolirina | Общий `CategorySubcategorySelect` поддерживает режимы `multiple` и `single`; чистые функции связывают списки, очищают устаревшие значения и не мутируют входные данные. Добавлены тесты, stories, README и JSDoc; шаги регистрации остаются в P6-04/P6-05. | 2026-11-12 | [#186](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/186) |

## Фаза 7 — Навык, обмен, уведомления, профиль

| Задача | Исполнитель | Итог | Влито | PR |
|---|---|---|---|---|
| [P7-03](phases/phase-07-skill-profile.md) «Предложить обмен» 🔴 | kirill-ai-dev | Создание обмена и уведомления с защитой от дублей, toast, окно подтверждения и восстановление после частичного сбоя. | 2026-11-13 | [#195](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/195) |
| [P7-04](phases/phase-07-skill-profile.md) «Обмен предложен» на карточке 🟢 | alicevdr | OfferCard показывает статичный ExchangeStatusBadge только для исходящего обмена текущего пользователя этому автору. На ревью я восстановил тесты карточки и дополнил проверки направления обмена, смены сессии, сохранения, ошибок и клавиатуры, синхронизировал stories и README; загрузка обменов подключена в P5-04 (PR #178) | 2026-11-07 | [#155](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/155) |
| [P7-01](phases/phase-07-skill-profile.md) Страница навыка с данными 🟡 | kirill-ai-dev | Подключены селекторы и загрузочные thunk-и для прямого `/skill/:id`, состояния загрузки/ошибки и 404; устранён повторный запуск загрузки в StrictMode, обновлены тесты, stories и документация. Создание обмена завершено в P7-03 (PR #195). | 2026-11-10 | [#173](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/173) |
| [P7-02](phases/phase-07-skill-profile.md) Похожие предложения 🟢 | kirill-ai-dev | Добавлен мемоизированный `selectSimilarUsers`, исключён автор навыка, пустой блок скрывается; переиспользованы `OfferCard` и `OffersCarousel`, добавлены тесты переходов и документация. | 2026-11-11 | [#177](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/177) |

## Фаза 8 — Финиш

| Задача | Исполнитель | Итог | Влито | PR |
|---|---|---|---|---|
| [P8-01](phases/phase-08-finish.md) Ошибка 500 и ErrorBoundary 🟢 | alicevdr | Корневой ErrorBoundary расположен над провайдерами приложения. Общий ServerErrorView используется на /500 и при ошибке рендера без зависимости от Router/Redux. После аварии «На главную» перезагружает приложение с учётом BASE_URL; обычная /500 сохраняет навигацию и повтор загрузки. Добавлены тесты, stories, README и снимок интерфейса. | 2026-11-12 | [#189](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/189) |

## Фаза 8 — принятые частичные результаты

Таблица не добавляет ✅ всей P8-02 и не входит в 69 завершённых задач MVP. Страница TEAM уже подключена в P3-16. В TEAM четыре участника; личные вклады перечислены ниже.

| Общая задача | Участник | Принятый вклад | Влито (Москва) | PR |
|---|---|---|---|---|
| [P8-02](phases/phase-08-finish.md) Команда | pwkdmc | Диана Дунаева: имя, роль, GitHub, описание, фото `/images/team/t0.jpg`; на ревью я исправил публичный путь | 2026-11-08 | [#159](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/159) |
| [P8-02](phases/phase-08-finish.md) Команда | viceede | Андрей Васильев: имя, роль помощника тимлида, GitHub, описание, фото `/images/team/t1.jpg` | 2026-11-09 | [#168](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/168) |
| [P8-02](phases/phase-08-finish.md) Команда | kirill-ai-dev | Кирилл Брюханов: роль тимлида и архитектора, GitHub, описание, фото `/images/team/t2.jpg`; все фото команды приведены к JPEG 400×400, добавлена favicon | 2026-11-09 | [#169](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/169) |
| [P8-02](phases/phase-08-finish.md) Команда | muntaniolirina | Ирина Мунтаниол: имя, роль разработчика, GitHub, авторский текст и фото `/images/team/t3.jpg`; квадрат 400×400, прогрессивный JPEG без EXIF, 25 КБ | 2026-11-09 | [#170](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/170) |

**Мой вклад (`kirill-ai-dev`):** добавил карточку тимлида с GitHub и рассказом о себе. Добавил фото `public/images/team/t2.jpg`, привёл все фото команды к единому формату и подключил favicon проекта. Изменения включены в [PR #169](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/169).
