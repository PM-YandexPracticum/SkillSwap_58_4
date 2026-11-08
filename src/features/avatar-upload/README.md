# src/features/avatar-upload

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Загрузка и смена аватара (сохраняется как data URL).

**Текущее состояние:** `AvatarUpload` возвращает `null`. Вёрстка — P3-12, обработка файла — P6-04; общие утилиты проверки и сжатия уже готовы. Описания ниже задают целевую ответственность файлов.

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
