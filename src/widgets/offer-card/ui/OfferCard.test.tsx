import { screen, within } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { createSkill } from '@/entities/skill/testing'
import { createUser } from '@/entities/user/testing'
import { getSkillRoute, ROUTES } from '@/shared/config'

import { OfferCard } from './OfferCard'

const author = createUser({ teachSkillId: 's-author', learnSubcategoryIds: ['english', 'yoga'] })
const skill = createSkill({
  id: author.teachSkillId,
  title: 'Игра на барабанах',
  categoryId: 'creativity',
})
const preloadedState: Partial<RootState> = {
  cities: { items: [{ id: author.cityId, name: 'Казань' }], status: 'succeeded' },
  skills: {
    items: [createSkill({ id: 's-other', title: 'Чужой навык' }), skill],
    status: 'succeeded',
    error: null,
  },
  categories: {
    items: [
      {
        id: 'languages',
        title: 'Языки',
        icon: 'languages',
        color: 'languages',
        subcategories: [{ id: 'english', title: 'Английский', categoryId: 'languages' }],
      },
      {
        id: 'health',
        title: 'Здоровье',
        icon: 'health',
        color: 'health',
        subcategories: [{ id: 'yoga', title: 'Медитация', categoryId: 'health' }],
      },
    ],
    status: 'succeeded',
  },
}

describe('OfferCard', () => {
  it('собирает город, свой навык и интересы из store по id автора', () => {
    renderWithProviders(<OfferCard user={author} />, { preloadedState })

    expect(screen.getByRole('heading', { name: author.name })).toBeInTheDocument()
    expect(screen.getByText(/^Казань, /)).toBeInTheDocument()
    expect(
      within(screen.getByRole('list', { name: 'Может научить' })).getByText(skill.title),
    ).toBeInTheDocument()
    expect(screen.queryByText('Чужой навык')).not.toBeInTheDocument()
    const learn = within(screen.getByRole('list', { name: 'Хочет научиться' }))
    expect(learn.getByText('Английский')).toBeInTheDocument()
    expect(learn.getByText('Медитация')).toBeInTheDocument()
    expect(screen.getByText(String(author.likesCount))).toBeInTheDocument()
  })

  it('«Подробнее» ведёт на страницу навыка автора', async () => {
    const { user } = renderWithProviders(
      <Routes>
        <Route path={ROUTES.HOME} element={<OfferCard user={author} />} />
        <Route path={ROUTES.SKILL} element={<h1>Страница навыка</h1>} />
      </Routes>,
      { preloadedState },
    )
    const link = screen.getByRole('link', { name: 'Подробнее' })
    expect(link).toHaveAttribute('href', getSkillRoute(author.teachSkillId))

    await user.click(link)

    expect(screen.getByRole('heading', { name: 'Страница навыка' })).toBeInTheDocument()
  })

  it('не показывает несуществующие интересы и не падает до загрузки справочников', () => {
    renderWithProviders(<OfferCard user={author} />)

    expect(screen.getByRole('heading', { name: author.name })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Хочет научиться' })).toBeEmptyDOMElement()
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument()
  })
})
