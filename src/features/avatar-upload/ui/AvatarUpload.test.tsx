import { render, screen } from '@testing-library/react'
import { AvatarUpload } from './AvatarUpload'

describe('AvatarUpload', () => {
  it('без фото показывает доступную кнопку добавления', () => {
    render(<AvatarUpload value={null} onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Добавить фото' })).toHaveAttribute('type', 'button')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
  it('показывает переданное фото и меняет его при обновлении пропса', () => {
    const { rerender } = render(<AvatarUpload value="/images/avatars/u01.jpg" onChange={vi.fn()} />)
    expect(screen.getByRole('img', { name: 'Аватар пользователя' })).toHaveAttribute(
      'src',
      expect.stringContaining('u01.jpg'),
    )
    rerender(<AvatarUpload value="/images/avatars/u02.jpg" onChange={vi.fn()} />)
    expect(screen.getByRole('img', { name: 'Аватар пользователя' })).toHaveAttribute(
      'src',
      expect.stringContaining('u02.jpg'),
    )
  })
})
