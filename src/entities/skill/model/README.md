# src/entities/skill/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `skill` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

## Что внутри

- `selectors.ts` — все навыки и статус загрузки, поиск `selectSkillById` и `selectSkillsByAuthor`; неизвестные id дают `undefined`
- `selectors.test.ts` — поиск, пустой список и статус загрузки через публичный API
- `skillsSlice.ts` — `fetchSkills` загружает навыки через API; статусы `idle/loading/succeeded/failed` и понятная ошибка из `DATA_ERRORS`
- `skillsSlice.test.ts` — статусы, ошибки, повторная загрузка, все образцы `public/db` и сохранённые навыки localStorage
- `types.ts` — Навык, которым пользователь готов поделиться («Может научить»)

## Контракты P4-03

Снаружи импортировать из `@/entities/skill`: `fetchSkills`, `skillsReducer`, `selectSkills`, `selectSkillsStatus`, `selectSkillById`, `selectSkillsByAuthor` и типы.

`selectSkillsByAuthor(state, userId)` возвращает один `Skill | undefined`: по модели пользователь предлагает ровно один навык. Селекторы не изменяют store, загрузка не сортирует навыки.

`pending` очищает прежнюю ошибку, `rejected` сохраняет ранее загруженные навыки, `fulfilled` заменяет список и очищает ошибку. Для UI используется `state.skills.error`, а не техническое исключение. Сохранение нового навыка реализуется отдельно в P4-06.
