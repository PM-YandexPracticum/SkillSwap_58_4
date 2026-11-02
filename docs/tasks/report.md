# Отчёт о задачах

Кто какую задачу сделал и что получилось, и кто что делает сейчас. Отчёт нужен для наставников и итоговой защиты проекта.

**На 02.11.2026:** сделано 29 задач — фаза 0 (9), фаза 1 (14 из 14 ✅), фаза 2 (5 из 18), фаза 4 (1 из 10); в работе 8.

## Как заполнять

- Строку добавляет тимлид или помощник, когда вливает PR, — вместе с ✅ в файле фазы и счётчиком в [roadmap.md](roadmap.md).
- Взял задачу — строка в «Сейчас в работе»; влили — она переезжает в таблицу своей фазы.
- **Исполнитель** — логин на GitHub, как в PR. Задача без PR (например, настройка доски) — в столбце PR «—».
- **Итог** — 1–2 предложения: что сделано и что поправили на ревью. Берём из раздела «Что сделано» в PR.
- Порядок — по дате влития, новые снизу.

## Сейчас в работе

Ориентиры по срокам — в [README задач](README.md#сроки): 🟢 до 1 дня, 🟡 до 2, 🔴 до 3.

| Задача | Исполнитель | Взята | Состояние |
|---|---|---|---|
| P2-03 Tag и плашка 🟢 | alicevdr | 01.11 | на ревью ([#121](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/121)) |
| P2-05 Поля Input и Textarea 🟢 | Laurovsky | 31.10 | ⚠️ дольше срока; от неё ждут P2-06, P2-09, P2-12 и шапка (P3-04) |
| P2-06 PasswordInput 🟢 | kkiitlin | 02.11 | ⚠️ взята до готовности P2-05, на которой строится |
| P2-07 Checkbox и RadioGroup 🟡 | Laurovsky | 31.10 | срок 🟡 — сегодня; ⚠️ вторая задача у одного исполнителя |
| P2-10 Modal 🟡 | Al-Du9270-art | 01.11 | в срок |
| P2-14 FileDropzone 🟡 | muntaniolirina | 01.11 | в срок |
| P2-18 Toast 🟡 | sosolet | 02.11 | в срок |
| P4-10 👑 Перенос образцов данных в `public/db` 🟡 | kirill-ai-dev | 02.11 | готова, тесты зелёные; PR готовится |

## По исполнителям

Сколько задач сделал каждый и что у него сейчас. Обновляется вместе с таблицами ниже.

| Исполнитель | Сделано | Задачи | Сейчас |
|---|---|---|---|
| kirill-ai-dev 👑 | фаза 0 + 3 | фаза 0, P1-10, P1-12, P4-01 | P4-10 |
| viceede 👑 | 4 | P1-09, P1-11, P1-13, P1-14 | — |
| muntaniolirina | 3 | P1-02, P2-04, P2-11 | P2-14 |
| pwkdmc | 3 | P1-03, P1-08, P2-08 | свободен |
| Laurovsky | 1 | P1-05 | P2-05, P2-07 ⚠️ две задачи |
| Al-Du9270-art | 1 | P2-02 | P2-10 |
| alicevdr | 1 | P1-06 | P2-03 |
| sosolet | 1 | P1-01 | P2-18 |
| Stanislave0 | 1 | P2-01 | свободен |
| Nick-Shvd | 1 | P1-07 | свободен |
| kkiitlin | 1 | P1-04 | P2-06 |

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

## Фаза 4 — Данные и вход

| Задача | Исполнитель | Итог | Влито | PR |
|---|---|---|---|---|
| [P4-01](phases/phase-04-data.md) «База данных» в браузере 🔴 | kirill-ai-dev | `createMockCollection` (получить, создать, изменить, удалить) поверх localStorage с задержкой как у сервера и без мутаций; повреждённые данные, недоступный localStorage и нехватка места не ломают сайт; `resetMockDb()`; 18 тестов, сброс «базы» после каждого теста | 2026-11-02 | [#124](https://github.com/PM-YandexPracticum/SkillSwap_58_4/pull/124) |
