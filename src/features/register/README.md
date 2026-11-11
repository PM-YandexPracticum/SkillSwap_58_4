# src/features/register

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Регистрация из трёх шагов (маршруты — в `pages/register`): формы и черновик в store. По ТЗ после завершения регистрации пользователь всегда попадает в каталог. Возврат на исходную страницу относится только к входу (P4-09).

**Текущее состояние:** StepCredentials свёрстан в P3-11 на CredentialsForm и react-hook-form; передаёт email/пароль через onNext, принимает ошибку email через emailError. OAuthButtons добавляет страница. StepProfile свёрстан в P3-12 на компонентах UI-кита, StepSkill остаётся заготовкой P3-13; черновик, валидация и сохранение — P6-01…P6-06.

## Что внутри

- [`model/`](model/README.md) — типы, слайс, селекторы
- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
