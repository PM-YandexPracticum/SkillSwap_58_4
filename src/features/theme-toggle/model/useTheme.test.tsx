import { act, renderHook } from '@testing-library/react'

import { STORAGE_KEYS } from '@/shared/config'
import { useTheme } from './useTheme'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.style.removeProperty('color-scheme')
})

afterEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.style.removeProperty('color-scheme')
})

describe('useTheme', () => {
  it('переключает тему, сохраняет выбор и обновляет атрибут документа', () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')

    act(() => result.current.toggleTheme())

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem(STORAGE_KEYS.THEME)).toBe('dark')
  })

  it('восстанавливает сохранённую тему при новом подписчике', () => {
    localStorage.setItem(STORAGE_KEYS.THEME, 'dark')
    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('использует системную тему без сохранённого выбора', () => {
    const originalMatchMedia = window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockReturnValue({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    })

    try {
      const { result } = renderHook(() => useTheme())
      expect(result.current.theme).toBe('dark')
      expect(document.documentElement.dataset.theme).toBe('dark')
    } finally {
      Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        value: originalMatchMedia,
      })
    }
  })

  it('синхронизирует выбор темы из другой вкладки', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: STORAGE_KEYS.THEME,
          newValue: 'dark',
        }),
      )
    })

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
