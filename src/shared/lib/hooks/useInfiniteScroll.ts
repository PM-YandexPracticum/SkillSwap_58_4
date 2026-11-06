import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

export interface UseInfiniteScrollResult<T> {
  /** Уже показанные элементы: первые N, где N растёт на batch. */
  visibleItems: T[]
  /** Ref на пустой div в конце списка. Догрузка требует прокрутки к маркеру. */
  sentinelRef: RefObject<HTMLDivElement>
  /** Показывать спиннер в течение delayMs. */
  isLoading: boolean
  /** Всё показано — sentinel и спиннер больше не нужны. */
  hasMore: boolean
}

interface ScrollIntent {
  current: { input: boolean; scrolled: boolean }
}

/** Отличает действие пользователя от автоматической коррекции scroll при смене списка. */
function listenForScrollInput(onScrollInput: () => void) {
  const inputEvents = ['wheel', 'touchmove', 'pointerdown', 'keydown'] as const
  const onInput = (event: Event) => {
    if (
      event instanceof KeyboardEvent &&
      !['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)
    )
      return
    onScrollInput()
  }
  inputEvents.forEach((type) =>
    window.addEventListener(type, onInput, { capture: true, passive: true }),
  )
  return () => inputEvents.forEach((type) => window.removeEventListener(type, onInput, true))
}

/** Следит за маркером; одного появления в viewport недостаточно для догрузки. */
function observeScroll(sentinel: HTMLDivElement, scrollIntent: ScrollIntent, onLoad: () => void) {
  let active = true
  let isIntersecting = false
  let requested = false

  const requestLoad = () => {
    if (!active || requested || !isIntersecting || !scrollIntent.current.scrolled) return
    // IntersectionObserver сообщает видимость асинхронно: при быстром scroll
    // последнее событие ещё может относиться к предыдущему кадру.
    const { top, bottom } = sentinel.getBoundingClientRect()
    if (bottom < 0 || top > window.innerHeight) return
    requested = true
    scrollIntent.current = { input: false, scrolled: false }
    onLoad()
  }
  const onScroll = (event: Event) => {
    const target = event.target
    if (
      target !== event.currentTarget &&
      target !== document &&
      !(target instanceof Element && target.contains(sentinel))
    ) {
      scrollIntent.current.input = false
      return
    }
    if (!active || requested || !scrollIntent.current.input) return
    scrollIntent.current.scrolled = true
    requestLoad()
  }
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === sentinel) isIntersecting = entry.isIntersecting
    }
    requestLoad()
  })
  observer.observe(sentinel)
  // scroll не всплывает: capture позволяет работать и внутри прокручиваемого контейнера.
  window.addEventListener('scroll', onScroll, true)
  const stopInput = listenForScrollInput(() => {
    scrollIntent.current.input = true
  })

  return () => {
    active = false
    observer.disconnect()
    window.removeEventListener('scroll', onScroll, true)
    stopInput()
  }
}

/**
 * Бесконечная лента: сначала batch элементов, при прокрутке к концу — спиннер
 * на delayMs и ещё batch элементов. Каждая порция требует новой прокрутки.
 * При смене items или batch лента начинается сначала, текущая догрузка отменяется.
 * items сравнивается по ссылке: производные списки нужно мемоизировать через useMemo.
 * @param items полный (уже отфильтрованный и отсортированный) список
 * @param batch положительный целый размер порции — CATALOG.SCROLL_BATCH (6)
 * @param delayMs задержка спиннера в мс — CATALOG.SCROLL_DELAY_MS (1000)
 */
export function useInfiniteScroll<T>(
  items: readonly T[],
  batch: number,
  delayMs: number,
): UseInfiniteScrollResult<T> {
  const [visibleCount, setVisibleCount] = useState(batch)
  const [isLoading, setIsLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const scrollIntent = useRef({ input: false, scrolled: false })
  const visibleItems = items.slice(0, visibleCount)
  const hasMore = visibleCount < items.length

  useEffect(() => {
    scrollIntent.current = { input: false, scrolled: false }
    setVisibleCount(batch)
    setIsLoading(false)
  }, [items, batch])

  // RefObject может получить другой DOM-узел без смены items/hasMore.
  // Переподключаем наблюдение после каждого commit, сохраняя публичный тип ref.
  useEffect(() => {
    if (!hasMore || isLoading || !sentinelRef.current) return
    return observeScroll(sentinelRef.current, scrollIntent, () => setIsLoading(true))
  })

  useEffect(() => {
    if (!isLoading) return
    const timerId = setTimeout(() => {
      setVisibleCount((count) => count + batch)
      setIsLoading(false)
    }, delayMs)
    return () => clearTimeout(timerId)
  }, [isLoading, items, batch, delayMs])

  return { visibleItems, sentinelRef, isLoading, hasMore }
}
