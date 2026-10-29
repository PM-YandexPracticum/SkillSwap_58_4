# src/app/store

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Redux store: конфигурация, корневой редьюсер и глобальные типы `RootState` / `AppDispatch`.

## Что внутри

- `index.ts` — публичный API — импортировать снаружи только отсюда
- `rootReducer.ts` — Корневой редьюсер. Новый слайс = одна строка здесь
