# src/features/exchange-propose/ui

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../../docs/architecture/fsd.md).

## Зачем эта папка

Сегмент **ui** слайса `exchange-propose` — React-компоненты. Получают данные пропсами или из store через селекторы.

**Текущее состояние:** кнопка и окно рендерят состояния из макета и получают обработчики пропсами.
Сценарий P7-03 подключён на странице навыка: сохранение обмена и уведомления выполняется через
операции сущностей, toast и окно показываются после успешной записи, а во время записи кнопка заблокирована.

## Что внутри

- `ProposeExchangeButton.stories.tsx`, `ProposeExchangeButton.test.tsx`, `ExchangeProposedModal.stories.tsx`, `ExchangeProposedModal.test.tsx`, `ExchangeProposedModal.module.css` — stories, тесты и стили
- `ExchangeProposedModal.tsx` — Окно после «Предложить обмен»: иконка колокольчика, «Вы предложили обмен», «Теперь дождитесь подтверждения. Вам придёт уведомление», кнопка «Готово»
- `ProposeExchangeButton.tsx` — Два состояния кнопки и временная блокировка через `disabled`. Состояние и обработчик передаёт `useProposeExchange` через страницу и SkillDetails; сама кнопка не читает store и не выполняет переходы
