# Отчёт о задачах

Кто какую задачу сделал, что получилось и кто что делает сейчас. Отчёт нужен для команды, наставников и итоговой защиты.

**На 09.11.2026:** завершены **53 из 86 задач MVP**; вместе с девятью задачами фундамента — **62**. По фазам: 1 — 14/14, 2 — 18/18, 3 — 11/16, 4 — 7/10, 5 — 2/9, 6 — 0/6, 7 — 1/6, 8 — 0/7. Общая P8-02 пока не завершена: приняты два личных вклада.

Я сверил issues, назначения, влитые PR и [доску GitHub](https://github.com/orgs/PM-YandexPracticum/projects/133/views/1). Снимок: **Backlog — 20, Todo — 5, In Progress — 6, Review — 2, Need fix — 0, Done — 54**. Всего 87 карточек: 86 задач MVP и общая карточка фундамента #1. Done = 53 + 1; в плане фундамент состоит из девяти задач. Девять дополнительных задач фазы 9 вне доски MVP; старые ICS-задачи #90/#91 исключены, действующие P9-04/P9-05 — #92/#93.

## Последние принятые результаты — 08–09.11.2026

| Задача | Исполнитель | Итог |
|---|---|---|
| P3-05 «Лейауты страниц» | Al-Du9270-art | [PR #157](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/157) влит. MainLayout собирает готовые Header и Footer, AuthLayout — Logo и Button; рамки на токенах, main предоставляет страница. Проверены навигация и клавиатура. Issue #38 закрыта, Done. |
| P5-03 «Поиск» | pwkdmc | [PR #158](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/158) влит. Я исправил внешнее применение/сброс, включая повторные команды, убрал копии store в тестах и stories, актуализировал README/JSDoc. Проверил сохранение применённого запроса при переходе на вход и обратно; добавлен интеграционный тест лейаутов. Issue #61 закрыта, Done. |
| P2-12 | Laurovsky | [PR #162](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/162) влит, issue #28 закрыта. DatePicker на Input и react-datepicker: ручной ввод и календарь, русский язык, месяц/год, «Отменить» / «Выбрать», ISO без часового пояса, ошибка и сброс. Добавлены тесты и stories; правила возраста задаёт форма. |
| P2-17 | Laurovsky | [PR #163](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/163) влит, issue #33 закрыта. MultiSelect переиспользует стили раскрывающегося поля Select и Checkbox; управляемый множественный выбор, первое выбранное название и «+N», клавиатура, ошибка и disabled. Добавлены тесты и stories; связь категорий остаётся в P6-03. |
| P3-06 | kirill-ai-dev | [PR #165](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/165) влит, issue #39 закрыта. CategoriesList и CategoriesMenu переиспользуются в слоте Header и на /skills; CategoryIcon использует токены. Предусмотрены загрузка, ошибка и повтор, пустой список, дедупликация запросов; тесты, stories и скриншоты в docs/assets. |
| P3-07 | alicevdr | [PR #148](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/148) влит, issue #40 закрыта. Панель и группы фильтров свёрстаны на общих Checkbox/RadioGroup и токенах, справочники поступают через селекторы. Все 6 категорий видимы как в макете; раскрытие нужно только для дополнительных категорий. Выбор визуальный, без изменения Redux; подключение — P5-02. |
| P3-11 | kkiitlin | [PR #164](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/164) влит, issue #44 закрыта. Вход и шаг 1 регистрации собирают общие AuthPageLayout, CredentialsForm, Input, PasswordInput, Button и OAuthButtons. Поддержаны callback-пропсы, ошибки и отправка формы; добавлены тесты и stories. Вход с сессией — P4-09, черновик и валидация регистрации — фаза 6. |
| P3-16 | muntaniolirina | [PR #167](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/167) влит, issue #49 закрыта. Готовы /about с карточками TEAM, 404 и /500; ErrorPage переиспользует иллюстрацию, заголовок и описание, действия собраны страницами. ErrorBoundary остаётся в P8-01; наполнение всей команды — P8-02. |
| P4-03 | Nick-Shvd | [PR #161](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/161) влит, issue #52 закрыта. Готовы загрузочные thunks пользователей и навыков, статусы/ошибки и селекторы по id, пользователю, популярности и новизне. Учтены пустые данные и отсутствующие ссылки, добавлены тесты. Загрузка при старте — P4-04, запись — P4-06. |
| P8-02, личные вклады | pwkdmc, viceede | [PR #159](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/159) и [PR #168](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/168) влиты; в TEAM две записи. Общая issue #81 открыта. |

P8-02 фактически остаётся в Review с назначением `pwkdmc`. Это состояние общей карточки; личные вклады Дианы и Андрея уже приняты. Рекомендация тимлиду — вернуть общую карточку в Todo для остальных участников. В этой актуализации я доску, issues и назначения не менял.

## Проверки текущего состояния

Исходники синхронизированы с `origin/develop` (`2f710f1`, PR #168). Проверки ниже выполнены на этом снимке. Код приложения в рамках актуализации документации не менялся.

| Проверка | Результат |
|---|---|
| `npm run lint` | ESLint и Stylelint проходят |
| `npm run test:coverage` | 96 файлов, 824 теста — все проходят; statements/lines 97,03 %, branches 96,05 %, functions 83,03 % |
| `npm run build` | TypeScript и production-сборка Vite проходят |
| `npm run build-storybook` | Storybook собирается; Vite предупреждает о крупных чанках Storybook |
| Документация | Проверены 202 Markdown-файла, 486 относительных ссылок (включая 12 якорей), README всех каталогов src, 95 статусов и зависимостей, счётчики, назначения и даты/авторы влитых PR |

Покрытие считается по текущему `vitest.config.ts`, включая тестовые файлы; оно не заменяет отдельную оценку ядра в P8-07. Браузерные проверки из предыдущих ревью здесь повторно не проводились. Согласованное замечание по контрасту P3-15 остаётся в [бэклоге](backlog.md). Сквозные сценарии Playwright, Lighthouse и финальная сверка всех экранов с макетом остаются в P8-04…P8-07; готовность всего MVP пока не подтверждена.

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

Я сверил все **95 задач фаз 1–9**: issue, статус, назначение и оставшиеся прямые зависимости. Для 86 задач MVP указан фактический статус доски; для фазы 9 — открытые issues вне доски MVP. Для каждой завершённой задачи результат и PR отражены ниже и в файле фазы. Общая P8-02 учитывается отдельно от завершённых задач.

Локальные описания соответствуют текущему `develop`; исторические результаты проверок помечены датой. Это не означает, что тексты удалённых issues дословно совпадают с файлами фаз: GitHub в этой работе я не редактировал. Документация не заменяет ревью каждой реализации и повторную проверку всех экранов по Figma.

## Как заполнять

- После влития PR отмечаем ✅ в файле фазы, результат и PR, счётчики roadmap и отчёта.
- **Исполнитель завершённой задачи** — автор PR; дата влития — по Москве. Для открытой задачи показываем текущее назначение GitHub.
- P8-02 состоит из личных мини-PR: вклад отмечаем отдельно; всю задачу закрываем после добавления команды. В мини-PR пишем `Refs #81`, без `Closes #81`.

## Сейчас в работе

Ориентиры по срокам — в [README задач](README.md#сроки). Таблица отражает фактические колонки и назначения.

| Задача | Исполнитель | Состояние и оставшиеся зависимости |
|---|---|---|
| [P3-09 Страница навыка (вёрстка) 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/42) | `sosolet` | Review; открыт PR #166; все прямые зависимости закрыты |
| [P3-12 Шаг 2 регистрации (вёрстка) 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/45) | `Al-Du9270-art` | In Progress; все прямые зависимости закрыты |
| [P3-14 Личный кабинет (вёрстка) 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/47) | `alicevdr` | In Progress; P3-12 (In Progress) |
| [P4-04 Загрузка при старте 🟢](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/53) | `Laurovsky` | In Progress; все прямые зависимости закрыты |
| [P4-09 Вход 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/58) | `Laurovsky` | In Progress; все прямые зависимости закрыты |
| [P6-01 Черновик регистрации и охрана шагов 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/68) | `kkiitlin` | In Progress; все прямые зависимости закрыты |
| [P6-03 Связь «категория ↔ подкатегория» 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/70) | `muntaniolirina` | In Progress; P3-12 (In Progress) |
| [P8-02 Команда на странице «О проекте» 🟢](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/81) | `pwkdmc` | Review; два личных вклада приняты, общая задача открыта; все прямые зависимости закрыты |

У `Laurovsky` две текущие задачи — P4-04 и P4-09; это фактическое назначение GitHub. P8-04/P8-06 заранее назначены `viceede`, P8-05/P8-07 — `kirill-ai-dev` и остаются Backlog. Остальным не приписываю задачи по старым назначениям.

## Готовность к Todo

Todo — ближайшая очередь фиксированного состава команды после текущих In Progress / Review. Незавершённая зависимость не запрещает перенос: её статус указываем явно, API и общие файлы согласуем перед интеграцией. Ниже рекомендации; фактические статусы GitHub не менялись.

В Todo уже **пять задач без исполнителей**:

| Задача | Для интеграции остаётся |
|---|---|
| [P3-10 Каталог (вёрстка) 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/43) | все прямые зависимости закрыты |
| [P3-13 Шаг 3 регистрации и окна (вёрстка) 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/46) | P3-12 (In Progress) |
| [P4-06 Сохранение пользователей и навыков 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/55) | все прямые зависимости закрыты |
| [P5-02 Панель фильтров в действии 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/60) | все прямые зависимости закрыты |
| [P7-01 Страница навыка с данными 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/74) | P3-09 (Review) |

**Ближайшие дополнительные кандидаты:** P5-04 (#62, остаётся P3-10 — Todo), P6-02 (#69, P6-01 — In Progress), P5-09 (#67, P4-09 — In Progress), P8-01 (#80, P4-04 — In Progress). Их можно планировать для освободившихся участников уже сейчас, не ожидая закрытия всех зависимостей. Это очередь, а не предложение увеличивать число исполнителей или открывать человеку вторую задачу.

Ниже все **20 задач Backlog** с оставшимися прямыми зависимостями. «Следом» и «Позже» задают порядок, а не запрет переноса в Todo.

| Задача Backlog | Оставшиеся прямые зависимости | Очередь |
|---|---|---|
| [P5-04 Секции «Популярное» и «Новое» 🟢](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/62) | P3-10 (Todo) | Ближайшая — можно планировать в Todo |
| [P5-05 Результаты: плашки и сортировка 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/63) | P5-02 (Todo), P3-10 (Todo), P5-04 (Backlog) | Позже |
| [P5-06 Лента «Рекомендуем» и результатов 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/64) | P5-05 (Backlog), P5-04 (Backlog) | Позже |
| [P5-07 Лайки со счётчиком 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/65) | P4-06 (Todo), P4-09 (In Progress) | Следом |
| [P5-08 Страница избранного 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/66) | P5-07 (Backlog), P5-02 (Todo), P4-09 (In Progress) | Позже |
| [P5-09 Шапка вошедшего и выход 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/67) | P4-09 (In Progress) | Ближайшая — можно планировать в Todo |
| [P6-02 Шаг 1: email и пароль 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/69) | P6-01 (In Progress) | Ближайшая — можно планировать в Todo |
| [P6-04 Шаг 2: о себе и «Хочу научиться» 🔴](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/71) | P6-01 (In Progress), P6-03 (In Progress), P6-02 (Backlog) | Позже |
| [P6-05 Шаг 3: свой навык и превью 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/72) | P6-01 (In Progress), P6-03 (In Progress), P3-13 (Todo) | Позже |
| [P6-06 Завершение регистрации 🔴](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/73) | P6-02 (Backlog), P6-04 (Backlog), P6-05 (Backlog), P4-06 (Todo) | Позже |
| [P7-02 Похожие предложения 🟢](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/75) | P7-01 (Todo) | Следом |
| [P7-03 «Предложить обмен» 🔴](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/76) | P7-01 (Todo), P4-09 (In Progress) | Следом |
| [P7-05 Уведомления в действии 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/78) | P5-09 (Backlog) | Позже |
| [P7-06 «Личные данные»: сохранение 🔴](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/79) | P3-14 (In Progress), P4-06 (Todo), P4-09 (In Progress), P6-04 (Backlog) | Позже |
| [P8-01 Ошибка 500 и ErrorBoundary 🟢](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/80) | P4-04 (In Progress) | Ближайшая — можно планировать в Todo |
| [P8-03 Пустые списки 🟢](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/82) | P5-05 (Backlog), P5-08 (Backlog) | Позже |
| [P8-04 Доступность 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/83) | завершение фаз 5–7 | Позже |
| [P8-05 Автотесты главных сценариев 🔴](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/84) | завершение фаз 5–7 | Позже |
| [P8-06 Сверка с макетом и демо 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/85) | P8-04 (Backlog) | Позже |
| [P8-07 Проверка критериев приёмки 🟡](https://github.com/PM-YandexPracticum/SkillSwap_58_4/issues/86) | P8-05 (Backlog), P8-06 (Backlog) | Позже |

P5-05 использует готовое ядро фильтров и поиск, но ждёт P5-02, P3-10 и P5-04. P6-03 уже в In Progress у `muntaniolirina`, повторно предлагать перенос не нужно. Общую P8-02 можно вернуть из Review в Todo для остальных участников по решению тимлида. Девять дополнительных задач фазы 9 остаются вне ближайшей очереди до завершения MVP.

## По исполнителям

Считаю полностью завершённые задачи MVP; девять задач фундамента и личные вклады P8-02 указаны отдельно.

| Исполнитель | Сделано MVP | Завершённые задачи | Текущие назначения |
|---|---|---|---|
| kirill-ai-dev | 10; ещё 9 задач фундамента | P1-10, P1-12, P3-01, P3-06, P3-08, P4-01, P4-05, P4-07, P4-10, P5-01 | P8-05 (Backlog), P8-07 (Backlog) |
| viceede | 5; личный вклад P8-02 принят | P1-09, P1-11, P1-13, P1-14, P3-02 | P8-04 (Backlog), P8-06 (Backlog) |
| muntaniolirina | 7 | P1-02, P2-04, P2-11, P2-14, P3-15, P3-16, P4-08 | P6-03 (In Progress) |
| pwkdmc | 7; личный вклад P8-02 принят | P1-03, P1-08, P2-08, P2-13, P2-16, P4-02, P5-03 | P8-02 (Review) |
| Laurovsky | 5 | P1-05, P2-05, P2-07, P2-12, P2-17 | P4-04 (In Progress), P4-09 (In Progress) |
| Al-Du9270-art | 4 | P2-02, P2-10, P2-15, P3-05 | P3-12 (In Progress) |
| alicevdr | 4 | P1-06, P2-03, P3-07, P7-04 | P3-14 (In Progress) |
| sosolet | 2 | P1-01, P2-18 | P3-09 (Review) |
| Stanislave0 | 2 | P2-01, P2-09 | без назначенной задачи |
| Nick-Shvd | 2 | P1-07, P4-03 | без назначенной задачи |
| kkiitlin | 5 | P1-04, P2-06, P3-03, P3-04, P3-11 | P6-01 (In Progress) |

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
| [P2-03](phases/phase-02-ui-kit.md) Tag и плашка 🟢 | alicevdr | Цветной чип навыка с цветом снаружи (`color`) и крестиком по `onRemove` — один компонент для чипа и плашки фильтра; stories со всеми цветами категорий, тесты. Ревью — viceede | 2026-11-03 | [#121](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/121) |
| [P2-16](phases/phase-02-ui-kit.md) Общие правила валидации 🟡 | pwkdmc | Шесть правил полей (email, пароль, имя, дата рождения, текст, город) на лимитах и текстах из конфигов и `validation.md`; 36 тестов, повторяющиеся случаи таблицей. Ревью — viceede | 2026-11-03 | [#128](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/128) |
| [P2-14](phases/phase-02-ui-kit.md) FileDropzone 🟡 | muntaniolirina | Зона загрузки фото: перетаскивание и выбор файла, превью с крестиком, с клавиатуры — одна кнопка; `validateImageFile` и `fileToDataUrl` с уменьшением фото до 800 px в JPEG; 23 теста, 9 stories. На ревью тимлид влил develop, вынес 800 px и качество JPEG в `VALIDATION.IMAGE`, перевёл тесты на поиск по роли, добавил тест белой заливки холста | 2026-11-03 | [#132](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/132) |
| [P2-05](phases/phase-02-ui-kit.md) Поля Input и Textarea 🟢 | Laurovsky | Поля с подписью, ошибкой и иконкой справа, `forwardRef` для react-hook-form, ошибка связана через `aria-describedby`; 18 тестов, stories. На ревью тимлид добавил кликабельную кнопку справа `rightAction` (для PasswordInput и поиска в Select), высоту 48 px и интервал по макету | 2026-11-03 | [#135](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/135) |
| [P2-07](phases/phase-02-ui-kit.md) Checkbox и RadioGroup 🟡 | Laurovsky | Настоящие `input` под значками — клавиатура и скринридер работают без своего кода; частичный выбор категории; 17 тестов, живые stories. На ревью тимлид привёл заголовок группы и интервалы к макету, убрал лишний `aria-checked` | 2026-11-03 | [#137](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/137) |
| [P2-10](phases/phase-02-ui-kit.md) Modal 🟡 | Al-Du9270-art | Обёртка поверх затемнённой страницы: portal, Esc и клик по фону, фокус внутри окна и возврат после закрытия; содержимое через `children`. На ревью тимлид исправил сброс фокуса при перерисовке родителя, добавил прокрутку высокого окна и блокировку страницы, убрал внутренние отступы (у окон они разные), сделал `ariaLabel` обязательным; 7 тестов | 2026-11-03 | [#138](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/138) |
| [P2-13](phases/phase-02-ui-kit.md) Carousel 🟡 | pwkdmc | Обёртка над `embla-carousel-react` со стрелками, настройками числа слайдов и обратными вызовами API и выбора; тесты и stories галереи, превью навыка и похожих предложений | 2026-11-03 | [#127](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/127) |
| [P2-18](phases/phase-02-ui-kit.md) Toast 🟡 | sosolet | Toast, контекст и `useToast`, подключённый в App провайдер с независимыми таймерами на 4 с; закрытие мышью и клавиатурой, область объявлений скринридером. На ревью тимлид сверил вёрстку с Figma, исправил перенос текста и очистку ресурсов, добавил живые stories и тесты; бизнес-сценарий обмена остаётся в P7-03 | 2026-11-04 | [#140](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/140) |
| [P2-15](phases/phase-02-ui-kit.md) Лента с догрузкой 🟡 | Al-Du9270-art | `useInfiniteScroll` с порциями по прокрутке, состояниями загрузки и окончания списка; сброс при смене данных, отмена таймеров и очистка наблюдателей. На ревью я дополнил обработку пограничных ситуаций и 36 тестов; подключение в каталоге и избранном остаётся в P5-06/P5-08 | 2026-11-06 | [#152](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/152) |
| [P2-06](phases/phase-02-ui-kit.md) PasswordInput 🟢 | kkiitlin | Поле на основе Input: показать/скрыть пароль, подсказка через `hint`, ошибка вместо подсказки, доступная кнопка, ref и совместимость с react-hook-form. При disabled глаз скрыт; 9 тестов, 5 stories. Ревью и влитие — viceede | 2026-11-07 | [#146](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/146) |
| [P2-09](phases/phase-02-ui-kit.md) Select 🟡 | Stanislave0 | Обычный и searchable Select с единым раскрывающимся полем, поиском и очисткой; клавиатура, ошибки и disabled. На ревью я уточнил ARIA, фокус и обновление вариантов, дополнил тесты; MultiSelect готов в P2-17 | 2026-11-07 | [#145](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/145) |
| [P2-12](phases/phase-02-ui-kit.md) DatePicker 🟡 | Laurovsky | Я проверил и актуализировал реализацию: DatePicker на Input и react-datepicker: ручной ввод и календарь, русский язык, месяц/год, «Отменить» / «Выбрать», ISO без часового пояса, ошибка и сброс. Добавлены тесты и stories; правила возраста задаёт форма. | 2026-11-08 | [#162](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/162) |
| [P2-17](phases/phase-02-ui-kit.md) MultiSelect 🟡 | Laurovsky | Я проверил и актуализировал реализацию: MultiSelect переиспользует стили раскрывающегося поля Select и Checkbox; управляемый множественный выбор, первое выбранное название и «+N», клавиатура, ошибка и disabled. Добавлены тесты и stories; связь категорий остаётся в P6-03. | 2026-11-08 | [#163](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/163) |

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
| [P3-06](phases/phase-03-layout.md) Все навыки: меню и страница 🟡 | kirill-ai-dev | Я проверил и актуализировал реализацию: CategoriesList и CategoriesMenu переиспользуются в слоте Header и на /skills; CategoryIcon использует токены. Предусмотрены загрузка, ошибка и повтор, пустой список, дедупликация запросов; тесты, stories и скриншоты в docs/assets. | 2026-11-08 | [#165](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/165) |
| [P3-07](phases/phase-03-layout.md) Панель фильтров (вёрстка) 🟡 | alicevdr | Я проверил и актуализировал реализацию: Панель и группы фильтров свёрстаны на общих Checkbox/RadioGroup и токенах, справочники поступают через селекторы. Все 6 категорий видимы как в макете; раскрытие нужно только для дополнительных категорий. Выбор визуальный, без изменения Redux; подключение — P5-02. | 2026-11-09 | [#148](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/148) |
| [P3-11](phases/phase-03-layout.md) Вход и шаг 1 регистрации (вёрстка) 🟢 | kkiitlin | Я проверил и актуализировал реализацию: Вход и шаг 1 регистрации собирают общие AuthPageLayout, CredentialsForm, Input, PasswordInput, Button и OAuthButtons. Поддержаны callback-пропсы, ошибки и отправка формы; добавлены тесты и stories. Вход с сессией — P4-09, черновик и валидация регистрации — фаза 6. | 2026-11-09 | [#164](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/164) |
| [P3-16](phases/phase-03-layout.md) «О проекте», 404 и 500 🟢 | muntaniolirina | Я проверил и актуализировал реализацию: Готовы /about с карточками TEAM, 404 и /500; ErrorPage переиспользует иллюстрацию, заголовок и описание, действия собраны страницами. ErrorBoundary остаётся в P8-01; наполнение всей команды — P8-02. | 2026-11-09 | [#167](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/167) |

## Фаза 4 — Данные и вход

| Задача | Исполнитель | Итог | Влито | PR |
|---|---|---|---|---|
| [P4-01](phases/phase-04-data.md) «База данных» в браузере 🔴 | kirill-ai-dev | `createMockCollection` (получить, создать, изменить, удалить) поверх localStorage с задержкой как у сервера и без мутаций; повреждённые данные, недоступный localStorage и нехватка места не ломают сайт; `resetMockDb()`; 18 тестов, сброс «базы» после каждого теста | 2026-11-02 | [#124](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/124) |
| [P4-10](phases/phase-04-data.md) 👑 Перенос образцов данных в `public/db` 🟡 | kirill-ai-dev | Образцы — JSON в `public/db` по ТЗ наставника, загрузка через `fetch` (`loadSeed`) один раз при первом обращении; действия коллекции по очереди; тесты читают `public/db` без сервера; данные ушли из JS (236 → 195 КБ) | 2026-11-02 | [#125](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/125) |
| [P4-02](phases/phase-04-data.md) Справочники: категории и города 🟡 | pwkdmc | Загрузка категорий и городов в store (`fetchCategories`, `fetchCities`) и селекторы: подкатегория по id, категория подкатегории, цвет категории, город по id. На ревью тимлид добавил экспорт в `index.ts`, тесты статусов и загрузки из `public/db`, упростил `selectCategoryColor`; в `testing.md` — как проверять ошибку загрузки | 2026-11-03 | [#131](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/131) |
| [P4-05](phases/phase-04-data.md) Сессия 🟡 | kirill-ai-dev | Вход и выход одним действием (`startSession`, `endSession`) — сразу в store и localStorage; сессия переживает перезагрузку; повреждённые данные и недоступный localStorage не ломают сайт; 17 тестов | 2026-11-03 | [#136](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/136) |
| [P4-07](phases/phase-04-data.md) Обмены и уведомления 🟡 | kirill-ai-dev | API и Redux сохраняют обмены и уведомления в «базе», запрещают повторное предложение тому же пользователю, фильтруют данные по текущей сессии и поддерживают прочтение и очистку уведомлений; 44 новых теста | 2026-11-05 | [#147](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/147) |
| [P4-08](phases/phase-04-data.md) Защита закрытых страниц 🟢 | muntaniolirina | `RequireAuth` закрывает `/profile/*` и `/favorites`, гостя отправляет на вход с `replace` и полным `state.from`. На ревью я дополнил тесты до 10 случаев, экспорт типа пропсов и README роутера; возврат после входа остаётся в P4-09 | 2026-11-06 | [#149](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/149) |
| [P4-03](phases/phase-04-data.md) Пользователи и навыки 🟡 | Nick-Shvd | Я проверил и актуализировал реализацию: Готовы загрузочные thunks пользователей и навыков, статусы/ошибки и селекторы по id, пользователю, популярности и новизне. Учтены пустые данные и отсутствующие ссылки, добавлены тесты. Загрузка при старте — P4-04, запись — P4-06. | 2026-11-09 | [#161](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/161) |

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

Таблица не добавляет ✅ всей P8-02 и не входит в 53 завершённые задачи MVP. Страница TEAM уже подключена в P3-16.

| Общая задача | Участник | Принятый вклад | Влито (Москва) | PR |
|---|---|---|---|---|
| [P8-02](phases/phase-08-finish.md) Команда | pwkdmc | Диана Дунаева: имя, роль, GitHub, описание, фото `/images/team/t0.jpg`; на ревью я исправил публичный путь | 2026-11-08 | [#159](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/159) |
| [P8-02](phases/phase-08-finish.md) Команда | viceede | Андрей Васильев: имя, роль помощника тимлида, GitHub, описание, фото `/images/team/t1.jpg` | 2026-11-09 | [#168](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/168) |
