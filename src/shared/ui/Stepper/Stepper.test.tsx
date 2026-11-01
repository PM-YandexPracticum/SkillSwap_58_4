import { render, screen } from '@testing-library/react'

import { Stepper } from './Stepper'

describe('Stepper', () => {
  it('показывает номер текущего шага', () => {
    render(<Stepper current={2} total={3} />)
    const title = screen.getByText(/Шаг 2 из 3/)

    expect(title.textContent).toBe('Шаг 2 из 3')
  })

  it('поддерживает произвольное количество шагов', () => {
    render(<Stepper current={1} total={5} />)
    const title = screen.getByText(/Шаг 1 из 5/)

    expect(title.textContent).toBe('Шаг 1 из 5')
  })

  it('рисует по полоске на каждый шаг', () => {
    render(<Stepper current={1} total={3} />)
    const lines = screen.getAllByTestId('stepper-line')

    expect(lines).toHaveLength(3)
  })

  it('отмечает пройденные шаги как done', () => {
    render(<Stepper current={2} total={3} />)
    const lines = screen.getAllByTestId('stepper-line')

    expect(lines.map((line) => line.getAttribute('data-state'))).toEqual(['done', 'done', 'todo'])
  })

  it('на последнем шаге все полоски пройдены', () => {
    render(<Stepper current={3} total={3} />)
    const lines = screen.getAllByTestId('stepper-line')

    expect(lines.map((line) => line.getAttribute('data-state'))).toEqual(['done', 'done', 'done'])
  })
})
