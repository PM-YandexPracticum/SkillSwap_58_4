# src/pages/register/lib

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **lib** страницы регистрации — чистые функции.

## Что внутри

- `buildSkillPreview.ts` — чисто собирает данные окна «Ваше предложение» (шаг 3): название, описание и названия категории и подкатегории из значений формы и справочника категорий
- `buildSkillPreview.test.ts` — тесты
