import type { RefObject } from 'react'
import { useState, useEffect, useRef } from 'react'

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
 * `items` сравнивается по ссылке — потребитель должен мемоизировать его через `useMemo`,
 * иначе лента будет сбрасываться на каждом ре-рендере родителя.
 * @param items полный (уже отфильтрованный и отсортированный) список
 * @param batch сколько добавлять за раз — `CATALOG.SCROLL_BATCH` (6)
 * @param delayMs сколько показывать спиннер — `CATALOG.SCROLL_DELAY_MS`
 */
export function useInfiniteScroll<T>(
  items: readonly T[],
  batch: number,
  delayMs: number,
): UseInfiniteScrollResult<T> {
  // количестао карточек, начальное состояние сначала отображаются 6 каррточек
  const [visibleCount, setVisibleCount] = useState(batch)
  // состояние загрузки
  const [isLoading, setIsLoading] = useState(false)
  // Сброс ленты при смене набора данных (сравнение `items` по ссылке).
  useEffect(() => {
    setVisibleCount(batch)
    setIsLoading(false)
  }, [items, batch])
  // массив карточек которые будут отображаться
  const visibleItems = items.slice(0, visibleCount)
  //отображаем столько карточек сколько нам передали, если
  const hasMore = visibleCount < items.length
  //маркер за которым наблюдает обсервкр
  const sentinelRef = useRef<HTMLDivElement>(null)

  // observer
  useEffect(() => {
    // не создаем наблюдателя если загрузка уже идет
    if (!hasMore || isLoading) return
    const el = sentinelRef.current
    // выходим, если маркера в DOM еще/уже нет
    if (!el) return
    const observer = new IntersectionObserver((entries) => {
      // проверяем наличие первой записи
      if (entries[0]?.isIntersecting && hasMore && !isLoading) {
        setIsLoading(true)
      }
    })
    // наблюдаем за маркером
    observer.observe(el)

    // отключаем обсервер
    return () => {
      observer.disconnect()
    }
  }, [hasMore, isLoading])

  // isLoading — таймер, добавляющий следующую порцию карточек
  useEffect(() => {
    if (!isLoading) return

    const timerId = setTimeout(() => {
      // прибавляет к карточкам 6 штук
      setVisibleCount((prev) => prev + batch)
      setIsLoading(false)
    }, delayMs)

    return () => {
      clearTimeout(timerId)
    }
  }, [isLoading, batch, delayMs])

  return { visibleItems, sentinelRef, isLoading, hasMore }
}
