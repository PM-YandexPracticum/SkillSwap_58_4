# src/widgets/skill-details

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Верхний блок страницы навыка: автор, описание, галерея, действия.

**Текущее состояние:** SkillDetails пока возвращает `null` (P3-09). UserProfileCard, SkillInfo и Carousel уже готовы, их нужно собрать; загрузка данных — P7-01. Описания ниже задают целевую ответственность файлов.

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
