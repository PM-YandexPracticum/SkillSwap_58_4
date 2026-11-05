import { fireEvent, render, screen } from '@testing-library/react'
import { useToast } from '@/shared/lib/toast'
import { App } from './App'

vi.mock('./providers/RouterProvider', () => ({
  AppRouter: function Probe() {
    const { showToast } = useToast()
    return <button onClick={() => showToast('Вы предложили обмен Ивану')}>Предложить обмен</button>
  },
}))

describe('App', () => {
  it('предоставляет уведомления компонентам маршрутов', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Предложить обмен' }))
    expect(screen.getByText('Вы предложили обмен Ивану')).toBeInTheDocument()
  })
})
