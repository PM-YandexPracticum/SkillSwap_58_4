import { render } from '@testing-library/react'

import { Avatar } from './Avatar'
import { IMAGE_PLACEHOLDERS } from '@/shared/lib/image'

describe('Avatar', () => {
  it('рисует фото пользователя', () => {
    const { container } = render(<Avatar src="/images/avatars/u01.jpg" alt="Иван" />)
    const avatar = container.querySelector('img')

    expect(avatar).toBeInTheDocument()
    expect(avatar?.getAttribute('alt')).toBe('Иван')
    expect(avatar?.getAttribute('src')).toContain('u01.jpg')
  })

  it('рисует заглушку, если фото нет', () => {
    const { container } = render(<Avatar src={null} alt="Пользователь без фото" />)
    const avatar = container.querySelector('img')

    expect(avatar).toBeInTheDocument()
    expect(avatar?.getAttribute('src')).toContain(IMAGE_PLACEHOLDERS.AVATAR)
  })
})
