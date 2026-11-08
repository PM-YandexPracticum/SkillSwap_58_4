# Отчёт о задачах

Кто какую задачу сделал и что получилось, и кто что делает сейчас. Отчёт нужен для наставников и итоговой защиты проекта.

**На 08.11.2026:** завершены 46 из 86 задач MVP; вместе с девятью задачами фундамента — 55. По фазам: 1 — 14/14, 2 — 16/18, 3 — 7/16, 4 — 6/10, 5 — 2/9, 7 — 1/6. В фазах 6 и 8 пока нет полностью закрытых задач; в P8-02 влит первый вклад участницы.

Я сверил текущие issues, назначения, PR и [доску GitHub](https://github.com/orgs/PM-YandexPracticum/projects/133/views/1). Снимок на 08.11.2026: **Backlog — 21, Todo — 10, In Progress — 7, Review — 1, Need fix — 1, Done — 47**. Всего 87 карточек: 86 задач MVP и общая карточка фундамента #1. Done = 46 + 1; фундамент план считает девятью задачами. Девять дополнительных задач фазы 9 вне этого снимка; старые ICS-задачи #90/#91 исключены из плана, действующие P9-04/P9-05 — #92/#93.

## Сегодняшние ревью и влития — 08.11.2026

| Задача | Исполнитель | Итог ревью и слияния |
|---|---|---|
| P3-05 «Лейауты страниц» | Al-Du9270-art | [PR #157](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/157) влит. MainLayout собирает готовые Header и Footer, AuthLayout — Logo и Button; рамки на токенах, main предоставляет страница. Проверены навигация и клавиатура. Issue #38 закрыта, Done. |
| P5-03 «Поиск» | pwkdmc | [PR #158](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/158) влит. Я исправил внешнее применение/сброс, включая повторные команды, убрал копии store в тестах и stories, актуализировал README/JSDoc. Проверил сохранение применённого запроса при переходе на вход и обратно; добавлен интеграционный тест лейаутов. Issue #61 закрыта, Done. |
| P8-02 «Команда на странице “О проекте”» — вклад Дианы | pwkdmc | [PR #159](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/159) влит: запись в TEAM и фото 400×400, около 21 КБ. Я исправил публичный путь на `/images/team/t0.jpg` и проверил файл в сборке. **Общая issue #81 остаётся открытой для остальных участников; это не завершение всей P8-02.** |

На доске P8-02 фактически ещё в Review с назначением `pwkdmc`, хотя её мини-PR уже принят. Рекомендация: по решению тимлида вернуть общую карточку в Todo для следующих участников; не закрывать её и не считать вклад Дианы незавершённым. В рамках этой актуализации я доску и назначения не менял.

## Проверки текущего состояния

Проверки выполнены на текущем `develop` (`ce4687d`, PR #159). Статусы и результаты ниже относятся к этому снимку проекта.

| Проверка | Результат |
|---|---|
| `npm run lint` | ESLint и Stylelint проходят |
| `npm run test:coverage` | 69 файлов, 611 тестов — все проходят; statements/lines 94,64 %, branches 94,50 %, functions 73,68 % |
| Покрытие поиска | `SearchInput` и `searchSlice`: 100 % строк, функций и ветвей |
| `npm run build` | TypeScript и сборка Vite проходят |
| `npm run build-storybook` | Storybook собирается |
| Браузерная проверка P5-03 | Enter, очистка с клавиатуры, возврат фокуса; применение запроса, переход в AuthLayout и возврат с сохранением запроса проверены при ревью |
| Проверка фото P8-02 | URL из TEAM соответствует JPEG в production-сборке; общий список команды пока подключается в P3-16 |

Покрытие приведено по текущему `vitest.config.ts`: в общий расчёт входят и тестовые файлы; это не отдельная оценка ядра для P8-07. Порог statements 70 % пройден. Браузерные проверки P3-08/P3-15 относятся к их прежним ревью и заново не выполнялись; согласованное замечание по контрасту P3-15 остаётся в [бэклоге](backlog.md). Сквозных тестов Playwright пока нет (P8-05); готовность всего MVP и финальные Lighthouse/сверка с макетом ещё не подтверждены.

## P4-07 — результат проверки

Я завершил реализацию P4-07: подготовил операции API/Redux для обменов и уведомлений. Сводка завершённых задач выше включает эту задачу. Ниже — результаты на момент её влития 05.11.2026; текущие общие проверки приведены выше.

- 54 тестовых файла, 399 тестов — все проходят без пропусков (44 новых теста P4-07).
- `npm run test:coverage`: statements/lines 91,36 %, branches 92,00 % по текущему конфигу проекта.
- Отдельно API и model обменов/уведомлений, без тестовых файлов и типов: statements/lines 99,62 %, branches 97,58 %, functions 100 %.
- Пройдены ESLint/Stylelint, Prettier по изменённому коду, TypeScript, сборка Vite и Storybook; относительные ссылки в Markdown проверены, отсутствующих файлов нет.
- Проверены перезагрузка store и повторный импорт модулей API, повторная пара пользователей (в том числе одновременно), смена настоящей сессии во время записи, сохранение чтения/очистки, частичная ошибка записи и повтор операции.
- Повторное ревью выявило и исправило преждевременный `succeeded` при параллельных запросах. `pendingRequests` удерживает `loading`, пока группа не завершена; ошибка одной операции не затирается успехом другой. На оба случая добавлены регрессионные тесты для двух слайсов.

UI не менялся: подключение кнопок, панели и toast остаётся в P7-03/P7-05. Макет и скриншот UI для этой задачи не требуются.

P7-04 (#77) завершена в PR #155. P7-03 (#76) ждёт P7-01 и P4-09, P7-05 (#78) — P5-09; загрузку сохранённых обменов в каталог подключает контейнер в P5-04/P5-06.

## Сверка описаний задач

Я сверил все **95 задач фаз 1–9** по issue, состоянию и исполнителям, обновил снимки статусов и оставшихся прямых зависимостей в файлах фаз. Для 86 задач MVP учтены колонки доски. P3-05 и P5-03 отмечены завершёнными; P8-02 — частично выполненной общей задачей с принятым мини-PR.

Отдельно учёл фактические изменения очереди: P3-12 уже выполняет `Al-Du9270-art`; P3-13, P3-14, P4-06 и P5-02 находятся в Todo без исполнителя; P3-07 — Need fix у `alicevdr`. Назначения не восстанавливал по старому отчёту и не менял на GitHub. Локальные уточнения реализации не означают полного совпадения текста issues с файлами фаз: описания issues в этой работе не редактировались.

Проверка документации не заменяет ревью реализации каждой задачи и повторную проверку всех экранов по Figma.

Дополнительно я проверил все 198 Markdown-файлов: 474 относительные ссылки и якоря, существование перечисленных файлов, README каталогов `src` и команды npm. Ошибок в этих проверках нет. Сверил авторов и влитые PR всех 46 завершённых задач MVP. Исправил устаревшие описания Storybook, иллюстраций, фото команды и пример теста; в README незавершённых модулей отделил текущие заготовки от целевого поведения. Повторно прошли lint, сборка Storybook и 16 тестов SearchInput. Исполняемый код приложения в рамках актуализации не менялся.

## Как заполнять

- Завершение задачи отмечаем после влития PR: ✅ в файле фазы, строка результата и новый счётчик в roadmap.
- **Исполнитель** — логин автора PR. Даты влития — по Москве.
- Общая P8-02 состоит из нескольких мини-PR: принятый вклад отмечаем отдельно; всю задачу закрываем после добавления команды. Не используем `Closes #81` в личном мини-PR.

## Сейчас в работе

Ориентиры по срокам — в [README задач](README.md#сроки): 🟢 до 1 дня, 🟡 до 2, 🔴 до 3. Таблица отражает фактические колонки и назначения, а не только наличие открытого PR.

| Задача | Исполнитель | Состояние и оставшиеся зависимости |
|---|---|---|
| [P2-12 DatePicker](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/28) | Laurovsky | In Progress; все прямые зависимости закрыты |
| [P2-17 MultiSelect](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/33) | Laurovsky | In Progress; все прямые зависимости закрыты |
| [P3-07 Панель фильтров (вёрстка)](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/40) | alicevdr | Need fix; PR #148 открыт, ожидает исправлений; все прямые зависимости закрыты |
| [P3-09 Страница навыка (вёрстка)](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/42) | sosolet | In Progress; все прямые зависимости закрыты |
| [P3-11 Вход и шаг 1 регистрации (вёрстка)](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/44) | kkiitlin | In Progress; все прямые зависимости закрыты |
| [P3-12 Шаг 2 регистрации (вёрстка)](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/45) | Al-Du9270-art | In Progress; P3-11 (In Progress), P2-12 (In Progress), P2-17 (In Progress) |
| [P3-16 «О проекте», 404 и 500](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/49) | muntaniolirina | In Progress; все прямые зависимости закрыты |
| [P4-03 Пользователи и навыки](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/52) | Nick-Shvd | In Progress; все прямые зависимости закрыты |
| [P8-02 Команда на странице «О проекте»](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/81) | pwkdmc | Review; вклад Дианы влит в PR #159, общая карточка ещё Review; P3-16 (In Progress) |

У `Laurovsky` две текущие задачи; остальные активные назначения перечислены выше. P4-06 и P5-02 больше не приписываем `pwkdmc`: на GitHub сейчас нет исполнителя. Заранее назначены P8-04/P8-06 — `viceede`, P8-05/P8-07 — `kirill-ai-dev`; они остаются Backlog до финальных проверок.

## Готовность к Todo

Todo — ближайшая очередь фиксированного состава команды после текущих In Progress / Review / Need fix. Незавершённая зависимость не запрещает перенос: её статус указываем явно, а перед интеграцией согласуем API и общие файлы. Перечисленные ниже рекомендации **не меняют фактические статусы GitHub**.

В Todo уже **десять задач без исполнителей**; повторно переносить их не нужно:

| Задача | Для интеграции остаётся |
|---|---|
| [P3-06 Все навыки: меню и страница](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/39) | все прямые зависимости закрыты |
| [P3-10 Каталог (вёрстка)](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/43) | P3-07 (Need fix) |
| [P3-13 Шаг 3 регистрации и окна (вёрстка)](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/46) | P3-12 (In Progress) |
| [P3-14 Личный кабинет (вёрстка)](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/47) | P3-12 (In Progress), P2-12 (In Progress) |
| [P4-06 Сохранение пользователей и навыков](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/55) | P4-03 (In Progress) |
| [P4-04 Загрузка при старте](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/53) | P4-03 (In Progress), P3-16 (In Progress) |
| [P4-09 Вход](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/58) | P4-03 (In Progress), P3-11 (In Progress) |
| [P5-02 Панель фильтров в действии](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/60) | P3-07 (Need fix) |
| [P6-01 Черновик регистрации и охрана шагов](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/68) | P3-11 (In Progress) |
| [P7-01 Страница навыка с данными](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/74) | P3-09 (In Progress), P4-03 (In Progress) |

**В первую очередь можно дополнительно перенести из Backlog:** P6-03 (#70) — её оставшаяся зависимость P3-12 уже в работе. **Затем P5-04 (#62):** нужны P4-03 (In Progress) и P3-10 (Todo); карточки и раскрытие секций готовы, поиск P5-03 уже подключён к шапке. Общую P8-02 (#81) отдельно можно вернуть из Review в Todo для остальных участников по решению тимлида.

Ниже проверена **21 задача Backlog**. «Ближайшая» — следующая после текущей работы; «Следом» — после уже существующей Todo-очереди; «Позже» — более длинная цепочка. Порядок не запрещает тимлиду включить задачу в Todo раньше.

| Задача Backlog | Оставшиеся прямые зависимости | Очередь |
|---|---|---|
| [P5-04 Секции «Популярное» и «Новое»](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/62) | P4-03 (In Progress), P3-10 (Todo) | Следом — можно планировать в Todo |
| [P5-05 Результаты: плашки и сортировка](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/63) | P5-02 (Todo), P3-10 (Todo), P5-04 (Backlog) | Позже |
| [P5-06 Лента «Рекомендуем» и результатов](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/64) | P5-05 (Backlog), P5-04 (Backlog) | Позже |
| [P5-07 Лайки со счётчиком](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/65) | P4-06 (Todo), P4-09 (Todo) | Следом — можно планировать в Todo |
| [P5-08 Страница избранного](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/66) | P5-07 (Backlog), P5-02 (Todo), P4-09 (Todo) | Позже |
| [P5-09 Шапка вошедшего и выход](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/67) | P4-09 (Todo) | Следом — можно планировать в Todo |
| [P6-02 Шаг 1: email и пароль](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/69) | P6-01 (Todo), P4-03 (In Progress) | Следом — можно планировать в Todo |
| [P6-03 Связь «категория ↔ подкатегория»](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/70) | P3-12 (In Progress) | Ближайшая — можно в Todo |
| [P6-04 Шаг 2: о себе и «Хочу научиться»](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/71) | P6-01 (Todo), P6-03 (Backlog), P6-02 (Backlog) | Позже |
| [P6-05 Шаг 3: свой навык и превью](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/72) | P6-01 (Todo), P6-03 (Backlog), P3-13 (Todo) | Позже |
| [P6-06 Завершение регистрации](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/73) | P6-02 (Backlog), P6-04 (Backlog), P6-05 (Backlog), P4-06 (Todo) | Позже |
| [P7-02 Похожие предложения](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/75) | P7-01 (Todo) | Следом — можно планировать в Todo |
| [P7-03 «Предложить обмен»](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/76) | P7-01 (Todo), P4-09 (Todo) | Следом — можно планировать в Todo |
| [P7-05 Уведомления в действии](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/78) | P5-09 (Backlog) | Позже |
| [P7-06 «Личные данные»: сохранение](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/79) | P3-14 (Todo), P4-06 (Todo), P4-09 (Todo), P6-04 (Backlog) | Позже |
| [P8-01 Ошибка 500 и ErrorBoundary](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/80) | P3-16 (In Progress), P4-04 (Todo) | Следом — можно планировать в Todo |
| [P8-03 Пустые списки](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/82) | P5-05 (Backlog), P5-08 (Backlog) | Позже |
| [P8-04 Доступность](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/83) | завершение фаз 5–7 | Позже |
| [P8-05 Автотесты главных сценариев](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/84) | завершение фаз 5–7 | Позже |
| [P8-06 Сверка с макетом и демо](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/85) | P8-04 (Backlog) | Позже |
| [P8-07 Проверка критериев приёмки](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/86) | P8-05 (Backlog), P8-06 (Backlog) | Позже |

P5-05 уже может использовать готовые селекторы поиска и `applyFilters`; завершение P5-03 не закрывает её оставшиеся зависимости P5-02, P3-10 и P5-04. Девять дополнительных задач фазы 9 остаются вне ближайшей очереди до завершения MVP.

## По исполнителям

Считаю полностью завершённые задачи плана; принятый личный вклад в общую P8-02 указан отдельно и не увеличивает число закрытых задач фазы 8.

| Исполнитель | Сделано | Задачи | Сейчас |
|---|---|---|---|
| kirill-ai-dev 👑 | фаза 0 + 9 | фаза 0, P1-10, P1-12, P4-01, P4-10, P3-01, P4-05, P3-08, P4-07, P5-01 | заранее P8-05, P8-07 |
| viceede 👑 | 5 | P1-09, P1-11, P1-13, P1-14, P3-02 | заранее P8-04, P8-06 |
| muntaniolirina | 6 | P1-02, P2-04, P2-11, P2-14, P3-15, P4-08 | P3-16 |
| pwkdmc | 7 + вклад в P8-02 | P1-03, P1-08, P2-08, P2-13, P2-16, P4-02, P5-03; личный мини-PR P8-02 #159 принят | общая P8-02 ещё назначена, Review; P4-06/P5-02 свободны |
| Laurovsky | 3 | P1-05, P2-05, P2-07 | P2-12, P2-17 |
| Al-Du9270-art | 4 | P2-02, P2-10, P2-15, P3-05 | P3-12 |
| alicevdr | 3 | P1-06, P2-03, P7-04 | P3-07 (Need fix, PR #148) |
| sosolet | 2 | P1-01, P2-18 | P3-09 |
| Stanislave0 | 2 | P2-01, P2-09 | без задачи |
| Nick-Shvd | 1 | P1-07 | P4-03 |
| kkiitlin | 4 | P1-04, P3-03, P2-06, P3-04 | P3-11 |

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
| [P2-09](phases/phase-02-ui-kit.md) Select 🟡 | Stanislave0 | Обычный и searchable Select с единым раскрывающимся полем, поиском и очисткой; клавиатура, ошибки и disabled. На ревью я уточнил ARIA, фокус и обновление вариантов, дополнил тесты; MultiSelect остаётся в P2-17 | 2026-11-07 | [#145](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/145) |

## Фаза 3 — Вёрстка блоков и страниц

| Задача | Исполнитель | Итог | Влито | PR |
|---|---|---|---|---|
| [P3-01](phases/phase-03-layout.md) Карточка пользователя UserCard 🔴 | kirill-ai-dev | Карточка каталога по макету: `UserSummary` (общий с P3-02), `SkillTag`, «+N» по `CATALOG.CARD_LEARN_TAGS`, `pluralize`; данные пропсами, лайк и «Подробнее» — слотами; длинные названия обрезаются с подсказкой; story на настоящих данных из `public/db`. Задача-образец для команды | 2026-11-03 | [#133](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/133) |
| [P3-03](phases/phase-03-layout.md) Подвал 🟢 | kkiitlin | Готовый Logo, три колонки ссылок и «SkillSwap — 2025»; рабочие переходы на `/about` и `/skills`, остальные пункты — неинтерактивные заглушки; 8 тестов и story. На ревью уточнён интервал копирайта и подключён общий `ROUTER_FUTURE`; подключён в MainLayout в P3-05 | 2026-11-04 | [#141](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/141) |
| [P3-08](phases/phase-03-layout.md) Карточка предложения и секция 🟡 | kirill-ai-dev | `OfferCard` собирает UserCard, визуальное сердечко со счётчиком и ссылку на навык; `OffersSection` — сетка по три и независимое раскрытие 3 ⇄ 9 с анимацией и поддержкой reduced motion. Карточка передаётся через `renderItem`; 14 новых тестов, stories и сверка с Figma. Лайки, загрузка ленты и статус обмена остаются в P5-07, P5-06 и P7-04 | 2026-11-04 | [#142](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/142) |
| [P3-15](phases/phase-03-layout.md) Уведомления (вёрстка) 🟢 | muntaniolirina | `NotificationItem`, `NotificationsPanel` и `MarkAllReadButton` со состояниями новых, просмотренных и пустого списка; callback-пропсы без Redux и сохранения, 24 новых теста, stories, README и сверка размеров с Figma. Сохранение и подключение к шапке остаются в P4-07 и P7-05 | 2026-11-05 | [#143](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/143) |
| [P3-02](phases/phase-03-layout.md) Карточка автора и блок навыка 🟡 | viceede | `UserProfileCard` с данными автора и чипами, `SkillInfo` с описанием и галереей на Carousel, слоты действий через пропсы; публичные экспорты, тесты и stories. Сборка страницы остаётся в P3-09 | 2026-11-06 | [#150](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/150) |
| [P3-04](phases/phase-03-layout.md) Шапка (вёрстка) 🟡 | kkiitlin | Header гостя и вошедшего, меню через слоты и SearchInput с Enter/лупой и очисткой; тесты, stories и README. На ревью я уточнил ARIA-связи, пустые слоты и клавиатуру, сохранил нативные ссылки и кнопки; лейаут и поиск подключены в P3-05/P5-03, сессия и уведомления остаются в P5-09/P7-05 | 2026-11-07 | [#153](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/153) |
| [P3-05](phases/phase-03-layout.md) Лейауты страниц 🟢 | Al-Du9270-art | MainLayout с готовыми Header/Footer и AuthLayout с Logo/Button; контейнеры на токенах, main и формы остаются у страниц. На ревью я уточнил переиспользование и навигацию, добавил тесты клавиатуры и обновил README; подключение поиска проверено дополнительно в P5-03 | 2026-11-08 | [#157](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/157) |

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
| [P5-01](phases/phase-05-catalog.md) Логика фильтров 🔴 | kirill-ai-dev | Я реализовал `applyFilters`, Redux-действия, селекторы и публичный API: AND между блоками и поиском, OR внутри блока, режимы по данным автора, поиск по названию предложения, сортировки, удаление и сброс. 53 теста, 100 % покрытия ядра; поиск подключён в P5-03; панель и результаты остаются в P5-02/P5-05 | 2026-11-07 | [#154](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/154) |
| [P5-03](phases/phase-05-catalog.md) Поиск 🟡 | pwkdmc | SearchInput подключён к Redux: Enter/лупа, trim, очистка и фокус. На ревью я исправил внешние и повторные команды, переиспользовал общий renderWithProviders, сократил store stories и проверил переходы между лейаутами. Список и счётчик результатов остаются в P3-10/P5-05 | 2026-11-08 | [#158](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/158) |

## Фаза 7 — Навык, обмен, уведомления, профиль

| Задача | Исполнитель | Итог | Влито | PR |
|---|---|---|---|---|
| [P7-04](phases/phase-07-skill-profile.md) «Обмен предложен» на карточке 🟢 | alicevdr | OfferCard показывает статичный ExchangeStatusBadge только для исходящего обмена текущего пользователя этому автору. На ревью я восстановил тесты карточки и дополнил проверки направления обмена, смены сессии, сохранения, ошибок и клавиатуры, синхронизировал stories и README; загрузку обменов подключает контейнер в P5-04/P5-06 | 2026-11-07 | [#155](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/155) |

## Фаза 8 — принятые частичные результаты

Эта таблица не добавляет ✅ всей P8-02 и не входит в 46 завершённых задач MVP.

| Общая задача | Участник | Принятый вклад | Влито | PR |
|---|---|---|---|---|
| [P8-02](phases/phase-08-finish.md) Команда | pwkdmc | Диана Дунаева добавила имя, роль, GitHub, описание и фото в TEAM. На ревью я исправил публичный URL `/images/team/t0.jpg`; остальным участникам ещё нужно добавить себя, рендер страницы — P3-16 | 2026-11-08 | [#159](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/159) |
