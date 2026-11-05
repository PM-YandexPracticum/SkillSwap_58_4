import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FavoriteButton } from './FavoriteButton'

describe('FavoriteButton', () => {
  it.each([0, 12, 1234])('показывает счётчик %i', (likesCount) => {
    render(<FavoriteButton userId="u01" likesCount={likesCount} />)

    expect(screen.getByRole('button', { name: 'Добавить в избранное' })).toBeInTheDocument()
    expect(screen.getByText(String(likesCount))).toBeInTheDocument()
  })

  it('пока не меняет число лайков по клику', async () => {
    const user = userEvent.setup()
    render(<FavoriteButton userId="u01" likesCount={12} />)

    await user.click(screen.getByRole('button', { name: 'Добавить в избранное' }))

    expect(screen.getByText('12')).toBeInTheDocument()
  })
})
