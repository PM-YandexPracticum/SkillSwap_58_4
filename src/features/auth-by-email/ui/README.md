# src/features/auth-by-email/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `auth-by-email` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `LoginForm.tsx` — форма входа: Email, Пароль (с глазом), кнопка «Войти», ссылка «Зарегистрироваться». Через `yupResolver(loginSchema)` проверяет поля и передаёт данные в `onSubmit`. Режим `onTouched` показывает ошибку после ухода с поля; `isValid` и `isSubmitting` управляют готовым `submitDisabled` у `CredentialsForm`. Общая ошибка приходит через `error` и подсвечивает оба поля; `onEdit` сообщает странице об изменении поля. Кнопки Google / Apple над формой ставит страница
- `LoginForm.stories.tsx` — пустая и заполненная форма (1:2400), неверные данные (1:2473)
- `LoginForm.test.tsx` — поля, валидность и доступность отправки, нормализация email, отправка по кнопке и Enter, общая ошибка и aria, порядок фокуса
