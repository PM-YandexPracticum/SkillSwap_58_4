import { render, screen } from '@testing-library/react'
import { Loader } from './Loader'

it('renders a status element', () => {
  render(<Loader />)

  expect(screen.getByRole('status')).toBeInTheDocument()
})
