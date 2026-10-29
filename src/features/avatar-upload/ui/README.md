# src/features/avatar-upload/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `avatar-upload` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `AvatarUpload.tsx` — Большой круглый аватар с кнопкой-иконкой смены фото. Файл проверяется `validateImageFile` (jpg/png/webp, до 1 МБ), превью — через `URL.createObjectURL`, картинка — через `resolveImageUrl`
