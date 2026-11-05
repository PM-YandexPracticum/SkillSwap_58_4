# src/shared/lib

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../../docs/architecture/fsd.md).

## Зачем эта папка

Утилиты общего назначения: форматирование, склонение, хуки, типизированные Redux-хуки.

## Что внутри

- [`hooks/`](hooks/README.md) — Универсальные React-хуки: задержка, localStorage, клик вне элемента, лента с догрузкой
- [`image/`](image/README.md) — Картинки: адрес для `<img src>` из значения в данных (`resolveImageUrl`: путь, data URL или заглушка) и превращение выбранного файла в data URL (`fileToDataUrl`)
- [`store/`](store/README.md) — Типизированные `useAppDispatch` / `useAppSelector`
- [`toast/`](toast/README.md) — контекст уведомлений и хук `useToast`
- [`validation/`](validation/README.md) — Общие правила валидации: готовые yup-поля (email, пароль, имя, дата рождения, текст, город) и проверка картинок
- `helpers.ts` — formatDate, truncate, generateId
- `pluralize.ts` — Склоняет русское слово по числу
- `shuffle.ts` — Перемешивает массив в случайном порядке (Фишер — Йетс) и возвращает НОВЫЙ массив. Нужен для «Рекомендуем»: рекомендаций без сервера нет, поэтому показываем всех в случайном порядке. Перемешивать один раз при загрузке, а не на каждый рендер, — иначе карточки будут прыгать
