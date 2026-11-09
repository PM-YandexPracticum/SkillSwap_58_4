import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { ErrorPage } from './ErrorPage'

const baseProps = {
  errorImage: '/error-500.svg',
  title: 'Что-то пошло не так',
  description: 'На сервере произошла ошибка.',
}

describe('ErrorPage', () => {
  it('рендерит заголовок и описание из пропсов', () => {
    render(<ErrorPage {...baseProps} errorType="500" />)

    expect(
      screen.getByRole('heading', { level: 1, name: baseProps.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(baseProps.description)).toBeInTheDocument()
  })

  it('рендерит картинку с корректным src и размерами', () => {
    render(<ErrorPage {...baseProps} errorType="500" />)

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', baseProps.errorImage)
    expect(img).toHaveAttribute('width', '460')
    expect(img).toHaveAttribute('height', '304')
  })

  it('для типа 500 пишет в alt «500 ERROR»', () => {
    render(<ErrorPage {...baseProps} errorType="500" />)

    expect(screen.getByRole('img')).toHaveAttribute(
      'alt',
      'Монитор с надписью 500 SERVER ERROR',
    )
  })

  it('для типа 404 пишет в alt «404 ERROR»', () => {
    render(<ErrorPage {...baseProps} errorType="404" />)

    expect(screen.getByRole('img')).toHaveAttribute(
      'alt',
      'Монитор с надписью 404 ERROR',
    )
  })
})
