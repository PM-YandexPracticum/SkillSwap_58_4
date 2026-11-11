# src/shared/ui/Avatar

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

UI-компонент **Avatar**. Круглый аватар пользователя с заглушкой вместо отсутствующего фото.

## Что внутри

- `Avatar.module.css` — Стили. Размеры — локальные переменные `--avatar-size`: `sm` 48px, `md` 100px, `lg` 244px
- `Avatar.stories.tsx` — Stories компонента: `Default` (`md`), `Small` (`sm`), `Large` (`lg`), `NoPhoto` (заглушка без фото)
- `Avatar.test.tsx` — Тесты: с фото и с заглушкой
- `Avatar.tsx` — Круглый аватар пользователя. Без фото показывается заглушка `IMAGE_PLACEHOLDERS.AVATAR`; путь к локальному изображению дополняется `BASE_URL` через `resolveImageUrl`
- `index.ts` — публичный API — импортировать снаружи только отсюда

`className` позволяет задать геометрию аватара внутри составного компонента, например AvatarUpload. Обработка пути и изображения остаётся общей.

## Размеры

| Размер | Где | Figma |
|---|---|---|
| `sm` | Шапка | 1:2996 |
| `md` | Карточка каталога (по умолчанию) | 1:2861 |
| `lg` | Профиль | 1:2370 |
