import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createUser } from '../testing'
import { UserProfileCard } from './UserProfileCard'
import type { UserCardTag } from './UserCard'

// Мокаем дочерние компоненты, чтобы тестировать только логику самой карточки
vi.mock('./UserSummary', () => ({
  UserSummary: ({ user, cityName }: { user: { name: string }; cityName: string }) => (
    <div data-testid="user-summary">
      {user.name} — {cityName}
    </div>
  ),
}))

vi.mock('./UserCard', () => ({
  Chip: ({ title }: { title: string }) => <span data-testid="chip">{title}</span>,
}))

vi.mock('@/shared/ui/Tag', () => ({
  Tag: ({ label }: { label: string }) => <span data-testid="tag-more">{label}</span>,
}))

const user = createUser({
  name: 'Иван',
  cityId: 'spb',
  avatarUrl: '/images/avatars/u01.jpg',
  about: 'Люблю ритм и кофе по утрам',
})

const teachSkill: UserCardTag = {
  title: 'Игра на барабанах',
  categoryId: 'creativity',
}

const learnSubcategories = [
  { id: 'tm', title: 'Тайм-менеджмент', categoryId: 'business' },
  { id: 'yoga', title: 'Йога и медитация', categoryId: 'health' },
]

const defaultProps = {
  user,
  cityName: 'Санкт-Петербург',
  teachSkill,
  learnSubcategories,
}

describe('UserProfileCard', () => {
  it('рендерит блок UserSummary с именем и городом', () => {
    render(<UserProfileCard {...defaultProps} />)

    const summary = screen.getByTestId('user-summary')
    expect(summary).toBeInTheDocument()
    expect(summary).toHaveTextContent('Иван')
    expect(summary).toHaveTextContent('Санкт-Петербург')
  })

  it('показывает блок «О себе», если about заполнен', () => {
    render(<UserProfileCard {...defaultProps} />)

    expect(screen.getByText('Люблю ритм и кофе по утрам')).toBeInTheDocument()
  })

  it('не рендерит текст «О себе», если about пустой', () => {
    const userWithoutAbout = createUser({
      name: 'Анна',
      about: '',
    })

    render(<UserProfileCard {...defaultProps} user={userWithoutAbout} />)

    // Текст «О себе» отсутствует
    expect(screen.queryByText('Люблю ритм и кофе по утрам')).not.toBeInTheDocument()
  })

  it('рендерит заголовки секций «Может научить» и «Хочет научиться»', () => {
    render(<UserProfileCard {...defaultProps} />)

    expect(screen.getByText('Может научить')).toBeInTheDocument()
    expect(screen.getByText('Хочет научиться')).toBeInTheDocument()
  })

  it('рендерит чип навыка «Может научить»', () => {
    render(<UserProfileCard {...defaultProps} />)

    expect(screen.getByText('Игра на барабанах')).toBeInTheDocument()
  })

  it('рендерит все подкатегории, если их не больше лимита (CARD_LEARN_TAGS)', () => {
    render(<UserProfileCard {...defaultProps} />)

    const chips = screen.getAllByTestId('chip')
    // один чип — teachSkill, остальные — learnSubcategories
    // при лимите CATALOG.CARD_LEARN_TAGS >= 2 все подкатегории отображаются
    expect(chips.some((c) => c.textContent === 'Тайм-менеджмент')).toBe(true)
    expect(chips.some((c) => c.textContent === 'Йога и медитация')).toBe(true)
    // «+N» не должен появиться
    expect(screen.queryByTestId('tag-more')).not.toBeInTheDocument()
  })

  it('показывает «+N» и скрывает лишние подкатегории при превышении лимита', () => {
    // Проверяем поведение независимо от реального значения CATALOG.CARD_LEARN_TAGS
    // — генерируем заведомо больше подкатегорий, чем лимит
    const manySubcategories = Array.from({ length: 10 }, (_, i) => ({
      id: `sub-${i}`,
      title: `Навык ${i}`,
      categoryId: 'creativity',
    }))

    render(
      <UserProfileCard
        {...defaultProps}
        learnSubcategories={manySubcategories}
      />,
    )

    // Если лимит меньше 10 — должен появиться тег «+N»
    // (при CATALOG.CARD_LEARN_TAGS = 2 ожидаем "+8")
    const moreTag = screen.queryByTestId('tag-more')
    expect(moreTag).toBeInTheDocument()
    expect(moreTag?.textContent).toMatch(/^\+\d+$/)
  })
})
