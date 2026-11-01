import { fileToDataUrl } from './fileToDataUrl'

/**
 * Функция - хэлпер.
 * Минимальный File — для проверки функции хватает типа
 */
function makeTinyPng(): File {
  return new File(['x'], 'tiny.png', { type: 'image/png' })
}

describe('fileToDataUrl', () => {
  it('возвращает data URL картинки', async () => {
    const url = await fileToDataUrl(makeTinyPng())

    expect(url.startsWith('data:image/png;base64,')).toBe(true)
  })
})
