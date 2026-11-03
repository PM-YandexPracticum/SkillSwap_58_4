# src/entities/skill/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `skill` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `SkillInfo.tsx` — Блок описания навыка: заголовок, «Категория / Подкатегория», текст. Кнопки действий передаются через слот `actions`
- `SkillTag.tsx` — чип навыка или подкатегории в цвете своей категории: `title` и `categoryId`. Обёртка над `shared/ui/Tag`
- `SkillTag.test.tsx` — тесты: цвет категории, незнакомая категория
