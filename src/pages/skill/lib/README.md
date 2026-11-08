# src/pages/skill/lib

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **lib** страницы навыка — чистые функции.

## Что внутри

- `buildSkillPageData.ts` — собирает из ответов `entities/*/api` данные страницы: автор по `authorId`, названия города и категорий, «Хочет научиться», похожие пользователи (без пароля). В фазах 4–7 заменят селекторы
- `buildSkillPageData.test.ts` — тесты
