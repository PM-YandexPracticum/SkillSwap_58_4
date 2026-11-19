# src/features/theme-toggle/model

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **model** слайса `theme-toggle` — общий источник выбора темы и React-хук для подписки на него.

## Что внутри

- `useTheme.ts` — публичный хук темы; общий источник находится в `shared/lib/theme`, чтобы провайдер и кнопка не имели раздельного состояния
