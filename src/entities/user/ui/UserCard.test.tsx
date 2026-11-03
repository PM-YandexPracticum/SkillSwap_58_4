import { render, screen, within } from '@testing-library/react'

import { createUser } from '../testing'

import { UserCard, type UserCardProps } from './UserCard'

/** Подкатегории — как в справочнике `public/db/categories.json` */
const LEARN = [
  { id: 'english', title: 'Английский', categoryId: 'languages' },
  { id: 'time-management', title: 'Тайм-менеджмент', categoryId: 'business' },
  { id: 'yoga', title: 'Йога и медитация', categoryId: 'health' },
  { id: 'cooking', title: 'Приготовление еды', categoryId: 'home' },
]

function renderCard(props: Partial<UserCardProps> = {}) {
  return render(
    <UserCard
      user={createUser({ name: 'Иван', birthDate: '1992-03-15T10:00:00.000Z' })}
      cityName="Санкт-Петербург"
      teachSkill={{ title: 'Игра на барабанах', categoryId: 'creativity' }}
      learnSubcategories={LEARN.slice(0, 2)}
      {...props}
    />,
  )
}

describe('UserCard', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 30, 12))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('показывает аватар, имя и «город, возраст»', () => {
    renderCard()

    expect(screen.getByRole('heading', { name: 'Иван' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Иван' })).toBeInTheDocument()
    expect(screen.getByText('Санкт-Петербург, 34 года')).toBeInTheDocument()
  })

  it('склоняет возраст: 21 год, 25 лет', () => {
    const { rerender } = renderCard({
      user: createUser({ birthDate: '2005-01-10T10:00:00.000Z' }),
    })
    expect(screen.getByText('Санкт-Петербург, 21 год')).toBeInTheDocument()

    rerender(
      <UserCard
        user={createUser({ birthDate: '2001-01-10T10:00:00.000Z' })}
        cityName="Казань"
        teachSkill={{ title: 'Игра на барабанах', categoryId: 'creativity' }}
        learnSubcategories={[]}
      />,
    )
    expect(screen.getByText('Казань, 25 лет')).toBeInTheDocument()
  })

  it('«Может научить» — один чип со своим названием навыка', () => {
    renderCard()

    const teach = screen.getByRole('list', { name: 'Может научить' })
    expect(within(teach).getAllByRole('listitem')).toHaveLength(1)
    expect(within(teach).getByText('Игра на барабанах')).toBeInTheDocument()
  })

  it('«Хочет научиться» — до двух чипов без «+N»', () => {
    renderCard()

    const learn = screen.getByRole('list', { name: 'Хочет научиться' })
    expect(within(learn).getAllByRole('listitem')).toHaveLength(2)
    expect(within(learn).queryByText(/^\+\d+$/)).not.toBeInTheDocument()
  })

  it('«Хочет научиться» — больше двух: два чипа и «+N» с остальными', () => {
    renderCard({ learnSubcategories: LEARN })

    const learn = screen.getByRole('list', { name: 'Хочет научиться' })
    expect(within(learn).getByText('Английский')).toBeInTheDocument()
    expect(within(learn).getByText('Тайм-менеджмент')).toBeInTheDocument()
    expect(within(learn).queryByText('Йога и медитация')).not.toBeInTheDocument()
    expect(within(learn).getByText('+2')).toBeInTheDocument()
  })

  it('слоты: лайк сверху и кнопка снизу приходят снаружи', () => {
    renderCard({
      topAction: <button type="button">Нравится</button>,
      bottomAction: <button type="button">Подробнее</button>,
    })

    expect(screen.getByRole('button', { name: 'Нравится' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Подробнее' })).toBeInTheDocument()
  })
})
