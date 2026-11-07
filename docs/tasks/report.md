# Отчёт о задачах

Кто какую задачу сделал и что получилось, и кто что делает сейчас. Отчёт нужен для наставников и итоговой защиты проекта.

**На 07.11.2026:** сделано 50 задач с фундаментом — фаза 0 (9), фаза 1 (14 из 14 ✅), фаза 2 (15 из 18), фаза 3 (5 из 16), фаза 4 (6 из 10), фаза 5 (1 из 9). В MVP завершена 41 из 86 задач. Текущих назначений 11, ещё 4 назначены заранее на фазу 8.

Я сверил задачи и исполнителей с GitHub после влития P2-15 ([PR #152](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/152)), P2-06 ([PR #146](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/146)) и P5-01 ([PR #154](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/154)). Учёт на [доске проекта](https://github.com/orgs/PM-YandexPracticum/projects/133/views/1) ведётся отдельно от прогресса плана.

Снимок доски на 07.11.2026: Backlog — 28, Todo — 6, In Progress — 10, Review — 1, Need fix — 0, Done — 42. P2-06, P2-15 и P5-01 находятся в Done. В Review только P3-07; открытый PR #145 не меняет In Progress у P2-09. P2-17 остаётся в In Progress у `Laurovsky` и ждёт Select. В Todo находятся P5-03, P7-01, P3-06, P3-10, P3-11 и P3-16.

На доске учтены 86 задач MVP и одна общая карточка фундамента (#1), поэтому Done = 41 + 1. План считает фундамент как девять задач. Дополнительные девять задач фазы 9 не входят в этот снимок доски; закрытые ICS-задачи (#90 и #91) исключены из плана. Их старые ID P9-04/P9-05 теперь используются для бейджей (#92 и #93).

## Проверки текущего состояния

Основа ветки обновлена до актуального `origin/develop` — коммит `5c59595` от 07.11.2026 (PR #154). После обновления я повторно проверил текущий код и оставил изменения только в документации. Результаты отдельных задач ниже относятся к моменту их влития:

| Проверка | Результат |
|---|---|
| `npm run lint` | ESLint и Stylelint проходят |
| `npm run test:coverage` | 62 файла, 523 теста — все проходят; statements/lines 93,43 %, branches 93,42 %, functions 69,47 % |
| Покрытие P5-01 | `applyFilters`, reducer и selectors: 100 % строк, функций и ветвей |
| `npm run build` | TypeScript и сборка Vite проходят |
| `npm run build-storybook` | Storybook собирается |
| Браузерная проверка P3-08 | Сверка с Figma, раскрытие 3 → 9 → 3, клавиатура и reduced motion проверены; axe — без нарушений |
| Браузерная проверка P3-15 | Панель 556 × 616 px и даты «сегодня / вчера» сверены с Figma; цвета и глобальные стили не менялись, замечание axe по контрасту кнопок оставлено по решению тимлида |

Покрытие приведено по текущему `vitest.config.ts`: в общий расчёт входят и тестовые файлы; это не отдельная оценка ядра для P8-07. Порог statements 70 % пройден. Сквозных тестов Playwright пока нет (P8-05); готовность всего MVP и финальные Lighthouse/сверка с макетом ещё не подтверждены.

## P4-07 — результат проверки

Я завершил реализацию P4-07: подготовил операции API/Redux для обменов и уведомлений. Сводка завершённых задач выше включает эту задачу. Ниже — результаты на момент её влития 05.11.2026; текущие общие проверки приведены выше.

- 54 тестовых файла, 399 тестов — все проходят без пропусков (44 новых теста P4-07).
- `npm run test:coverage`: statements/lines 91,36 %, branches 92,00 % по текущему конфигу проекта.
- Отдельно API и model обменов/уведомлений, без тестовых файлов и типов: statements/lines 99,62 %, branches 97,58 %, functions 100 %.
- Пройдены ESLint/Stylelint, Prettier по изменённому коду, TypeScript, сборка Vite и Storybook; относительные ссылки в Markdown проверены, отсутствующих файлов нет.
- Проверены перезагрузка store и повторный импорт модулей API, повторная пара пользователей (в том числе одновременно), смена настоящей сессии во время записи, сохранение чтения/очистки, частичная ошибка записи и повтор операции.
- Повторное ревью выявило и исправило преждевременный `succeeded` при параллельных запросах. `pendingRequests` удерживает `loading`, пока группа не завершена; ошибка одной операции не затирается успехом другой. На оба случая добавлены регрессионные тесты для двух слайсов.

UI не менялся: подключение кнопок, панели и toast остаётся в P7-03/P7-05. Макет и скриншот UI для этой задачи не требуются.

P7-04 (#77) уже в In Progress у `alicevdr`: P3-08 и P4-07 готовы. После влития P4-08 P7-03 (#76) ждёт P7-01 и P4-09, P7-05 (#78) — P5-09.

## Сверка описаний задач

Я сверил 95 задач фаз 1–9: ID, ссылки на issues, завершённость, исполнителей и зависимости. В файлах фаз отметил все открытые задачи MVP актуальными статусами и оставшимися зависимостями. В отчёте учёл 41 завершённую задачу MVP, 11 текущих назначений и четыре назначения на фазу 8.

Исправил устаревшие сведения: PasswordInput и лента больше не числятся в работе, P5-01 завершена; P3-05 выполняет `Al-Du9270-art`, P4-06 и P5-02 — `pwkdmc`. Убрал ошибочное требование держать задачу в Backlog до закрытия всех зависимостей: Todo — ближайшая очередь текущего состава команды. Назначенные задачи сохраняют исполнителей и статус, даже когда ждут интеграции.

Эта актуализация локальная: описания issues и колонки GitHub я не менял. Новые пояснения в файлах фаз ещё не опубликованы в GitHub; это не заявление о полном совпадении текстов issues с локальными файлами. Снимок статусов — на 07.11.2026.

Проверка документации не заменяет отдельное ревью реализации каждой задачи и повторную проверку всех экранов по Figma.

## Как заполнять

- Строку добавляет тимлид или помощник, когда вливает PR, — вместе с ✅ в файле фазы и счётчиком в [roadmap.md](roadmap.md).
- Взял задачу — строка в «Сейчас в работе»; влили — она переезжает в таблицу своей фазы.
- **Исполнитель** — логин на GitHub, как в PR. Задача без PR (например, настройка доски) — в столбце PR «—».
- **Итог** — 1–2 предложения: что сделано и что поправили на ревью. Берём из раздела «Что сделано» в PR.
- Порядок — по дате влития, новые снизу. Даты новых влитий приводим по Москве (P2-06 в GitHub: 06.11 в 21:24 UTC, в Москве уже 07.11).

## Сейчас в работе

Ориентиры по срокам — в [README задач](README.md#сроки): 🟢 до 1 дня, 🟡 до 2, 🔴 до 3.

| Задача | Исполнитель | Состояние и оставшиеся зависимости |
|---|---|---|
| [P2-09 Select 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/25) | Stanislave0 | In Progress; открыт PR #145, статус сохраняется; все прямые зависимости закрыты |
| [P2-12 DatePicker 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/28) | Laurovsky | In Progress; все прямые зависимости закрыты |
| [P2-17 MultiSelect 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/33) | Laurovsky | In Progress; P2-09 (In Progress) |
| [P3-04 Шапка (вёрстка) 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/37) | kkiitlin | In Progress; открыт PR #153; все прямые зависимости закрыты |
| [P3-05 Лейауты страниц 🟢](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/38) | Al-Du9270-art | In Progress; P3-04 (In Progress) |
| [P3-07 Панель фильтров (вёрстка) 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/40) | alicevdr | Review; открыт PR #148; все прямые зависимости закрыты |
| [P3-09 Страница навыка (вёрстка) 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/42) | sosolet | In Progress; все прямые зависимости закрыты |
| [P4-03 Пользователи и навыки 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/52) | Nick-Shvd | In Progress; все прямые зависимости закрыты |
| [P4-06 Сохранение пользователей и навыков 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/55) | pwkdmc | In Progress; P4-03 (In Progress) |
| [P5-02 Панель фильтров в действии 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/60) | pwkdmc | In Progress; P3-07 (Review) |
| [P7-04 «Обмен предложен» на карточке 🟢](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/77) | alicevdr | In Progress; все прямые зависимости закрыты |

Назначены заранее, начнутся после фаз 5–7: [P8-04](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/83) Доступность и [P8-06](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/85) Сверка с макетом (viceede), [P8-05](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/84) Автотесты и [P8-07](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/86) Критерии приёмки (kirill-ai-dev).

У `Laurovsky`, `alicevdr` и `pwkdmc` по две текущие задачи. Это фактические назначения на доске, а не рекомендация расширять параллельную работу. Сначала завершаем текущую работу; ожидание зависимости само по себе не меняет статус задачи.

## Готовность к Todo

Todo — ближайшая очередь после текущих In Progress / Review; незавершённая зависимость сама по себе не запрещает перенос. Тимлид уже перенёс четыре ранее рекомендованные задачи; новые карточки в этой актуализации не переносились.

Сейчас в Todo, повторно переносить не нужно:

| Задача | Для интеграции остаётся |
|---|---|
| [P5-03 Поиск (#61)](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/61) | P3-04 — In Progress; P5-01 завершена |
| [P7-01 Страница навыка с данными (#74)](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/74) | P3-09 и P4-03 — In Progress |
| [P3-06 Все навыки (#39)](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/39) | P3-05 — In Progress |
| [P3-10 Каталог (#43)](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/43) | P3-05 — In Progress, P3-07 — Review |
| [P3-11 Вход и шаг 1 (#44)](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/44) | P3-05 — In Progress; P2-06 завершена |
| [P3-16 «О проекте», 404 и 500 (#49)](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/49) | P3-05 — In Progress |

Ниже проверены все 28 задач Backlog. В столбце зависимостей перечислены только незавершённые; полный список, включая готовые, остаётся в файле соответствующей фазы. «Позже» обозначает следующую очередь, а не запрет переноса при отдельной договорённости команды.

| Задача Backlog | Оставшиеся зависимости | Очередь |
|---|---|---|
| [P3-12 Шаг 2 регистрации (вёрстка) 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/45) | P3-11 (Todo), P2-09 (In Progress), P2-12 (In Progress), P2-17 (In Progress) | Позже |
| [P3-13 Шаг 3 регистрации и окна (вёрстка) 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/46) | P3-12 (Backlog) | Позже |
| [P3-14 Личный кабинет (вёрстка) 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/47) | P3-05 (In Progress), P3-12 (Backlog), P2-12 (In Progress) | Позже |
| [P4-04 Загрузка при старте 🟢](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/53) | P4-03 (In Progress), P3-16 (Todo) | Позже |
| [P4-09 Вход 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/58) | P4-03 (In Progress), P3-11 (Todo) | Позже |
| [P5-04 Секции «Популярное» и «Новое» 🟢](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/62) | P4-03 (In Progress), P3-10 (Todo) | Позже |
| [P5-05 Результаты: плашки и сортировка 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/63) | P5-02 (In Progress), P3-10 (Todo), P5-04 (Backlog) | Позже |
| [P5-06 Лента «Рекомендуем» и результатов 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/64) | P5-05 (Backlog), P5-04 (Backlog) | Позже |
| [P5-07 Лайки со счётчиком 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/65) | P4-06 (In Progress), P4-09 (Backlog) | Позже |
| [P5-08 Страница избранного 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/66) | P5-07 (Backlog), P5-02 (In Progress), P4-09 (Backlog) | Позже |
| [P5-09 Шапка вошедшего и выход 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/67) | P3-04 (In Progress), P4-09 (Backlog) | Позже |
| [P6-01 Черновик регистрации и охрана шагов 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/68) | P3-11 (Todo) | Позже |
| [P6-02 Шаг 1: email и пароль 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/69) | P6-01 (Backlog), P4-03 (In Progress) | Позже |
| [P6-03 Связь «категория ↔ подкатегория» 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/70) | P3-12 (Backlog) | Позже |
| [P6-04 Шаг 2: о себе и «Хочу научиться» 🔴](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/71) | P6-01 (Backlog), P6-03 (Backlog), P6-02 (Backlog) | Позже |
| [P6-05 Шаг 3: свой навык и превью 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/72) | P6-01 (Backlog), P6-03 (Backlog), P3-13 (Backlog) | Позже |
| [P6-06 Завершение регистрации 🔴](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/73) | P6-02 (Backlog), P6-04 (Backlog), P6-05 (Backlog), P4-06 (In Progress) | Позже |
| [P7-02 Похожие предложения 🟢](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/75) | P7-01 (Todo) | Позже |
| [P7-03 «Предложить обмен» 🔴](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/76) | P7-01 (Todo), P4-09 (Backlog) | Позже |
| [P7-05 Уведомления в действии 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/78) | P5-09 (Backlog) | Позже |
| [P7-06 «Личные данные»: сохранение 🔴](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/79) | P3-14 (Backlog), P4-06 (In Progress), P4-09 (Backlog), P6-04 (Backlog) | Позже |
| [P8-01 Ошибка 500 и ErrorBoundary 🟢](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/80) | P3-16 (Todo), P4-04 (Backlog) | Позже |
| [P8-02 Команда на странице «О проекте» 🟢](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/81) | P3-16 (Todo) | Позже |
| [P8-03 Пустые списки 🟢](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/82) | P5-05 (Backlog), P5-08 (Backlog) | Позже |
| [P8-04 Доступность 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/83) | завершение фаз 5–7 | Позже |
| [P8-05 Автотесты главных сценариев 🔴](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/84) | завершение фаз 5–7 | Позже |
| [P8-06 Сверка с макетом и демо 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/85) | P8-04 (Backlog) | Позже |
| [P8-07 Проверка критериев приёмки 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/86) | P8-05 (Backlog), P8-06 (Backlog) | Позже |

P2-17, P3-05, P4-06 и P5-02 уже назначены и остаются In Progress. Заранее назначенные P8-04…P8-07 сохраняют Backlog до очереди финальных проверок. Девять дополнительных задач фазы 9 остаются вне ближайшей очереди до завершения MVP.

## По исполнителям

Сколько задач сделал каждый и что у него сейчас. Обновляется вместе с таблицами ниже.

| Исполнитель | Сделано | Задачи | Сейчас |
|---|---|---|---|
| kirill-ai-dev 👑 | фаза 0 + 9 | фаза 0, P1-10, P1-12, P4-01, P4-10, P3-01, P4-05, P3-08, P4-07, P5-01 | заранее P8-05, P8-07 |
| viceede 👑 | 5 | P1-09, P1-11, P1-13, P1-14, P3-02 | заранее P8-04, P8-06 |
| muntaniolirina | 6 | P1-02, P2-04, P2-11, P2-14, P3-15, P4-08 | без задачи |
| pwkdmc | 6 | P1-03, P1-08, P2-08, P2-13, P2-16, P4-02 | P4-06, P5-02 |
| Laurovsky | 3 | P1-05, P2-05, P2-07 | P2-12, P2-17 (ждёт P2-09) |
| Al-Du9270-art | 3 | P2-02, P2-10, P2-15 | P3-05 |
| alicevdr | 2 | P1-06, P2-03 | P3-07, P7-04 |
| sosolet | 2 | P1-01, P2-18 | P3-09 |
| Stanislave0 | 1 | P2-01 | P2-09 |
| Nick-Shvd | 1 | P1-07 | P4-03 |
| kkiitlin | 3 | P1-04, P3-03, P2-06 | P3-04 |

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
| [P2-15](phases/phase-02-ui-kit.md) Лента с догрузкой 🟡 | Al-Du9270-art | `useInfiniteScroll` с порциями по прокрутке, состояниями загрузки и окончания списка; сброс при смене данных, отмена таймеров и очистка наблюдателей. На ревью я дополнил обработку пограничных ситуаций и 36 тестов; подключение в каталоге и избранном остаётся в P5-06/P5-08 | 2026-11-06 | [#152](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/152) |
| [P2-06](phases/phase-02-ui-kit.md) PasswordInput 🟢 | kkiitlin | Поле на основе Input: показать/скрыть пароль, подсказка через `hint`, ошибка вместо подсказки, доступная кнопка, ref и совместимость с react-hook-form. При disabled глаз скрыт; 9 тестов, 5 stories. Ревью и влитие — viceede | 2026-11-07 | [#146](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/146) |

## Фаза 3 — Вёрстка блоков и страниц

| Задача | Исполнитель | Итог | Влито | PR |
|---|---|---|---|---|
| [P3-01](phases/phase-03-layout.md) Карточка пользователя UserCard 🔴 | kirill-ai-dev | Карточка каталога по макету: `UserSummary` (общий с P3-02), `SkillTag`, «+N» по `CATALOG.CARD_LEARN_TAGS`, `pluralize`; данные пропсами, лайк и «Подробнее» — слотами; длинные названия обрезаются с подсказкой; story на настоящих данных из `public/db`. Задача-образец для команды | 2026-11-03 | [#133](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/133) |
| [P3-03](phases/phase-03-layout.md) Подвал 🟢 | kkiitlin | Готовый Logo, три колонки ссылок и «SkillSwap — 2025»; рабочие переходы на `/about` и `/skills`, остальные пункты — неинтерактивные заглушки; 8 тестов и story. На ревью уточнён интервал копирайта и подключён общий `ROUTER_FUTURE`; интеграция в MainLayout — P3-05 | 2026-11-04 | [#141](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/141) |
| [P3-08](phases/phase-03-layout.md) Карточка предложения и секция 🟡 | kirill-ai-dev | `OfferCard` собирает UserCard, визуальное сердечко со счётчиком и ссылку на навык; `OffersSection` — сетка по три и независимое раскрытие 3 ⇄ 9 с анимацией и поддержкой reduced motion. Карточка передаётся через `renderItem`; 14 новых тестов, stories и сверка с Figma. Лайки, загрузка ленты и статус обмена остаются в P5-07, P5-06 и P7-04 | 2026-11-04 | [#142](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/142) |
| [P3-15](phases/phase-03-layout.md) Уведомления (вёрстка) 🟢 | muntaniolirina | `NotificationItem`, `NotificationsPanel` и `MarkAllReadButton` со состояниями новых, просмотренных и пустого списка; callback-пропсы без Redux и сохранения, 24 новых теста, stories, README и сверка размеров с Figma. Сохранение и подключение к шапке остаются в P4-07 и P7-05 | 2026-11-05 | [#143](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/143) |
| [P3-02](phases/phase-03-layout.md) Карточка автора и блок навыка 🟡 | viceede | `UserProfileCard` с данными автора и чипами, `SkillInfo` с описанием и галереей на Carousel, слоты действий через пропсы; публичные экспорты, тесты и stories. Сборка страницы остаётся в P3-09 | 2026-11-06 | [#150](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/150) |

## Фаза 4 — Данные и вход

| Задача | Исполнитель | Итог | Влито | PR |
|---|---|---|---|---|
| [P4-01](phases/phase-04-data.md) «База данных» в браузере 🔴 | kirill-ai-dev | `createMockCollection` (получить, создать, изменить, удалить) поверх localStorage с задержкой как у сервера и без мутаций; повреждённые данные, недоступный localStorage и нехватка места не ломают сайт; `resetMockDb()`; 18 тестов, сброс «базы» после каждого теста | 2026-11-02 | [#124](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/124) |
| [P4-10](phases/phase-04-data.md) 👑 Перенос образцов данных в `public/db` 🟡 | kirill-ai-dev | Образцы — JSON в `public/db` по ТЗ наставника, загрузка через `fetch` (`loadSeed`) один раз при первом обращении; действия коллекции по очереди; тесты читают `public/db` без сервера; данные ушли из JS (236 → 195 КБ) | 2026-11-02 | [#125](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/125) |
| [P4-02](phases/phase-04-data.md) Справочники: категории и города 🟡 | pwkdmc | Загрузка категорий и городов в store (`fetchCategories`, `fetchCities`) и селекторы: подкатегория по id, категория подкатегории, цвет категории, город по id. На ревью тимлид добавил экспорт в `index.ts`, тесты статусов и загрузки из `public/db`, упростил `selectCategoryColor`; в `testing.md` — как проверять ошибку загрузки | 2026-11-03 | [#131](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/131) |
| [P4-05](phases/phase-04-data.md) Сессия 🟡 | kirill-ai-dev | Вход и выход одним действием (`startSession`, `endSession`) — сразу в store и localStorage; сессия переживает перезагрузку; повреждённые данные и недоступный localStorage не ломают сайт; 17 тестов | 2026-11-03 | [#136](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/136) |
| [P4-07](phases/phase-04-data.md) Обмены и уведомления 🟡 | kirill-ai-dev | API и Redux сохраняют обмены и уведомления в «базе», запрещают повторное предложение тому же пользователю, фильтруют данные по текущей сессии и поддерживают прочтение и очистку уведомлений; 44 новых теста | 2026-11-05 | [#147](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/147) |
| [P4-08](phases/phase-04-data.md) Защита закрытых страниц 🟢 | muntaniolirina | `RequireAuth` закрывает `/profile/*` и `/favorites`, гостя отправляет на вход с `replace` и полным `state.from`. На ревью я дополнил тесты до 10 случаев, экспорт типа пропсов и README роутера; возврат после входа остаётся в P4-09 | 2026-11-06 | [#149](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/149) |

## Фаза 5 — Каталог и избранное

| Задача | Исполнитель | Итог | Влито | PR |
|---|---|---|---|---|
| [P5-01](phases/phase-05-catalog.md) Логика фильтров 🔴 | kirill-ai-dev | Я реализовал `applyFilters`, Redux-действия, селекторы и публичный API: AND между блоками и поиском, OR внутри блока, режимы по данным автора, поиск по названию предложения, сортировки, удаление и сброс. 53 теста, 100 % покрытия ядра; подключение к UI остаётся в P5-02/P5-03 | 2026-11-07 | [#154](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/154) |
