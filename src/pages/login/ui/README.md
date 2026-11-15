# src/pages/login/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `login` — React-компоненты. Получают данные пропсами или из store через селекторы.

После успешного входа страница возвращает пользователя на внутренний адрес из `location.state.from` вместе с query и hash. При прямом входе открывает каталог.

## Что внутри

- `LoginPage.tsx` — Вход (`/login`) — отдельный маршрут, не модалка. Слева LoginForm (Google/Apple — заглушки), справа иллюстрация «С возвращением в SkillSwap!». «Закрыть ×» — шаг назад по истории. Бизнес-логика входа пока не подключена

- `LoginPage.test.tsx` — состав страницы и переход к регистрации
- `LoginPage.stories.tsx` — страница по фрейму 1:2400
