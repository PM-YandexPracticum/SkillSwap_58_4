# Отчёт о задачах

Кто какую задачу сделал и что получилось, и кто что делает сейчас. Отчёт нужен для наставников и итоговой защиты проекта.

**На 05.11.2026:** сделано 45 задач — фаза 0 (9), фаза 1 (14 из 14 ✅), фаза 2 (13 из 18), фаза 3 (4 из 16), фаза 4 (5 из 10). Текущих назначений 10, ещё 4 назначены заранее на фазу 8.

Сводка и таблицы завершённых задач ниже сохранены как срез на 05.11.2026. В этой актуализации изменены сведения о P5-01 и её прямых зависимых задачах; общий пересчёт проекта не выполнялся.

Сводка учитывает завершение P4-07 и связанные изменения готовности задач. Учёт на [доске проекта](https://github.com/orgs/PM-YandexPracticum/projects/133/views/1) ведётся отдельно от прогресса плана. Назначение исполнителя само по себе не означает готовность зависимостей: P2-17 ждёт P2-09.

На доске 07.11.2026: Backlog — 32, Todo — 3, In Progress — 10, Review — 1, Need fix — 0, Done — 41. P5-02 (#60) остаётся In Progress у `pwkdmc`; P5-03 (#61) находится в Todo. P5-01 (#59) реализована локально, на доске остаётся In Progress: PR ещё не открыт, поэтому в Done её не считаем. Счётчики доски приведены отдельно от прогресса текущего плана: отчёт учитывает девять задач фундамента и исключает закрытые ICS-задачи (#90 и #91); их старые ID P9-04/P9-05 теперь используются для задач о бейджах (#92 и #93).

## P5-01 — реализация завершена локально (07.11.2026)

Я завершил P5-01 в ветке `feature/p5-01-catalog-filters`: реализовал состояние фильтров, действия и публичный API, чистую функцию `applyFilters` с поиском и сортировкой. Режимы соответствуют согласованной логике: «Хочу научиться» — желания автора карточки, «Могу научить» — его предложение. Поиск учитывает только название предлагаемого навыка.

Последний прогон после правок ревью: 61 тестовый файл, 514 тестов проходят, из них 53 проверки P5-01. Покрытие `applyFilters`, редьюсера и селекторов — 100 % строк, функций и ветвей; lint, TypeScript и сборка проходят. Тесты обнаруживают четыре ошибки, пропущенные до ревью: фиксированный пол или сортировку, очистку всех городов вместо одного и очистку всех подкатегорий при снятии одной. Проверка неизменности данных обходится без двойного приведения типов.

Коммит и PR ещё не созданы. P5-01 выполнена локально и готова к передаче на ревью; в счётчик влитых задач и Done она пока не входит. P4-03 остаётся зависимостью подключения данных: здесь ядро проверено на фабриках, без реализации загрузки или UI соседних задач.

| Задача | Исполнитель | Статус на доске | Что остаётся |
|---|---|---|---|
| [P5-01](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/59) Логика фильтров | kirill-ai-dev | In Progress | Коммит, PR, командное ревью и влитие |
| [P5-02](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/60) Панель фильтров в действии | pwkdmc | In Progress | Подключение панели; для интеграции нужны P5-01 и P3-07, P4-02 уже готова |
| [P5-03](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/61) Поиск | Не назначен | Todo | Подключение поиска; для интеграции нужны P5-01 и P3-04 |

P5-02 уже взята исполнителем, поэтому по решению тимлида остаётся In Progress. P5-03 уже в Todo. Статусы и назначения на GitHub в ходе этой актуализации не менялись.

## Проверки текущего состояния

Базовые проверки `develop` выполнены на коммите `a2b0893` (05.11.2026); следующий `5db9710` содержит актуализацию документации. Результаты проверки P4-07 приведены отдельно ниже:

| Проверка | Результат |
|---|---|
| `npm run lint` | ESLint и Stylelint проходят |
| `npm run test:coverage` | 48 файлов, 355 тестов — все проходят; statements 89,79 %, branches 90,79 %, порог statements 70 % пройден |
| `npm run build` | TypeScript и сборка Vite проходят |
| `npm run build-storybook` | Storybook собирается |
| Браузерная проверка P3-08 | Сверка с Figma, раскрытие 3 → 9 → 3, клавиатура и reduced motion проверены; axe — без нарушений |
| Браузерная проверка P3-15 | Панель 556 × 616 px и даты «сегодня / вчера» сверены с Figma; цвета и глобальные стили не менялись, замечание axe по контрасту кнопок оставлено по решению тимлида |

Покрытие приведено по текущему `vitest.config.ts`: в общий расчёт входят и тестовые файлы. Это не отдельная оценка ядра для P8-07. Сквозных тестов Playwright пока нет (P8-05); готовность всего MVP и финальные Lighthouse/сверка с макетом ещё не подтверждены.

## P4-07 — результат проверки

Я завершил реализацию P4-07: подготовил операции API/Redux для обменов и уведомлений. Сводка завершённых задач выше включает эту задачу.

- 54 тестовых файла, 399 тестов — все проходят без пропусков (44 новых теста P4-07).
- `npm run test:coverage`: statements/lines 91,36 %, branches 92,00 % по текущему конфигу проекта.
- Отдельно API и model обменов/уведомлений, без тестовых файлов и типов: statements/lines 99,62 %, branches 97,58 %, functions 100 %.
- Пройдены ESLint/Stylelint, Prettier по изменённому коду, TypeScript, сборка Vite и Storybook; относительные ссылки в Markdown проверены, отсутствующих файлов нет.
- Проверены перезагрузка store и повторный импорт модулей API, повторная пара пользователей (в том числе одновременно), смена настоящей сессии во время записи, сохранение чтения/очистки, частичная ошибка записи и повтор операции.
- Повторное ревью выявило и исправило преждевременный `succeeded` при параллельных запросах. `pendingRequests` удерживает `loading`, пока группа не завершена; ошибка одной операции не затирается успехом другой. На оба случая добавлены регрессионные тесты для двух слайсов.

UI не менялся: подключение кнопок, панели и toast остаётся в P7-03/P7-05. Макет и скриншот UI для этой задачи не требуются.

P7-04 (#77) можно перенести из Backlog в Todo: P3-08 и P4-07 готовы. P7-03 (#76) дополнительно ждёт P7-01, P4-08 и P4-09, P7-05 (#78) — P5-09.

## Как заполнять

- Строку добавляет тимлид или помощник, когда вливает PR, — вместе с ✅ в файле фазы и счётчиком в [roadmap.md](roadmap.md).
- Взял задачу — строка в «Сейчас в работе»; влили — она переезжает в таблицу своей фазы.
- **Исполнитель** — логин на GitHub, как в PR. Задача без PR (например, настройка доски) — в столбце PR «—».
- **Итог** — 1–2 предложения: что сделано и что поправили на ревью. Берём из раздела «Что сделано» в PR.
- Порядок — по дате влития, новые снизу.

## Сейчас в работе

Таблица ниже — срез назначений на 05.11.2026; актуальные сведения о P5-01–P5-03 приведены выше.

Ориентиры по срокам — в [README задач](README.md#сроки): 🟢 до 1 дня, 🟡 до 2, 🔴 до 3.

| Задача | Исполнитель | Назначена | Состояние |
|---|---|---|---|
| [P2-06 PasswordInput](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/22) 🟢 | kkiitlin | 02.11 | Input готов; «глаз» через `rightAction` |
| [P2-09 Select](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/25) 🟡 | Stanislave0 | 02.11 | Input и `useClickOutside` готовы |
| [P2-12 DatePicker](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/28) 🟡 | Laurovsky | 03.11 | `react-datepicker` и Input готовы |
| [P2-15 Лента с догрузкой](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/31) 🟡 | Al-Du9270-art | 03.11 | настройки каталога готовы |
| [P2-17 MultiSelect](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/33) 🟡 | Laurovsky | 03.11 | назначена; ждёт Select (P2-09), Checkbox готов |
| [P3-02 Карточка автора и блок навыка](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/35) 🟡 | viceede | 03.11 | `UserSummary` и `SkillTag` готовы в P3-01 |
| [P3-04 Шапка (вёрстка)](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/37) 🟡 | kkiitlin | 04.11 | зависимости готовы; открывает работу над лейаутами |
| [P3-07 Панель фильтров (вёрстка)](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/40) 🟡 | alicevdr | 04.11 | Checkbox, RadioGroup и справочники готовы |
| [P4-03 Пользователи и навыки](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/52) 🟡 | Nick-Shvd | 03.11 | образец загрузки и тестов — P4-02 |
| [P4-08 Защита закрытых страниц](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/57) 🟢 | muntaniolirina | 05.11 | сессия готова; подключает подготовленные guards и возврат на исходный маршрут |

Назначены заранее, начнутся после фаз 5–7: [P8-04](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/83) Доступность и [P8-06](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/85) Сверка с макетом (viceede), [P8-05](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/84) Автотесты и [P8-07](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/86) Критерии приёмки (kirill-ai-dev).

У kkiitlin и Laurovsky назначено по две текущие задачи. Общее правило одной задачи одновременно сохраняется: сначала завершаем текущую; назначенный P2-17 не начинаем до влития Select. Даты выше — даты назначения в GitHub, а не подтверждённого начала разработки.

## По исполнителям

Сколько задач сделал каждый и что у него сейчас. Обновляется вместе с таблицами ниже.

| Исполнитель | Сделано | Задачи | Сейчас |
|---|---|---|---|
| kirill-ai-dev 👑 | фаза 0 + 8 | фаза 0, P1-10, P1-12, P4-01, P4-10, P3-01, P4-05, P3-08, P4-07 | P5-01 выполнена локально, ожидает PR; заранее P8-05, P8-07 |
| viceede 👑 | 4 | P1-09, P1-11, P1-13, P1-14 | P3-02; заранее P8-04, P8-06 |
| muntaniolirina | 5 | P1-02, P2-04, P2-11, P2-14, P3-15 | P4-08 |
| pwkdmc | 6 | P1-03, P1-08, P2-08, P2-13, P2-16, P4-02 | P5-02 (In Progress, уточнено 07.11) |
| Laurovsky | 3 | P1-05, P2-05, P2-07 | P2-12, P2-17 (ждёт P2-09) |
| Al-Du9270-art | 2 | P2-02, P2-10 | P2-15 |
| alicevdr | 2 | P1-06, P2-03 | P3-07 |
| sosolet | 2 | P1-01, P2-18 | без задачи |
| Stanislave0 | 1 | P2-01 | P2-09 |
| Nick-Shvd | 1 | P1-07 | P4-03 |
| kkiitlin | 2 | P1-04, P3-03 | P2-06, P3-04 |

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
| [P1-03](phases/phase-01-preparation.md) Картинки и иллюстрации 🟢 | pwkdmc | Аватары и фото навыков для Ивана, Анны и Марии, заглушки, иллюстрации входа, шагов регистрации, 404 и 500. После влития тимлид сжал фото с 5,8 МБ до 1 МБ для будущей оптимизации по производительности | 2026-10-30 | [#101](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/101) |
| [P1-02](phases/phase-01-preparation.md) Иконки из Figma 🟢 | muntaniolirina | 40 иконок, сверенных с макетом: имена по слоям Figma, подпапки `categories/` и `brands/`, README с id фреймов. На ревью: зеркально отражён `logout`, добавлены радиокнопки, настроен импорт `?react` в TypeScript и тестах | 2026-10-30 | [#102](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/102) |
| [P1-14](phases/phase-01-preparation.md) 👑 Инструменты коммитов 🟡 | viceede | Commitizen и команда `npm run commit` для сообщений по Conventional Commits, Husky: проверки перед коммитом и push, раздел в `git-workflow.md` | 2026-10-30 | [#103](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/103) |
| [P1-05](phases/phase-01-preparation.md) Моки: города и категории 🟢 | Laurovsky | 6 категорий и 42 подкатегории, 15 городов — всё по макету, старые id сохранены. На ревью: добавлены Самара и Саратов (пример поиска «Са» в макете), `icon` категорий приведены к файлам иконок | 2026-10-31 | [#108](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/108) |
| [P1-10](phases/phase-01-preparation.md) 👑 Библиотеки: календарь, карусель, тесты 🟢 | kirill-ai-dev | `react-datepicker` 9 и `embla-carousel-react` 8 для P2-12 и P2-13; пакет покрытия и Playwright с командой `npm run e2e`; README и задачи P2-12, P2-13, P8-05, P8-07 обновлены | 2026-10-31 | [#110](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/110) |
| [P1-12](phases/phase-01-preparation.md) 👑 Линтер правил FSD 🟡 | kirill-ai-dev | ESLint проверяет импорты FSD: только вниз по слоям, без соседних слайсов, через `index.ts`; текст ошибки подсказывает, как исправить; исключение для тестов (`@/app/test`) | 2026-10-31 | [#111](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/111) |
| [P1-08](phases/phase-01-preparation.md) Моки: пользователи и навыки, часть 3 🟢 | pwkdmc | 14 пользователей и навыков «Здоровье и лайфстайл» и «Дом и уют», фото сжаты до 400×400 и 800×800. На ревью: «Хочу научиться» больше не совпадает со своим навыком, email уникальные (имя + номер), убрана ссылка на отсутствующее фото | 2026-11-01 | [#115](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/115) |
| [P1-06](phases/phase-01-preparation.md) Моки: пользователи и навыки, часть 1 🟢 | alicevdr | 14 пользователей и навыков «Бизнес и карьера» и «Творчество и искусство» с фото. На ревью: id подкатегорий приведены к справочнику P1-05, у навыков добавлен `createdAt`, добавлены недостающие фото; тимлид дописал ссылки на 10 загруженных фото | 2026-11-01 | [#112](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/112) |
| [P1-07](phases/phase-01-preparation.md) Моки: пользователи и навыки, часть 2 🟢 | Nick-Shvd | 14 пользователей и навыков «Иностранные языки» и «Образование и развитие» с фото. На ревью: тимлид добавил 14-го пользователя (u31, фото из макета), исправил автора s18 и ссылку на фото s20, сделал уникальными email, лайки и даты | 2026-11-01 | [#120](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/120) |
| [P1-13](phases/phase-01-preparation.md) 👑 Доска, шаблоны и онбординг 🟢 | viceede | Доска с колонками Backlog, Todo, In progress, Review, Need fix, Done; онбординг команды проведён на видеовстрече. Шаблон PR и `onboarding.md` не дописывали — главное было в доске и встрече | 2026-11-01 | — |
| [P1-04](phases/phase-01-preparation.md) Подготовка к тестам: образец и помощники 🟡 | kkiitlin | `getAge` с тестом-образцом (9 случаев, в том числе 29 февраля), фабрики `createUser()` и `createSkill()` в `@/entities/*/testing`, `createAppStore()` и `renderWithProviders` со store и роутером, правила в `testing.md`. На ревью: тимлид разрешил в линтере импорт фабрик в тестах и stories, убрал BOM и выровнял образец | 2026-11-02 | [#122](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/122) |

## Фаза 2 — UI-кит

| Задача | Исполнитель | Итог | Влито | PR |
|---|---|---|---|---|
| [P2-04](phases/phase-02-ui-kit.md) Avatar 🟢 | muntaniolirina | Аватар трёх размеров по макету (48, 100, 244 px), заглушка без фото, `resolveImageUrl`, 7 тестов, 4 story. Тимлид добавил описания пропсов и тесты через `getByRole` | 2026-11-01 | [#116](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/116) |
| [P2-02](phases/phase-02-ui-kit.md) Кнопки Button и IconButton 🟢 | Al-Du9270-art | Button (primary, secondary, ghost) и IconButton, цвета наведения, нажатия и disabled по переменным макета (поправлены токены), 5 тестов. На ревью: исправлены `onClick` и `type`; тимлид отформатировал stories и обновил README | 2026-11-01 | [#114](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/114) |
| [P2-11](phases/phase-02-ui-kit.md) Stepper 🟢 | muntaniolirina | Индикатор «Шаг N из 3» с тремя полосками, пройденные шаги зелёные; тесты и stories | 2026-11-01 | [#118](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/118) |
| [P2-08](phases/phase-02-ui-kit.md) Dropdown 🟡 | pwkdmc | Поповер под кнопкой: закрытие по Esc и клику мимо, хук `useClickOutside` с тестом, stories трёх меню. На ревью: сдвиг внутрь окна на 36px по макету без мигания, выравнивание `end` для правых кнопок шапки, живые stories с `onClose` | 2026-11-01 | [#119](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/119) |
| [P2-01](phases/phase-02-ui-kit.md) Logo и Loader 🟢 | Stanislave0 | Логотип-ссылка на главную по макету шапки (1:2870), вариант без текста; спиннер с `role="status"`; CSS Modules, тесты. На ревью: JSDoc перенесён к функциям и пропсам, ссылки на макет в stories, из lock-файла убран clsx | 2026-11-01 | [#113](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/113) |
| [P2-03](phases/phase-02-ui-kit.md) Tag и плашка 🟢 | alicevdr | Цветной чип навыка с цветом снаружи (`color`) и крестиком по `onRemove` — один компонент для чипа и плашки фильтра; stories со всеми цветами категорий, тесты. Ревью — viceede | 2026-11-02 | [#121](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/121) |
| [P2-16](phases/phase-02-ui-kit.md) Общие правила валидации 🟡 | pwkdmc | Шесть правил полей (email, пароль, имя, дата рождения, текст, город) на лимитах и текстах из конфигов и `validation.md`; 36 тестов, повторяющиеся случаи таблицей. Ревью — viceede | 2026-11-03 | [#128](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/128) |
| [P2-14](phases/phase-02-ui-kit.md) FileDropzone 🟡 | muntaniolirina | Зона загрузки фото: перетаскивание и выбор файла, превью с крестиком, с клавиатуры — одна кнопка; `validateImageFile` и `fileToDataUrl` с уменьшением фото до 800 px в JPEG; 23 теста, 9 stories. На ревью тимлид влил develop, вынес 800 px и качество JPEG в `VALIDATION.IMAGE`, перевёл тесты на поиск по роли, добавил тест белой заливки холста | 2026-11-03 | [#132](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/132) |
| [P2-05](phases/phase-02-ui-kit.md) Поля Input и Textarea 🟢 | Laurovsky | Поля с подписью, ошибкой и иконкой справа, `forwardRef` для react-hook-form, ошибка связана через `aria-describedby`; 18 тестов, stories. На ревью тимлид добавил кликабельную кнопку справа `rightAction` (для PasswordInput и поиска в Select), высоту 48 px и интервал по макету | 2026-11-03 | [#135](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/135) |
| [P2-07](phases/phase-02-ui-kit.md) Checkbox и RadioGroup 🟡 | Laurovsky | Настоящие `input` под значками — клавиатура и скринридер работают без своего кода; частичный выбор категории; 17 тестов, живые stories. На ревью тимлид привёл заголовок группы и интервалы к макету, убрал лишний `aria-checked` | 2026-11-03 | [#137](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/137) |
| [P2-10](phases/phase-02-ui-kit.md) Modal 🟡 | Al-Du9270-art | Обёртка поверх затемнённой страницы: portal, Esc и клик по фону, фокус внутри окна и возврат после закрытия; содержимое через `children`. На ревью тимлид исправил сброс фокуса при перерисовке родителя, добавил прокрутку высокого окна и блокировку страницы, убрал внутренние отступы (у окон они разные), сделал `ariaLabel` обязательным; 7 тестов | 2026-11-03 | [#138](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/138) |
| [P2-13](phases/phase-02-ui-kit.md) Carousel 🟡 | pwkdmc | Обёртка над `embla-carousel-react` со стрелками, настройками числа слайдов и обратными вызовами API и выбора; тесты и stories галереи, превью навыка и похожих предложений | 2026-11-03 | [#127](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/127) |
| [P2-18](phases/phase-02-ui-kit.md) Toast 🟡 | sosolet | Toast, контекст и `useToast`, подключённый в App провайдер с независимыми таймерами на 4 с; закрытие мышью и клавиатурой, область объявлений скринридером. На ревью тимлид сверил вёрстку с Figma, исправил перенос текста и очистку ресурсов, добавил живые stories и тесты; бизнес-сценарий обмена остаётся в P7-03 | 2026-11-04 | [#140](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/140) |

## Фаза 3 — Вёрстка блоков и страниц

| Задача | Исполнитель | Итог | Влито | PR |
|---|---|---|---|---|
| [P3-01](phases/phase-03-layout.md) Карточка пользователя UserCard 🔴 | kirill-ai-dev | Карточка каталога по макету: `UserSummary` (общий с P3-02), `SkillTag`, «+N» по `CATALOG.CARD_LEARN_TAGS`, `pluralize`; данные пропсами, лайк и «Подробнее» — слотами; длинные названия обрезаются с подсказкой; story на настоящих данных из `public/db`. Задача-образец для команды | 2026-11-03 | [#133](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/133) |
| [P3-03](phases/phase-03-layout.md) Подвал 🟢 | kkiitlin | Готовый Logo, три колонки ссылок и «SkillSwap — 2025»; рабочие переходы на `/about` и `/skills`, остальные пункты — неинтерактивные заглушки; 8 тестов и story. На ревью уточнён интервал копирайта и подключён общий `ROUTER_FUTURE`; интеграция в MainLayout — P3-05 | 2026-11-04 | [#141](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/141) |
| [P3-08](phases/phase-03-layout.md) Карточка предложения и секция 🟡 | kirill-ai-dev | `OfferCard` собирает UserCard, визуальное сердечко со счётчиком и ссылку на навык; `OffersSection` — сетка по три и независимое раскрытие 3 ⇄ 9 с анимацией и поддержкой reduced motion. Карточка передаётся через `renderItem`; 14 новых тестов, stories и сверка с Figma. Лайки, загрузка ленты и статус обмена остаются в P5-07, P5-06 и P7-04 | 2026-11-04 | [#142](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/142) |
| [P3-15](phases/phase-03-layout.md) Уведомления (вёрстка) 🟢 | muntaniolirina | `NotificationItem`, `NotificationsPanel` и `MarkAllReadButton` со состояниями новых, просмотренных и пустого списка; callback-пропсы без Redux и сохранения, 24 новых теста, stories, README и сверка размеров с Figma. Сохранение и подключение к шапке остаются в P4-07 и P7-05 | 2026-11-05 | [#143](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/143) |

## Фаза 4 — Данные и вход

| Задача | Исполнитель | Итог | Влито | PR |
|---|---|---|---|---|
| [P4-01](phases/phase-04-data.md) «База данных» в браузере 🔴 | kirill-ai-dev | `createMockCollection` (получить, создать, изменить, удалить) поверх localStorage с задержкой как у сервера и без мутаций; повреждённые данные, недоступный localStorage и нехватка места не ломают сайт; `resetMockDb()`; 18 тестов, сброс «базы» после каждого теста | 2026-11-02 | [#124](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/124) |
| [P4-10](phases/phase-04-data.md) 👑 Перенос образцов данных в `public/db` 🟡 | kirill-ai-dev | Образцы — JSON в `public/db` по ТЗ наставника, загрузка через `fetch` (`loadSeed`) один раз при первом обращении; действия коллекции по очереди; тесты читают `public/db` без сервера; данные ушли из JS (236 → 195 КБ) | 2026-11-02 | [#125](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/125) |
| [P4-02](phases/phase-04-data.md) Справочники: категории и города 🟡 | pwkdmc | Загрузка категорий и городов в store (`fetchCategories`, `fetchCities`) и селекторы: подкатегория по id, категория подкатегории, цвет категории, город по id. На ревью тимлид добавил экспорт в `index.ts`, тесты статусов и загрузки из `public/db`, упростил `selectCategoryColor`; в `testing.md` — как проверять ошибку загрузки | 2026-11-03 | [#131](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/131) |
| [P4-05](phases/phase-04-data.md) Сессия 🟡 | kirill-ai-dev | Вход и выход одним действием (`startSession`, `endSession`) — сразу в store и localStorage; сессия переживает перезагрузку; повреждённые данные и недоступный localStorage не ломают сайт; 17 тестов | 2026-11-03 | [#136](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/136) |
| [P4-07](phases/phase-04-data.md) Обмены и уведомления 🟡 | kirill-ai-dev | API и Redux сохраняют обмены и уведомления в «базе», запрещают повторное предложение тому же пользователю, фильтруют данные по текущей сессии и поддерживают прочтение и очистку уведомлений; 44 новых теста | 2026-11-05 | [#147](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/147) |
