import { screen, within } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import { createUser } from '@/entities/user/testing'
import { createSkill } from '@/entities/skill/testing'
import { CatalogView } from './CatalogView'

const users = Array.from({ length: 10 }, (_, i) =>
  createUser({ id: `u${i}`, name: `Автор ${i}`, teachSkillId: `s${i}` }),
)
const state: Partial<RootState> = {
  skills: {
    items: users.map((u) => createSkill({ id: u.teachSkillId, authorId: u.id })),
    status: 'succeeded',
    error: null,
  },
  categories: { items: [], status: 'succeeded' },
  cities: { items: [], status: 'succeeded' },
}

describe('CatalogView', () => {
  it('собирает три секции, независимо раскрывает их и ведёт на навык', async () => {
    const { user } = renderWithProviders(
      <Routes>
        <Route path="/" element={<CatalogView users={users} />} />
        <Route path="/skill/:id" element={<h1>Открыт навык</h1>} />
      </Routes>,
      { preloadedState: state },
    )
    const popular = screen.getByRole('region', { name: 'Популярное' })
    const newest = screen.getByRole('region', { name: 'Новое' })
    expect(within(popular).getAllByRole('article')).toHaveLength(3)
    expect(
      within(screen.getByRole('region', { name: 'Рекомендуем' })).getAllByRole('article'),
    ).toHaveLength(6)
    await user.click(within(popular).getByRole('button', { name: 'Смотреть все' }))
    expect(within(popular).getAllByRole('article')).toHaveLength(9)
    expect(within(newest).getAllByRole('article')).toHaveLength(3)
    await user.click(within(popular).getByRole('button', { name: 'Свернуть' }))
    expect(within(popular).getAllByRole('article')).toHaveLength(3)
    await user.click(within(popular).getAllByRole('link', { name: 'Подробнее' })[0])
    expect(screen.getByRole('heading', { name: 'Открыт навык' })).toBeInTheDocument()
  })
  it('показывает отдельный вид результатов и передаёт действия без изменения store', async () => {
    const onRemoveFilter = vi.fn(),
      onSortChange = vi.fn()
    const { user, store } = renderWithProviders(
      <CatalogView
        users={users.slice(0, 2)}
        results={{
          filters: [{ id: 'city:x', label: 'Москва' }],
          sort: 'newest',
          onRemoveFilter,
          onSortChange,
        }}
      />,
      { preloadedState: state },
    )
    const before = store.getState().catalogFilter
    expect(screen.getByRole('heading', { name: 'Подходящие предложения: 2' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Популярное' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(2)
    await user.click(screen.getByRole('button', { name: 'Удалить Москва' }))
    await user.click(screen.getByRole('button', { name: 'Сначала новые' }))
    expect(onRemoveFilter).toHaveBeenCalledWith('city:x')
    expect(onSortChange).toHaveBeenCalledWith('oldest')
    expect(store.getState().catalogFilter).toEqual(before)
  })
  it.each([false, true])('показывает пустое состояние: результаты=%s', (results) => {
    renderWithProviders(
      <CatalogView
        users={[]}
        results={
          results
            ? { filters: [], sort: 'newest', onRemoveFilter: vi.fn(), onSortChange: vi.fn() }
            : undefined
        }
      />,
    )
    expect(screen.getByRole('status')).toHaveTextContent(
      results ? 'Ничего не нашлось' : 'Предложения пока не добавлены',
    )
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })
  it('подставляет в секции переданные списки, «Рекомендуем» берет исходные порядок', () => {
    renderWithProviders(
      <CatalogView
        users={users}
        popularUsers={[...users].reverse()}
        newUsers={users.slice(2)}
      />,
      { preloadedState: state },
    )
    const cards = (title: string) =>
      within(screen.getByRole('region', { name: title })).getAllByRole('article')
    expect(cards('Популярное')[0]).toHaveTextContent('Автор 9')
    expect(cards('Популярное')[2]).toHaveTextContent('Автор 7')
    expect(cards('Новое')[0]).toHaveTextContent('Автор 2')
    expect(cards('Новое')[2]).toHaveTextContent('Автор 4')
    expect(cards('Рекомендуем')[0]).toHaveTextContent('Автор 0')
  })
  it('раскрывает неполную секцию до числа её карточек', async () => {
    const { user } = renderWithProviders(
      <CatalogView users={users} popularUsers={users.slice(0, 5)} />,
      { preloadedState: state },
    )
    const popular = screen.getByRole('region', { name: 'Популярное' })
    await user.click(within(popular).getByRole('button', { name: 'Смотреть все' }))
    expect(within(popular).getAllByRole('article')).toHaveLength(5)
  })
})
