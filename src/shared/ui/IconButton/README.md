# src/shared/ui/IconButton

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **IconButton**. Квадратная кнопка-иконка: лайк, тема, колокольчик, поделиться, «Закрыть».

## Что внутри

- `IconButton.module.css` — стили: размер 24×24, фокус
- `IconButton.stories.tsx` — stories: Like, Liked, Notification, Close
- `IconButton.test.tsx` — тесты: клик, поиск по aria-label
- `IconButton.tsx` — квадратная кнопка-иконка: лайк, тема, колокольчик, поделиться, «Закрыть». Подпись для скринридера обязательна
- `index.ts` — публичный API — импортировать снаружи только отсюда
