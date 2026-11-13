# src/pages/register/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `register` — React-компоненты. Получают данные пропсами или из store через селекторы.

**Текущее состояние:** готовы RegisterLayout и RegisterStep1Page (P3-11). Номер Stepper и иллюстрация определяются маршрутом. Форма шага 2 готова (P3-12), шаг 3 — заготовка (P3-13); защита шагов и черновик готовы в P6-01, сохранение данных шагов и переходы — P6-02…P6-06.

## Что внутри

- `RegisterLayout.tsx` — Общая часть трёх шагов регистрации: Stepper «Шаг N из 3» сверху, форма шага слева (Outlet), справа иллюстрация и подпись текущего шага. Логотип и «Закрыть ×» — из AuthLayout. Черновик и прогресс принадлежат features/register. При выходе из маршрутов регистрации их очищает RegisterDraftLifecycle в app/router; лейаут не сбрасывает данные в cleanup.
- `RegisterStep1Page.tsx` — Шаг 1: email и пароль — маршрут `/register/step-1`. OAuthButtons и StepCredentials подключены через публичные API; «Далее» ведёт на шаг 2 без сохранения
- `RegisterStep2Page.tsx` — Шаг 2 «Расскажите немного о себе» — маршрут `/register/step-2`. Форма — `StepProfile` из features/register
- `RegisterStep3Page.tsx` — Шаг 3 «Укажите, чем вы готовы поделиться» — маршрут `/register/step-3`. Форма — `StepSkill` из features/register

- `RegisterLayout.test.tsx` — маршруты всех шагов, редирект /register и переход «Далее»
- `RegisterLayout.module.css` — вертикальные отступы второго шага по Figma.
- `RegisterStep2Page.test.tsx` — загрузка справочников, ошибка и переходы без сохранения.
- `RegisterLayout.stories.tsx` — рамка каждого шага, настоящие формы шагов 1–2, заготовка шага 3.
