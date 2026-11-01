import { render, screen } from '@testing-library/react'

import { Avatar } from './Avatar'
import { IMAGE_PLACEHOLDERS } from '@/shared/lib/image'

describe('Avatar', () => {
  it('рисует фото пользователя', () => {
    render(<Avatar src="/images/avatars/u01.jpg" alt="Иван" />)
    const avatar = screen.getByRole('img', { name: 'Иван' })

    expect(avatar.getAttribute('src')).toContain('u01.jpg')
  })

  it('рисует заглушку, если фото нет', () => {
    render(<Avatar src={null} alt="Пользователь без фото" />)
    const avatar = screen.getByRole('img', { name: 'Пользователь без фото' })

    expect(avatar.getAttribute('src')).toContain(IMAGE_PLACEHOLDERS.AVATAR)
  })
})
