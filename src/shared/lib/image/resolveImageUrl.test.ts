import { IMAGE_PLACEHOLDERS, resolveImageUrl } from './resolveImageUrl'

describe('resolveImageUrl', () => {
  it('возвращает заглушку, если фото нет', () => {
    expect(resolveImageUrl(null, 'AVATAR')).toBe(IMAGE_PLACEHOLDERS.AVATAR)
    expect(resolveImageUrl(undefined, 'AVATAR')).toBe(IMAGE_PLACEHOLDERS.AVATAR)
    expect(resolveImageUrl('', 'AVATAR')).toBe(IMAGE_PLACEHOLDERS.AVATAR)
    expect(resolveImageUrl(null, 'SKILL')).toBe(IMAGE_PLACEHOLDERS.SKILL)
  })

  it('добавляет BASE_URL к локальному пути', () => {
    expect(resolveImageUrl('/images/avatars/u01.jpg', 'AVATAR')).toBe(
      `${import.meta.env.BASE_URL}images/avatars/u01.jpg`,
    )
    expect(resolveImageUrl('/images/skills/s01-1.jpg', 'SKILL')).toBe(
      `${import.meta.env.BASE_URL}images/skills/s01-1.jpg`,
    )
  })

  it('возвращает data: без изменений', () => {
    const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA='
    expect(resolveImageUrl(dataUrl, 'AVATAR')).toBe(dataUrl)
  })

  it('возвращает blob: без изменений', () => {
    const blobUrl = 'blob:http://localhost/images/avatars/u01.jpg'
    expect(resolveImageUrl(blobUrl, 'AVATAR')).toBe(blobUrl)
  })

  it('возвращает внешний адрес без изменений', () => {
    const externalUrl = 'https://example.com/images/avatars/u01.jpg'
    expect(resolveImageUrl(externalUrl, 'AVATAR')).toBe(externalUrl)
  })
})

describe('изображения при публикации в подпути', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('добавляет base и к фото, и к пустому значению', () => {
    vi.stubEnv('BASE_URL', '/skillswap/')
    expect(resolveImageUrl('/images/team/t0.jpg', 'AVATAR')).toBe('/skillswap/images/team/t0.jpg')
    expect(resolveImageUrl(null, 'AVATAR')).toBe('/skillswap/images/avatars/placeholder.jpg')
    expect(resolveImageUrl('', 'SKILL')).toBe('/skillswap/images/skills/placeholder.jpg')
    expect(resolveImageUrl('https://example.com/photo.jpg', 'AVATAR')).toBe(
      'https://example.com/photo.jpg',
    )
  })
})
