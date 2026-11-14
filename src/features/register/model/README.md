# src/features/register/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `register` — данные и логика: типы, Redux-слайс, селекторы, схемы валидации.

**Текущее состояние:** черновик и прогресс шагов работают (P6-01): `draftUpdated`, `stepCompleted`, `registerReset`, селекторы `selectCompletedStep` и `selectRegisterDraft`. Схема первого шага использует общие emailField/passwordField; форма подключает её через yupResolver, а уникальность email проверяет по загруженным пользователям. Остальные схемы — P6-04/P6-05. Описания ниже — целевой сценарий.

## Что внутри

- `registerSlice.ts` — Черновик регистрации из 3 шагов. «Назад» не стирает введённое, «Закрыть ×» — сбрасывает черновик. После «Готово» — всегда каталог.
  - `draftUpdated(partial)` — дописать поля шага в черновик, остальные не трогаются
  - `stepCompleted(step)` — шаг пройден; номер только растёт (вернулся на шаг 1 и снова «Далее» — шаг 2 остаётся пройденным)
  - `registerReset()` — пустой черновик и 0 пройденных шагов; при выходе из регистрации вызывает `RegisterDraftLifecycle` в app/router; после успешного завершения сброс подключает P6-06
  - `selectCompletedStep`, `selectRegisterDraft` — для охраны шагов и заполнения полей после «Назад»
- `registerSlice.test.ts` — тесты редьюсеров и селекторов
- `schema.ts` — Шаг 1: email + пароль. Уникальность email проверяется отдельно — по загруженным пользователям. Общие emailField() / passwordField() из @/shared/lib/validation
- `types.ts` — Данные, накопленные по всем шагам. Хранятся в Redux, поэтому только сериализуемые значения: файлы фото (`File`) не кладём в store — здесь только их превью `blob:`; сами файлы держит страница регистрации
