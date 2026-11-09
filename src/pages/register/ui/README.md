# src/pages/register/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `register` — React-компоненты. Получают данные пропсами или из store через селекторы.

**Текущее состояние:** готовы RegisterLayout и RegisterStep1Page (P3-11). Номер Stepper и иллюстрация определяются маршрутом. Формы шагов 2–3 пока заготовки (P3-12/P3-13); сохранение и защита шагов — P6-01…P6-06.

## Что внутри

- `RegisterLayout.tsx` — Общая часть трёх шагов регистрации: Stepper «Шаг N из 3» сверху, форма шага слева (Outlet), справа иллюстрация и подпись текущего шага. Логотип и «Закрыть ×» — из AuthLayout. Сброс черновика при закрытии подключит P6-01.
- `RegisterStep1Page.tsx` — Шаг 1: email и пароль — маршрут `/register/step-1`. OAuthButtons и StepCredentials подключены через публичные API; «Далее» ведёт на шаг 2 без сохранения
- `RegisterStep2Page.tsx` — Шаг 2 «Расскажите немного о себе» — маршрут `/register/step-2`. Форма — `StepProfile` из features/register
- `RegisterStep3Page.tsx` — Шаг 3 «Укажите, чем вы готовы поделиться» — маршрут `/register/step-3`. Форма — `StepSkill` из features/register

- `RegisterLayout.test.tsx` — маршруты всех шагов, редирект /register и переход «Далее»
- `RegisterLayout.stories.tsx` — рамка каждого шага; формы 2–3 обозначены как будущие задачи
