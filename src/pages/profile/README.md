# src/pages/profile

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Личный кабинет (`/profile/*`): раздел с формой — «Личные данные»; «Заявки», «Мои обмены», «Избранное», «Мои навыки» — заглушки.

**Текущее состояние:** вёрстка кабинета готова в P3-14 (PR #183). ProfilePage соединяет ProfileSidebar и Outlet; ProfilePersonal выводит ProfileForm и Avatar пользователя из store. Остальные разделы используют ProfileStub. Сохранение личных данных, смена пароля и выбор аватара — P7-06. RequireAuth на `/profile/*` уже готов.

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
