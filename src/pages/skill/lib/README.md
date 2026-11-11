# src/pages/skill/lib

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **lib** страницы навыка — чистые функции.

## Что внутри

- `buildSkillPageData.ts` — чисто собирает из уже выбранных данных Redux пропсы `SkillDetails`: навык, автора, названия города и категорий, «Хочет научиться». Похожие предложения отдельно выбирает `selectSimilarUsers` из `@/entities/user`
- `buildSkillPageData.test.ts` — тесты
