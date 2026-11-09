# src/pages/register/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `register` — React-компоненты. Получают данные пропсами или из store через селекторы.

**Текущее состояние:** маршруты и AuthLayout подключены, страницы шагов пока заготовки. Вёрстка — P3-11…P3-13; guard и reducers — P6-01, завершение — P6-06. Описания ниже задают целевую ответственность файлов.

## Что внутри

- `RegisterLayout.tsx` — Общая часть трёх шагов регистрации: Stepper «Шаг N из 3» сверху, форма шага слева (Outlet), справа иллюстрация и подпись текущего шага. Логотип и «Закрыть ×» — из AuthLayout. «Закрыть ×» сбрасывает черновик регистрации.
- `RegisterStep1Page.tsx` — Шаг 1: email и пароль — маршрут `/register/step-1`. Форма — `StepCredentials` из features/register
- `RegisterStep2Page.tsx` — Шаг 2 «Расскажите немного о себе» — маршрут `/register/step-2`. Форма — `StepProfile` из features/register
- `RegisterStep3Page.tsx` — Шаг 3 «Укажите, чем вы готовы поделиться» — маршрут `/register/step-3`. Форма — `StepSkill` из features/register
