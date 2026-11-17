/// <reference types="node" />
import '@testing-library/jest-dom'

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { resetMockDb } from '@/shared/api'

const realFetch = globalThis.fetch

/**
 * В тестах нет dev-сервера, поэтому запросы «базы» к `/db/<коллекция>.json` читают файлы из `public/db` напрямую.
 * Остальные запросы идут как обычно. Чтобы проверить ошибку загрузки, подмените fetch в самом тесте: `vi.spyOn(globalThis, 'fetch')`.
 */
async function fetchFromPublicDb(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = input instanceof Request ? input.url : String(input)
  const file = url.match(/\/db\/([\w-]+\.json)$/)?.[1]
  if (!file) return realFetch(input, init)
  try {
    const body = await readFile(resolve(process.cwd(), 'public/db', file), 'utf8')
    return new Response(body, { headers: { 'Content-Type': 'application/json' } })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}

globalThis.fetch = fetchFromPublicDb

/**
 * В jsdom нет IntersectionObserver, а ленты каталога (P5-06) создают его, когда карточек больше порции.
 * Заглушка никогда не сообщает о видимости: лента остаётся на первой порции.
 * Чтобы проверить догрузку, подмените класс в самом тесте: `vi.stubGlobal('IntersectionObserver', ...)`.
 */
class IntersectionObserverStub {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

if (!('IntersectionObserver' in globalThis)) {
  globalThis.IntersectionObserver =
    IntersectionObserverStub as unknown as typeof IntersectionObserver
}

// После каждого теста — чистый браузер: изменения «базы», сессия и тема не переходят в следующий тест
afterEach(() => {
  localStorage.clear()
  resetMockDb()
})
