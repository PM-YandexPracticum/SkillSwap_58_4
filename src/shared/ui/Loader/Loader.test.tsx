import { render, screen } from '@testing-library/react'

import { Loader } from './Loader'

describe('Loader', () => {
  it('сообщает скринридеру о загрузке', () => {
    render(<Loader />)

    expect(screen.getByRole('status', { name: 'Загрузка' })).toBeInTheDocument()
  })

  it('добавляет внешний className', () => {
    render(<Loader className="centered" />)

    expect(screen.getByRole('status')).toHaveClass('centered')
  })
})
