# src/pages/about/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `about` — React-компоненты. Получают данные пропсами или из store через селекторы.

**Текущее состояние:** `AboutPage` готова: заголовок и сетка карточек команды из `config/team.ts`.
Участники добавляют себя в P8-02 (общая issue остаётся открытой), фото — в `public/images/team/`.

## Что внутри

- `AboutPage.tsx` — «О проекте» (`/about`): сетка карточек участников — фото или инициал, имя, роль, «Обо мне», ссылка на GitHub. Данные — `members` (по умолчанию `TEAM` из `config/team.ts`); пропс нужен для тестов и story, где участников несколько.
- `AboutPage.module.css` — стили страницы: контейнер `calc(var(--container-width) + var(--space-36) * 2)`, карточки `max-width: 672px`, сетка `auto-fit`, gap 24px, боковые отступы 36px (Figma `1:3249`).
- `AboutPage.test.tsx` — тесты: заголовок `h1`, имя/роль/«Обо мне», GitHub в новой вкладке (`target` + `rel`), аватар с фото и без (доступное имя, инициал).
- `AboutPage.stories.tsx` — Storybook: `Default`, `TwoMembers`, `ThreeMembers`, `WithoutPhoto`, `LongGithubUrl`, `LongAbout`, `Empty`. Контейнер 1440px (ширина макета), ссылка на фрейм — `parameters.design`.

## Креативные решения

- **Аватар-заглушка.** В макете нет состояния «без фото» — добавлено для P8-02: инициал из имени (`getInitial`), `role="img"` + `aria-label` для скринридера. Цвет — `--color-accent-soft`, `border-radius: var(--radius-l)`.

Путь к фото проходит через общий `resolveImageUrl`, включая сборку с base path.
ID тестовых участников фиксированные и различаются внутри одной stories-сетки.
