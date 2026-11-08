import { render, screen, within } from '@testing-library/react'

import type { PublicUser } from '@/entities/user'
import { createUser } from '@/entities/user/testing'

import { OffersCarousel } from './OffersCarousel'

// Мок Carousel: рендерит слайды как есть и показывает, сколько карточек просили видеть сразу
vi.mock('@/shared/ui/Carousel', () => ({
  Carousel: ({ children, slidesToShow }: { children: React.ReactNode; slidesToShow?: number }) => (
    <div data-testid="carousel" data-slides-to-show={slidesToShow}>
      {children}
    </div>
  ),
}))

const users = Array.from({ length: 6 }, (_, index) =>
  createUser({ id: `u${index}`, name: `Автор ${index + 1}` }),
)
const renderItem = (user: PublicUser) => <a href={`#${user.id}`}>{user.name}</a>

describe('OffersCarousel', () => {
  it('показывает заголовок «Похожие предложения» и карточки всех переданных пользователей', () => {
    render(<OffersCarousel users={users} renderItem={renderItem} />)

    const section = screen.getByRole('region', { name: 'Похожие предложения' })
    expect(
      within(section).getByRole('heading', { level: 2, name: 'Похожие предложения' }),
    ).toBeInTheDocument()
    expect(within(section).getAllByRole('link')).toHaveLength(users.length)
  })

  it('отрисовывает каждую карточку через renderItem в порядке списка', () => {
    render(<OffersCarousel users={users.slice(0, 3)} renderItem={renderItem} />)

    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Автор 1',
      'Автор 2',
      'Автор 3',
    ])
  })

  it('просит карусель показывать четыре карточки сразу', () => {
    render(<OffersCarousel users={users} renderItem={renderItem} />)

    expect(screen.getByTestId('carousel')).toHaveAttribute('data-slides-to-show', '4')
  })

  it('без похожих предложений ничего не показывает', () => {
    const { container } = render(<OffersCarousel users={[]} renderItem={renderItem} />)

    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByText('Похожие предложения')).not.toBeInTheDocument()
  })
})
