import type { RefObject } from 'react'

export interface UseInfiniteScrollResult<T> {
  /** Уже показанные элементы: первые N, где N растёт по CATALOG.SCROLL_BATCH */
  visibleItems: T[]
  /** Ref на пустой div в конце списка — когда он доходит до экрана, догружаем следующую порцию */
  sentinelRef: RefObject<HTMLDivElement>
  /** Показывать спиннер (имитация загрузки CATALOG.SCROLL_DELAY_MS) */
  isLoading: boolean
  /** Всё показано — sentinel и спиннер больше не нужны */
  hasMore: boolean
}

/**
 * «Пагинация» в понимании наставника — бесконечная лента: сначала видно `batch` элементов, при прокрутке к концу
 * на `delayMs` появляется спиннер и добавляется ещё `batch`. Догрузка — только по мере прокрутки пользователя.
 * Используется в «Рекомендуем», в результатах фильтров/поиска и в избранном.
 * При смене `items` (новые фильтры) лента начинается сначала.
 * @param items полный (уже отфильтрованный и отсортированный) список
 * @param batch сколько добавлять за раз — `CATALOG.SCROLL_BATCH` (6)
 * @param delayMs сколько показывать спиннер — `CATALOG.SCROLL_DELAY_MS`
 */
export function useInfiniteScroll<T>(
  _items: readonly T[],
  _batch: number,
  _delayMs: number,
): UseInfiniteScrollResult<T> {
  // TODO: IntersectionObserver на sentinelRef + setTimeout; unit-тест через renderHook
  throw new Error('Not implemented: useInfiniteScroll')
}
