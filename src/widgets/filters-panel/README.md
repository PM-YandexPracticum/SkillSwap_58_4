# src/widgets/filters-panel

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Левая колонка «Фильтры» в каталоге и избранном.

**Текущее состояние:** FiltersPanel пока возвращает `null` в develop. Вёрстка P3-07 находится в Need fix (PR #148), связь с Redux — P5-02. Описания ниже задают целевую ответственность файлов.

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
