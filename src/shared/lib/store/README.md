# src/shared/lib/store

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Типизированные `useAppDispatch` / `useAppSelector`. Использовать вместо хуков из react-redux.

## Что внутри

- `hooks.ts` — Типизированные хуки Redux. Всегда используй их вместо useDispatch/useSelector
- `index.ts` — публичный API — импортировать снаружи только отсюда
