# src/entities/skill/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `skill` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `SkillInfo.tsx` — Блок описания навыка: заголовок, «Категория / Подкатегория», текст. Кнопки действий передаются через слот `actions`
- `SkillTag.tsx` — Чип навыка/подкатегории с цветом категории. Обёртка над shared/ui/Tag
