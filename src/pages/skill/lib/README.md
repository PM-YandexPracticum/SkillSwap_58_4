# src/pages/skill/lib

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **lib** страницы навыка — чистые функции.

## Что внутри

- `buildSkillPageData.ts` — чисто собирает из уже выбранных данных Redux страницу: названия города и категорий, «Хочет научиться» и временный список похожих пользователей. Отбор похожих предложений будет вынесен в селектор P7-02
- `buildSkillPageData.test.ts` — тесты
