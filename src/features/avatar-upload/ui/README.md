# src/features/avatar-upload/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `avatar-upload` — React-компоненты. Получают данные пропсами или из store через селекторы.

**Текущее состояние:** `AvatarUpload` возвращает `null`. Вёрстка — P3-12, обработка файла — P6-04; общие утилиты проверки и сжатия уже готовы. Описания ниже задают целевую ответственность файлов.

## Что внутри

- `AvatarUpload.tsx` — аватар с выбором фото, два вида по макету: на шаге 2 регистрации — иконка `user-circle` 72 px с «+» (1:1497), в «Личных данных» — фото 244 px с кнопкой `gallery-edit` (1:2370). Файл проверяет `validateImageFile`, в data URL превращает `fileToDataUrl`
