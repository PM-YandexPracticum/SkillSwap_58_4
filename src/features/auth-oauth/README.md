# src/features/auth-oauth

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Кнопки «Продолжить с Google / Apple» — заглушки, ничего не делают.

**Текущее состояние:** OAuthButtons свёрстан в P3-11 на общем Button с бренд-иконками и разделителем «или». По ТЗ кнопки остаются без действия и не отправляют форму.

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
