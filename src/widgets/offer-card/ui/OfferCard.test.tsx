import { act, screen, within } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { addExchange, fetchExchanges, type Exchange } from '@/entities/exchange'
import { endSession, startSession } from '@/entities/session'
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
    saveStatus: 'idle' as const,
    pendingSaves: 0,
    saveError: null,
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

const proposedExchange: Exchange = {
  id: 'exchange-card-test',
  fromUserId: 'current-user',
  toUserId: author.id,
  skillId: author.teachSkillId,
  createdAt: '2026-01-15T10:00:00.000Z',
}
const proposedState: Partial<RootState> = {
  ...preloadedState,
  session: { session: { userId: proposedExchange.fromUserId, token: 'test' } },
  exchanges: { items: [proposedExchange], status: 'succeeded', pendingRequests: 0, error: null },
}

describe('OfferCard — статус обмена', () => {
  it('показывает статус вместо ссылки для собственного предложения', () => {
    renderWithProviders(<OfferCard user={author} />, { preloadedState: proposedState })

    expect(screen.getByText('Обмен предложен')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Подробнее' })).not.toBeInTheDocument()
  })

  it.each([
    ['гость', null, proposedExchange],
    ['пользователь без предложения', proposedExchange.fromUserId, null],
    ['другой отправитель', 'another-user', proposedExchange],
    [
      'входящее предложение',
      proposedExchange.fromUserId,
      {
        ...proposedExchange,
        fromUserId: author.id,
        toUserId: proposedExchange.fromUserId,
      },
    ],
    [
      'предложение другому человеку',
      proposedExchange.fromUserId,
      {
        ...proposedExchange,
        toUserId: 'another-recipient',
      },
    ],
  ])('%s видит ссылку «Подробнее»', (_, userId, exchange) => {
    renderWithProviders(<OfferCard user={author} />, {
      preloadedState: {
        ...proposedState,
        session: { session: userId ? { userId, token: 'test' } : null },
        exchanges: {
          items: exchange ? [exchange] : [],
          status: 'succeeded',
          pendingRequests: 0,
          error: null,
        },
      },
    })

    expect(screen.getByRole('link', { name: 'Подробнее' })).toHaveAttribute(
      'href',
      getSkillRoute(author.teachSkillId),
    )
    expect(screen.queryByText('Обмен предложен')).not.toBeInTheDocument()
  })

  it('сохраняет статус для другого навыка того же получателя', () => {
    renderWithProviders(<OfferCard user={author} />, {
      preloadedState: {
        ...proposedState,
        exchanges: {
          items: [{ ...proposedExchange, skillId: 'previous-skill' }],
          status: 'succeeded',
          pendingRequests: 0,
          error: null,
        },
      },
    })
    expect(screen.getByText('Обмен предложен')).toBeInTheDocument()
  })

  it('сразу скрывает статус после выхода и смены пользователя', () => {
    const { store } = renderWithProviders(<OfferCard user={author} />, {
      preloadedState: proposedState,
    })
    expect(screen.getByText('Обмен предложен')).toBeInTheDocument()
    act(() => {
      store.dispatch(endSession())
    })
    expect(screen.getByRole('link', { name: 'Подробнее' })).toBeInTheDocument()
    act(() => {
      store.dispatch(startSession('another-user'))
    })
    expect(screen.queryByText('Обмен предложен')).not.toBeInTheDocument()
    act(() => {
      store.dispatch(startSession(proposedExchange.fromUserId))
    })
    expect(screen.getByText('Обмен предложен')).toBeInTheDocument()
  })

  it('обновляет статус после сохранения обмена и его загрузки в новом store', async () => {
    const { store, unmount } = renderWithProviders(<OfferCard user={author} />, {
      preloadedState: { ...preloadedState, session: proposedState.session },
    })
    expect(screen.getByRole('link', { name: 'Подробнее' })).toBeInTheDocument()
    act(() => {
      store.dispatch(startSession(proposedExchange.fromUserId))
    })
    await act(async () => {
      await store.dispatch(addExchange(proposedExchange)).unwrap()
    })
    expect(screen.getByText('Обмен предложен')).toBeInTheDocument()
    unmount()

    const reloaded = renderWithProviders(<OfferCard user={author} />, { preloadedState })
    await act(async () => {
      await reloaded.store.dispatch(fetchExchanges()).unwrap()
    })
    expect(screen.getByText('Обмен предложен')).toBeInTheDocument()
  })

  it('не делает статус отдельной остановкой клавиатуры', async () => {
    const { user } = renderWithProviders(<OfferCard user={author} />, {
      preloadedState: proposedState,
    })
    await user.tab()
    expect(screen.getByRole('button', { name: 'Добавить в избранное' })).toHaveFocus()
    await user.tab()
    expect(screen.getByText('Обмен предложен')).not.toHaveFocus()
    expect(screen.queryByRole('button', { name: 'Обмен предложен' })).not.toBeInTheDocument()
  })
})

describe('OfferCard — ошибки сохранения', () => {
  it('не показывает успешный статус, если обмен не удалось сохранить', async () => {
    const { store } = renderWithProviders(<OfferCard user={author} />, {
      preloadedState: { ...preloadedState, session: proposedState.session },
    })
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota', 'QuotaExceededError')
    })
    try {
      await act(async () => {
        await store.dispatch(addExchange(proposedExchange))
      })
      expect(store.getState().exchanges.status).toBe('failed')
      expect(screen.getByRole('link', { name: 'Подробнее' })).toBeInTheDocument()
      expect(screen.queryByText('Обмен предложен')).not.toBeInTheDocument()
    } finally {
      setItem.mockRestore()
    }
  })
})
