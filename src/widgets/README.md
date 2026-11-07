# src/widgets

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../docs/architecture/fsd.md).

## Зачем эта папка

Слой **widgets** — крупные самостоятельные блоки интерфейса, собранные из features и entities (шапка, панель фильтров, карточка предложения).

## Что внутри

- [`categories-menu/`](categories-menu/README.md) — «Все навыки»: статичный список категорий (`CategoriesList`) и выпадающее меню в шапке (`CategoriesMenu`)
- [`filters-panel/`](filters-panel/README.md) — Левая колонка «Фильтры» в каталоге и избранном
- [`footer/`](footer/README.md) — Подвал: рабочие ссылки «О проекте» и «Все навыки», остальные («Контакты», «Блог», политики) — заглушки
- [`header/`](header/README.md) — Шапка сайта: логотип, навигация, поиск, тема, уведомления, вход / меню пользователя
- [`notifications-panel/`](notifications-panel/README.md) — Окно колокольчика: «Вы предложили обмен …» → «Перейти», «Прочитать все»
- [`offer-card/`](offer-card/README.md) — Карточка предложения в каталоге: пользователь + лайк + «Подробнее» или статичный статус «Обмен предложен»
- [`offers-carousel/`](offers-carousel/README.md) — Карусель «Похожие предложения» на странице навыка
- [`offers-section/`](offers-section/README.md) — Секция каталога: заголовок и сетка по 3 в ряд
- [`profile-sidebar/`](profile-sidebar/README.md) — Боковое меню личного кабинета
- [`skill-details/`](skill-details/README.md) — Верхний блок страницы навыка: автор, описание, галерея, действия

## Правило импортов

Виджет импортирует features, entities, shared. Другие виджеты — нельзя.
