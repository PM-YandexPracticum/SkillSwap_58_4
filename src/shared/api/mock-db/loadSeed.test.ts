import { loadSeed } from './loadSeed'

/** Ответ fetch с JSON — как от dev-сервера Vite */
const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

describe('loadSeed', () => {
  it('загружает образцы коллекции из public/db', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse([{ id: 'a' }]))

    expect(await loadSeed('ok')()).toEqual([{ id: 'a' }])
    expect(fetchSpy).toHaveBeenCalledWith(`${import.meta.env.BASE_URL}db/ok.json`)
  })

  it('загружает файл один раз, даже если коллекцию спросили несколько раз', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse([{ id: 'a' }]))
    const load = loadSeed('once')

    await Promise.all([load(), load(), loadSeed('once')()])

    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('если файла нет — понятная ошибка, а следующая попытка загружает заново', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({}, 404))
      .mockResolvedValueOnce(jsonResponse([{ id: 'a' }]))
    const load = loadSeed('missing')

    await expect(load()).rejects.toThrow('Не удалось загрузить данные «missing»')
    expect(await load()).toEqual([{ id: 'a' }])
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })

  it('если в файле не список записей — понятная ошибка', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ id: 'a' }))

    await expect(loadSeed('broken')()).rejects.toThrow('Не удалось загрузить данные «broken»')
  })

  it('если вместо JSON пришла HTML-страница — понятная ошибка', async () => {
    // так отвечает dev-сервер Vite на несуществующий файл: index.html со статусом 200
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('<!doctype html><html></html>', { headers: { 'Content-Type': 'text/html' } }),
    )

    await expect(loadSeed('html')()).rejects.toThrow('Не удалось загрузить данные «html»')
  })

  it('если сеть недоступна — понятная ошибка', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(loadSeed('offline')()).rejects.toThrow('Не удалось загрузить данные «offline»')
  })
})

it('после ошибки структуры seed повторяет загрузку исправленного файла', async () => {
  const validate = (value: unknown): value is { id: string; title: string } =>
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'title' in value &&
    typeof value.title === 'string'
  const fetchSpy = vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValueOnce(jsonResponse([{ id: 'a' }]))
    .mockResolvedValueOnce(jsonResponse([{ id: 'a', title: 'Исправлено' }]))
  const load = loadSeed('invalid-record-shape', validate)
  await expect(load()).rejects.toThrow('Не удалось загрузить данные')
  expect(await load()).toEqual([{ id: 'a', title: 'Исправлено' }])
  expect(fetchSpy).toHaveBeenCalledTimes(2)
})
