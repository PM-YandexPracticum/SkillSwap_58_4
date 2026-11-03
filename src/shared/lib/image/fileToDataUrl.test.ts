import { fileToDataUrl } from './fileToDataUrl'

/** Хелпер: минимальный File — функции хватает типа. */
function makeTinyPng(): File {
  return new File(['x'], 'tiny.png', { type: 'image/png' })
}

/**
 * Хелпер: в jsdom картинки не грузятся, поэтому подменяем Image фейком.
 * Как только код задаёт src, фейк сразу сообщает «загрузился» с нужными размерами.
 */
function mockImage(width: number, height: number) {
  vi.stubGlobal(
    'Image',
    class {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      width = width
      height = height

      set src(_value: string) {
        queueMicrotask(() => this.onload?.())
      }
    },
  )
}

/** Хелпер: подменяет canvas, чтобы не рисовать по-настоящему. */
function mockCanvas() {
  const context = { fillStyle: '', fillRect: vi.fn(), drawImage: vi.fn() }

  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as never)
  vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(
    'data:image/jpeg;base64,resized',
  )

  return context
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('fileToDataUrl', () => {
  it('не сжимает фото в пределах лимита', async () => {
    mockImage(400, 300)

    const url = await fileToDataUrl(makeTinyPng())

    expect(url.startsWith('data:image/png;base64,')).toBe(true)
  })

  it('сжимает большое фото в JPEG', async () => {
    mockImage(3000, 2000)
    const context = mockCanvas()

    const url = await fileToDataUrl(makeTinyPng())

    expect(url).toBe('data:image/jpeg;base64,resized')
    expect(context.drawImage).toHaveBeenCalledTimes(1)
  })

  it('возвращает оригинал, если canvas недоступен', async () => {
    mockImage(3000, 2000)
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)

    const url = await fileToDataUrl(makeTinyPng())

    expect(url.startsWith('data:image/png;base64,')).toBe(true)
  })
})
