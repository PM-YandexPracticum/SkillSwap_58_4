import { STORAGE_KEYS } from '@/shared/config'

import { clearSession, loadSession, saveSession } from './sessionStorage'

describe('sessionStorage', () => {
  it('без сохранённой сессии — гость (null)', () => {
    expect(loadSession()).toBeNull()
  })

  it('saveSession сохраняет сессию, loadSession читает её после перезагрузки', () => {
    const saved = saveSession('u01')

    expect(saved).toEqual({ userId: 'u01', token: 'mock_token_u01' })
    expect(loadSession()).toEqual(saved)
  })

  it('clearSession стирает сессию', () => {
    saveSession('u01')

    clearSession()

    expect(loadSession()).toBeNull()
    expect(localStorage.getItem(STORAGE_KEYS.SESSION)).toBeNull()
  })

  it.each([
    ['повреждённый JSON', '{не json'],
    ['null', 'null'],
    ['массив', '[]'],
    ['нет token', '{"userId":"u01"}'],
    ['userId не строка', '{"userId":1,"token":"t"}'],
    ['пустой userId', '{"userId":"","token":"t"}'],
  ])('чужие данные в localStorage (%s) — гость, а не ошибка', (_case, raw) => {
    localStorage.setItem(STORAGE_KEYS.SESSION, raw)

    expect(loadSession()).toBeNull()
  })

  describe('localStorage недоступен (запрет сохранения данных в браузере)', () => {
    beforeEach(() => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError')
      })
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('SecurityError')
      })
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('SecurityError')
      })
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('loadSession — гость', () => {
      expect(loadSession()).toBeNull()
    })

    it('saveSession всё равно отдаёт сессию — вход работает до перезагрузки', () => {
      expect(saveSession('u01')).toEqual({ userId: 'u01', token: 'mock_token_u01' })
    })

    it('clearSession не падает', () => {
      expect(() => clearSession()).not.toThrow()
    })
  })
})
