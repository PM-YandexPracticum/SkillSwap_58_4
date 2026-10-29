export interface OffersSectionProps {
  title: string
  users: ReadonlyArray<import('@/entities/user').User>
  /** `expandable` — 3 ⇄ 9 по «Смотреть все»; `infinite` — догрузка по 6 при прокрутке */
  mode: 'expandable' | 'infinite'
}

/**
 * Секция каталога: заголовок, кнопка «Смотреть все →» и сетка OfferCard строго по 3 в ряд.
 * Два режима:
 * - `expandable` — «Популярное» и «Новое»: 3 карточки; «Смотреть все» раскрывает до 9 (ещё два ряда),
 *   секции ниже сдвигаются; повторный клик сворачивает обратно;
 * - `infinite` — «Рекомендуем», результаты фильтров, избранное: лента с догрузкой по 6 при прокрутке (useInfiniteScroll).
 * Карточки между секциями могут повторяться — это нормально.
 */
export function OffersSection(_props: OffersSectionProps) {
  // TODO: реализовать по макету
  return null
}
