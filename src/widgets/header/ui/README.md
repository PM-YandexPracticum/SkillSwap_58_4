# src/widgets/header/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `header` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `Header.tsx` — выбирает вид через `selectIsAuth`, имя и аватар читает из `selectCurrentUser`. Загружает уведомления при первом открытии вошедшим пользователем, точку определяет `selectHasUnread`. Меню пользователя содержит ссылку на личный кабинет и `LogoutButton`.
- `Header.module.css` — стили шапки.
- `Header.stories.tsx` — Guest, Authorized, AuthorizedWithUnread, MenuOpen и примеры слотов. Вид задаётся состоянием Redux.
- `Header.test.tsx` — сессия, обновление имени и аватара, собственные уведомления, ссылки и меню с клавиатуры.

В P3-06 `MainLayout` подключает готовый `CategoriesMenu`. Панель ограничена высотой окна;
область прокрутки доступна по Tab, Escape закрывает её и возвращает фокус на «Все навыки».
Интеграция меню, клавиатура и переход из Footer на `/skills` проверяются в `MainLayout.test.tsx`.
