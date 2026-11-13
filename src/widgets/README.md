# src/widgets

> **SkillSwap** — платформа обмена навыками (только фронтенд: React + TypeScript + Redux Toolkit).
> Архитектура — Feature-Sliced Design, подробности в [docs/architecture/fsd.md](../../docs/architecture/fsd.md).

## Зачем эта папка

Слой **widgets** — крупные самостоятельные блоки интерфейса, собранные из features и entities (шапка, панель фильтров, карточка предложения).

Готовы Header, Footer, CategoriesList/CategoriesMenu, FiltersPanel, OfferCard, OffersSection, NotificationsPanel, OffersCarousel, ProfileSidebar и SkillDetails. Каталог и страница навыка уже получают данные; создание обмена подключено в P7-03. Сессия шапки, лайки, колокольчик и сохранение профиля остаются в P5-09/P5-07/P7-05/P7-06.

## Что внутри

- [`categories-menu/`](categories-menu/README.md) — «Все навыки»: общий CategoriesList и панель CategoriesMenu для слота Header и страницы `/skills` (P3-06)
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
