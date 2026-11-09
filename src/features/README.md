# src/features

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../docs/architecture/fsd.md).

## Зачем эта папка

Слой **features** — действия пользователя, которые несут бизнес-ценность: войти, отфильтровать, лайкнуть, предложить обмен.

В списке указана ответственность слайсов. Сейчас готовы ядро catalog-filter, вёрстка групп фильтров (P3-07), поиск skill-search, LoginForm, OAuthButtons и StepCredentials (P3-11), вид FavoriteButton и кнопка MarkAllReadButton. Остальные UI и сценарии частично или полностью заготовлены; состояние и задачи указаны в README каждого слайса.

## Что внутри

- [`auth-by-email/`](auth-by-email/README.md) — Вход по email и паролю: форма, схема валидации, проверка учётных данных
- [`auth-oauth/`](auth-oauth/README.md) — Кнопки «Продолжить с Google / Apple» — заглушки, ничего не делают
- [`avatar-upload/`](avatar-upload/README.md) — Загрузка и смена аватара (сохраняется как data URL)
- [`catalog-filter/`](catalog-filter/README.md) — Фильтры каталога: «Всё / Хочу научиться / Могу научить», навыки, пол автора, город, сортировка, плашки выбранного
- [`exchange-propose/`](exchange-propose/README.md) — «Предложить обмен»: создаёт обмен и уведомление, показывает окно «Вы предложили обмен»
- [`favorite-toggle/`](favorite-toggle/README.md) — Лайк: сердечко со счётчиком
- [`logout/`](logout/README.md) — Выход из аккаунта
- [`notifications-read/`](notifications-read/README.md) — «Прочитать все»: новые уведомления уходят в просмотренные
- [`profile-edit/`](profile-edit/README.md) — Редактирование личных данных в профиле
- [`register/`](register/README.md) — Регистрация из трёх шагов (маршруты — в `pages/register`): формы шагов и черновик в store; после завершения — каталог
- [`skill-create/`](skill-create/README.md) — Навык, которому пользователь может научить: форма (шаг 3), превью «Ваше предложение», окно «Ваше предложение создано»
- [`skill-search/`](skill-search/README.md) — Поиск из поля «Искать навык» в шапке: запуск по Enter или клику на лупу, «×» очищает
- [`theme-toggle/`](theme-toggle/README.md) — Переключение светлой / тёмной темы — необязательная фича (фаза 9)

## Правило импортов

Фича импортирует entities и shared. Другие фичи — нельзя (исключения согласуем с тимлидом).
