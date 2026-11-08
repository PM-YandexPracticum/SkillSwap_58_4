# src/features/auth-oauth

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Кнопки «Продолжить с Google / Apple» — заглушки, ничего не делают.

**Текущее состояние:** кнопки ещё не свёрстаны (`OAuthButtons` возвращает `null`, P3-11). По ТЗ после вёрстки они останутся без действия. Описания ниже задают целевую ответственность файлов.

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
