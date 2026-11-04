import { renderHook } from '@testing-library/react'
import { useToast } from './useToast'

describe('useToast', () => {
  it('объясняет ошибку вызова вне провайдера', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      expect(() => renderHook(() => useToast())).toThrow(
        'useToast должен вызываться внутри <ToastProvider>',
      )
    } finally {
      consoleError.mockRestore()
    }
  })
})
