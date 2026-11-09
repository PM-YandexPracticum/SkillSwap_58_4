# AuthPageLayout

Общая область `main` входа и регистрации: заголовок, левая карточка формы и правая иллюстрация.
Логотип и «Закрыть» предоставляет внешний `app/layouts/AuthLayout`.

- `AuthPageLayout.tsx` — компонент и `AuthPageLayoutProps`; импорт через `index.ts`.
- `AuthPageLayout.module.css` — две колонки с зазором 24 px, высота 692 px; при ширине до 900 px — одна колонка.
- `AuthPageLayout.test.tsx` — доступное название страницы, содержимое и индикатор шагов.
- `AuthPageLayout.stories.tsx` — вход и регистрация со Stepper.

`title` задаёт единственный `h1`. Если передан `progress`, заголовок скрыт только визуально,
а на экране показывается индикатор. `children` — содержимое левой карточки, `illustration` — правой.
Компонент не зависит от роутера, store и фич.

Figma: [вход 1:2400](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2400),
[регистрация 1:2548](https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2548).
