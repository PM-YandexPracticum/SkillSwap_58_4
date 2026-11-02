import { MOCK_DB } from '@/shared/config'

import { createMockCollection, resetMockDb } from './createMockCollection'

interface Item {
  id: string
  title: string
  tags: string[]
}

const SEED: readonly Item[] = [
  { id: 'a', title: 'Первый', tags: ['x'] },
  { id: 'b', title: 'Второй', tags: [] },
]

const KEY = `${MOCK_DB.STORAGE_PREFIX}items`

/** Коллекция без задержки — чтобы тесты не ждали */
const createItems = () => createMockCollection<Item>('items', SEED, { delayMs: 0 })

beforeEach(() => {
  localStorage.clear()
  resetMockDb()
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('createMockCollection', () => {
  describe('чтение', () => {
    it('без изменений отдаёт образцы и ничего не пишет в localStorage', async () => {
      const items = createItems()

      expect(await items.getAll()).toEqual(SEED)
      expect(localStorage.getItem(KEY)).toBeNull()
    })

    it('находит запись по id', async () => {
      const items = createItems()

      expect(await items.getById('b')).toEqual(SEED[1])
      expect(await items.getById('нет такого')).toBeUndefined()
    })

    it('отдаёт копии: изменение результата не меняет «базу» и образцы', async () => {
      const items = createItems()

      const first = await items.getAll()
      first[0].tags.push('изменено')
      first.pop()

      expect(await items.getAll()).toEqual(SEED)
      expect(SEED[0].tags).toEqual(['x'])
    })
  })

  describe('изменения', () => {
    it('create сохраняет запись, и она видна после «перезагрузки»', async () => {
      const item = { id: 'c', title: 'Третий', tags: [] }

      await createItems().create(item)
      const afterReload = createItems()

      expect(await afterReload.getById('c')).toEqual(item)
      expect(await afterReload.getAll()).toHaveLength(3)
    })

    it('create с занятым id — ошибка, данные не меняются', async () => {
      const items = createItems()

      await expect(items.create({ id: 'a', title: 'Дубль', tags: [] })).rejects.toThrow(
        'Запись с id «a» уже есть',
      )
      expect(await items.getAll()).toEqual(SEED)
    })

    it('update возвращает новую запись и не трогает прежнюю', async () => {
      const items = createItems()
      const before = await items.getById('a')

      const updated = await items.update('a', { title: 'Новое название' })

      expect(updated).toEqual({ id: 'a', title: 'Новое название', tags: ['x'] })
      expect(before?.title).toBe('Первый')
      expect((await createItems().getById('a'))?.title).toBe('Новое название')
    })

    it('update не меняет id, даже если его передали', async () => {
      const items = createItems()

      const updated = await items.update('a', { id: 'z' } as Partial<Item>)

      expect(updated.id).toBe('a')
      expect(await items.getById('z')).toBeUndefined()
    })

    it('update несуществующей записи — ошибка', async () => {
      await expect(createItems().update('нет такого', { title: '?' })).rejects.toThrow(
        'Запись с id «нет такого» не найдена',
      )
    })

    it('remove удаляет запись, повторное удаление не падает', async () => {
      const items = createItems()

      await items.remove('a')
      await items.remove('a')

      expect(await createItems().getAll()).toEqual([SEED[1]])
    })

    it('коллекции хранятся отдельно друг от друга', async () => {
      const other = createMockCollection<Item>('other', [], { delayMs: 0 })

      await other.create({ id: 'o', title: 'Другая', tags: [] })

      expect(await createItems().getAll()).toEqual(SEED)
    })
  })

  describe('повреждённые данные', () => {
    it.each([
      { case: 'не JSON', value: '{сломано' },
      { case: 'не массив', value: '{"id":"a"}' },
      { case: 'запись без id', value: '[{"title":"без id"}]' },
    ])('$case — отдаёт образцы и не падает', async ({ value }) => {
      localStorage.setItem(KEY, value)

      expect(await createItems().getAll()).toEqual(SEED)
    })

    it('если localStorage недоступен, работает в памяти до перезагрузки', async () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage отключён')
      })
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage отключён')
      })
      const items = createItems()

      await items.create({ id: 'c', title: 'Третий', tags: [] })

      expect(await items.getAll()).toHaveLength(3)
    })

    it('если место в localStorage кончилось — понятная ошибка, данные не меняются', async () => {
      const items = createItems()
      await items.getAll()
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('quota', 'QuotaExceededError')
      })

      await expect(items.create({ id: 'c', title: 'Большой', tags: [] })).rejects.toThrow(
        'Не хватает места',
      )
      expect(await items.getAll()).toEqual(SEED)
    })
  })

  describe('образцы из файла (загрузчик)', () => {
    /** Как loadSeed: образцы приходят асинхронно */
    const loader = () => vi.fn(async () => SEED)

    it('берёт образцы у загрузчика и не зовёт его, если изменения уже сохранены', async () => {
      const load = loader()
      const items = createMockCollection<Item>('items', load, { delayMs: 0 })

      expect(await items.getAll()).toEqual(SEED)
      await items.create({ id: 'c', title: 'Третий', tags: [] })
      load.mockClear()

      expect(await createMockCollection<Item>('items', load, { delayMs: 0 }).getAll()).toHaveLength(
        3,
      )
      expect(load).not.toHaveBeenCalled()
    })

    it('ошибка загрузки образцов приходит из метода коллекции', async () => {
      const items = createMockCollection<Item>(
        'items',
        async () => {
          throw new Error('Не удалось загрузить данные «items»')
        },
        { delayMs: 0 },
      )

      await expect(items.getAll()).rejects.toThrow('Не удалось загрузить данные «items»')
    })

    it('одновременные изменения не затирают друг друга', async () => {
      const items = createMockCollection<Item>('items', loader(), { delayMs: 0 })

      await Promise.all([
        items.create({ id: 'c', title: 'Третий', tags: [] }),
        items.create({ id: 'd', title: 'Четвёртый', tags: [] }),
        items.update('a', { title: 'Изменён' }),
      ])

      const all = await items.getAll()
      expect(all.map((item) => item.id)).toEqual(['a', 'b', 'c', 'd'])
      expect(all[0].title).toBe('Изменён')
    })
  })

  it('по умолчанию отвечает с задержкой MOCK_DB.DELAY_MS, как сервер', async () => {
    vi.useFakeTimers()
    const items = createMockCollection<Item>('items', SEED)
    const onDone = vi.fn()

    void items.getAll().then(onDone)
    await vi.advanceTimersByTimeAsync(MOCK_DB.DELAY_MS - 1)
    expect(onDone).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    expect(onDone).toHaveBeenCalledWith(SEED)
  })
})

describe('resetMockDb', () => {
  it('стирает изменения всех коллекций и не трогает чужие ключи', async () => {
    localStorage.setItem('skillswap_session', 'сессия')
    await createItems().create({ id: 'c', title: 'Третий', tags: [] })

    resetMockDb()

    expect(await createItems().getAll()).toEqual(SEED)
    expect(localStorage.getItem(KEY)).toBeNull()
    expect(localStorage.getItem('skillswap_session')).toBe('сессия')
  })

  it('стирает и изменения в памяти, если localStorage недоступен', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage отключён')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('localStorage отключён')
    })
    await createItems().create({ id: 'c', title: 'Третий', tags: [] })

    resetMockDb()

    expect(await createItems().getAll()).toEqual(SEED)
  })
})
