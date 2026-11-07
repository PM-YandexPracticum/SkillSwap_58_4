# src/shared/ui/PasswordInput

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **PasswordInput**. Поле пароля с кнопкой «глаз» для показа/скрытия. Подсказка передаётся пропом `hint` (например, «Пароль должен содержать не менее 8 знаков»); при ошибке она скрывается. Правила проверки пароля задаёт форма.

## Что внутри

- `PasswordInput.tsx` — компонент: `Input` с кнопкой-«глазом» (`IconButton`, иконки `eye` / `eye-off`) и подсказкой `hint` под полем. При `error` вместо подсказки показывается ошибка. Ref передаётся на `<input>`, поэтому работает с `react-hook-form`. Пропс `disabled` блокирует поле и скрывает кнопку глаза.
- `PasswordInput.module.css` — стили подсказки и размер иконки глаза
- `PasswordInput.stories.tsx` — состояния из макета: скрыт, с подсказкой, показан, ошибка, disabled
- `PasswordInput.test.tsx` — тесты: переключение, клавиатура, подсказка/ошибка, aria, ref, react-hook-form, disabled
- `index.ts` — публичный API — импортировать снаружи только отсюда

## Макеты

- [Вход](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2400)
- [Регистрация, подсказка](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2548)
- [Регистрация, ошибка](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2627)
