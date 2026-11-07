# src/features/skill-search/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `skill-search` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `SearchInput.tsx` — поле «Искать навык» в шапке с лупой слева. Поиск запускается по Enter или клику на лупу (подпись «Искать»); когда в поле есть текст — справа крестик «×», он очищает поле. Пока без store: наружу отдаёт `onSearch` / `onClear`, запись в `searchSlice` и передачу обработчиков из Header подключаем в P5-03
- `SearchInput.module.css` — положение лупы и отступы поля
- `SearchInput.stories.tsx` — пустое поле, с текстом, очистка крестиком
- `SearchInput.test.tsx` — тесты поиска по Enter и по лупе, очистки и начального текста
