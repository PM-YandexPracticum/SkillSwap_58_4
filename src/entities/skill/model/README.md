# src/entities/skill/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `skill` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

## Что внутри

- `selectors.ts` — все навыки и статус загрузки, поиск `selectSkillById` и `selectSkillsByAuthor`; неизвестные id дают `undefined`
- `selectors.test.ts` — поиск, пустой список и статус загрузки через публичный API
- `skillsSlice.ts` — загрузка через `fetchSkills`, создание через `createNewSkill` и обновление через `updateDataSkill`; независимые состояния загрузки и записи
- `skillsSlice.test.ts` — загрузка, запись и повторное чтение, нехватка места, повтор id и параллельные запросы
- `types.ts` — Навык, которым пользователь готов поделиться («Может научить»)

## Контракты P4-03

Снаружи импортировать из `@/entities/skill`: `fetchSkills`, `skillsReducer`, `selectSkills`, `selectSkillsStatus`, `selectSkillById`, `selectSkillsByAuthor` и типы.

`selectSkillsByAuthor(state, userId)` возвращает один `Skill | undefined`: по модели пользователь предлагает ровно один навык. Селекторы не изменяют store, загрузка не сортирует навыки.

`pending` очищает прежнюю ошибку, `rejected` сохраняет ранее загруженные навыки, `fulfilled` заменяет список и очищает ошибку. Для UI используется `state.skills.error`, а не техническое исключение. Сохранение нового навыка — через `createNewSkill` (P4-06).

Загрузочный thunk пропускает повторный dispatch, пока запрос в `loading`.
После завершения явное обновление и повтор после ошибки разрешены; начальную загрузку запускает общий `DataProvider` (P4-04).

## Сохранение (P4-06)

`createNewSkill(skill)` и `updateDataSkill({ id, changes })` экспортируются из `@/entities/skill`. Сначала API записывает навык,
затем store получает новую запись без мутации прежнего массива. Совместная загрузка и запись не дублируют id.
Объединение регистрации пользователя и навыка относится к P6-06.

`status` / `error` описывают только загрузку; `saveStatus` / `saveError` — запись.
Публичные селекторы записи — `selectSkillsSaveStatus` / `selectSkillsSaveError`.
`pendingSaves` сохраняет `loading` до завершения всех параллельных записей; ошибка группы не теряется
после успешного ответа, новая группа очищает её. Нехватка места возвращает `DATA_ERRORS.STORAGE_FULL`,
остальные ошибки — `DATA_ERRORS.SAVE_SKILL`. Отказ не меняет данные в store и «базе».
Для результата конкретной операции вызывающий код использует `dispatch(createNewSkill(skill)).unwrap()` или `dispatch(updateDataSkill(...)).unwrap()`
и обрабатывает отказ. Состояние записи не скрывает страницу через `DataProvider`.

`selectSkillById` использует общий мемоизированный отсортированный индекс: бинарный поиск O(log n) без повторной сортировки на каждой карточке. Индекс обновляется по ссылке коллекции, порядок `items` сохраняется.
