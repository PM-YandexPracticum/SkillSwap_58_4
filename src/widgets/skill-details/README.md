# src/widgets/skill-details

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Верхний блок страницы навыка: автор, описание, галерея, действия.

**Текущее состояние:** SkillDetails собирает UserProfileCard и SkillInfo, передавая им готовые данные и слоты действий. Виджет не загружает данные и не знает о Redux; сборка данных выполняется страницей навыка (P7-01).

## Что внутри

- [`ui/`](ui/README.md) — React-компоненты
- `index.ts` — публичный API — импортировать снаружи только отсюда
