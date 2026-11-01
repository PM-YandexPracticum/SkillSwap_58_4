import { validateImageFile } from './validateImageFile'
import { VALIDATION } from '../../config/validation'

/**
 * Функция - хэлпер.
 * Собирает File нужного типа и размера — содержимое для проверки не важно.
 * `File(куски содержимого[], имя, { тип })` — размер File считается сам, из содержимого.
 */
function makeFile(type: string, sizeBytes: number): File {
  // 'x'.repeat(sizeBytes) — строка ровно нужной длины: латинская 'x' в UTF-8 занимает 1 байт,
  // поэтому длина строки = размер файла в байтах. У File размер не задаётся свойством — он считается по содержимому.
  return new File(['x'.repeat(sizeBytes)], 'photo.png', { type })
}

describe('validateImageFile', () => {
  it('пропускает png', () => {
    expect(validateImageFile(makeFile('image/png', 1024))).toBeNull()
  })

  it('пропускает webp', () => {
    expect(validateImageFile(makeFile('image/webp', 1024))).toBeNull()
  })

  it('отклоняет pdf', () => {
    expect(validateImageFile(makeFile('application/pdf', 1024))).toBe('Только JPG, PNG или WEBP')
  })

  it('пропускает файл ровно 1 МБ', () => {
    expect(validateImageFile(makeFile('image/jpeg', VALIDATION.IMAGE.MAX_SIZE_BYTES))).toBeNull()
  })

  it('отклоняет файл больше 1 МБ на 1 байт', () => {
    expect(validateImageFile(makeFile('image/png', VALIDATION.IMAGE.MAX_SIZE_BYTES + 1))).toBe(
      'Файл больше 1 МБ',
    )
  })

  it('сначала проверяет тип, потом размер', () => {
    expect(
      validateImageFile(makeFile('application/pdf', VALIDATION.IMAGE.MAX_SIZE_BYTES + 1)),
    ).toBe('Только JPG, PNG или WEBP')
  })
})
