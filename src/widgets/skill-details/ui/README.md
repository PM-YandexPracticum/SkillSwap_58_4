# src/widgets/skill-details/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `skill-details` — React-компоненты. Получают данные пропсами или из store через селекторы.

**Текущее состояние:** SkillDetails пока возвращает `null` (P3-09). UserProfileCard, SkillInfo и Carousel уже готовы, их нужно собрать; загрузка данных — P7-01. Описания ниже задают целевую ответственность файлов.

## Что внутри

- `SkillDetails.tsx` — Верх страницы навыка: UserProfileCard автора (с «О себе», если заполнено в профиле) + SkillInfo + галерея на Carousel. Справа сверху: лайк (FavoriteButton: пока только вид со счётчиком, действие подключит P5-07), «поделиться» и «⋯» — заглушки, ничего не делают
