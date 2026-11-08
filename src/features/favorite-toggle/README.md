# src/features/favorite-toggle

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Лайк: сердечко со счётчиком. Меняет `likedUserIds` текущего пользователя и `likesCount` того, кого лайкнули.

**Текущее состояние:** сердечко со счётчиком готово как UI (P3-08), клик ничего не меняет. `toggleFavorite()` пока бросает `Not implemented`; сохранение и авторизация — P5-07. Описания ниже задают целевую ответственность файлов.

## Что внутри

- [`model/`](model/README.md) — типы, слайс, селекторы
- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
