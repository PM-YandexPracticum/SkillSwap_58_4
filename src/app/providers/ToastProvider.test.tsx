import { StrictMode } from 'react'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useToast } from '@/shared/lib/toast'
import { ToastProvider } from './ToastProvider'

function Example() {
  const { showToast } = useToast()
  return (
    <>
      <button onClick={() => showToast('Вы предложили обмен Ивану')}>Иван</button>
      <button onClick={() => showToast('Вы предложили обмен Анне')}>Анна</button>
    </>
  )
}

function renderExample() {
  return render(
    <StrictMode>
      <ToastProvider>
        <Example />
      </ToastProvider>
    </StrictMode>,
  )
}

describe('ToastProvider', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('заранее создаёт область объявлений и показывает в ней сообщение через хук', () => {
    renderExample()
    const notifications = screen.getByRole('log', { name: 'Уведомления' })
    expect(notifications).toHaveAttribute('aria-live', 'polite')
    expect(notifications).toBeEmptyDOMElement()

    fireEvent.click(screen.getByRole('button', { name: 'Иван' }))

    expect(within(notifications).getByText('Вы предложили обмен Ивану')).toBeInTheDocument()
  })

  it('показывает сообщение 3999 мс и удаляет на 4000-й миллисекунде', () => {
    vi.useFakeTimers()
    renderExample()
    fireEvent.click(screen.getByRole('button', { name: 'Иван' }))

    act(() => vi.advanceTimersByTime(3999))
    expect(screen.getByText('Вы предложили обмен Ивану')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(1))
    expect(screen.queryByText('Вы предложили обмен Ивану')).not.toBeInTheDocument()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('закрывает только выбранное сообщение и отменяет его таймер', () => {
    vi.useFakeTimers()
    renderExample()
    fireEvent.click(screen.getByRole('button', { name: 'Иван' }))
    fireEvent.click(screen.getByRole('button', { name: 'Анна' }))

    fireEvent.click(screen.getAllByRole('button', { name: 'Закрыть уведомление' })[0])

    expect(screen.queryByText('Вы предложили обмен Ивану')).not.toBeInTheDocument()
    expect(screen.getByText('Вы предложили обмен Анне')).toBeInTheDocument()
    expect(vi.getTimerCount()).toBe(1)
  })

  it('отсчитывает время каждого уведомления независимо', () => {
    vi.useFakeTimers()
    renderExample()
    fireEvent.click(screen.getByRole('button', { name: 'Иван' }))
    act(() => vi.advanceTimersByTime(2000))
    fireEvent.click(screen.getByRole('button', { name: 'Анна' }))
    act(() => vi.advanceTimersByTime(2000))

    expect(screen.queryByText('Вы предложили обмен Ивану')).not.toBeInTheDocument()
    expect(screen.getByText('Вы предложили обмен Анне')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.queryByText('Вы предложили обмен Анне')).not.toBeInTheDocument()
  })

  it.each(['{Enter}', ' '])('закрывает уведомление с клавиатуры: %s', async (key) => {
    const user = userEvent.setup()
    renderExample()
    await user.click(screen.getByRole('button', { name: 'Анна' }))
    await user.tab()
    expect(screen.getByRole('button', { name: 'Закрыть уведомление' })).toHaveFocus()

    await user.keyboard(key)

    expect(screen.queryByText('Вы предложили обмен Анне')).not.toBeInTheDocument()
  })

  it('отменяет активные таймеры при размонтировании', () => {
    vi.useFakeTimers()
    const { unmount } = renderExample()
    fireEvent.click(screen.getByRole('button', { name: 'Иван' }))
    fireEvent.click(screen.getByRole('button', { name: 'Анна' }))
    expect(vi.getTimerCount()).toBe(2)

    unmount()

    expect(vi.getTimerCount()).toBe(0)
    expect(screen.queryByRole('log')).not.toBeInTheDocument()
  })
})
