# src/features/exchange-propose/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `exchange-propose` — React-компоненты. Получают данные пропсами или из store через селекторы.

## Что внутри

- `ProposeExchangeButton.stories.tsx`, `ProposeExchangeButton.test.tsx`, `ExchangeProposedModal.stories.tsx`, `ExchangeProposedModal.test.tsx`, `ExchangeProposedModal.module.css` — stories, тесты и стили
- `ExchangeProposedModal.tsx` — Окно после «Предложить обмен»: иконка колокольчика, «Вы предложили обмен», «Теперь дождитесь подтверждения. Вам придёт уведомление», кнопка «Готово»
- `ProposeExchangeButton.tsx` — Кнопка «Предложить обмен» на странице навыка. Гость → вход с возвратом; вошедший — обмен, уведомление, toast и окно «Вы предложили обмен»
