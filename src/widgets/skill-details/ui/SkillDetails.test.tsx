import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { createSkill } from '@/entities/skill/testing'
import { createUser } from '@/entities/user/testing'

import { SkillDetails, type SkillDetailsProps } from './SkillDetails'

// Карусель галереи на Embla в jsdom не нужна: достаточно слайдов
vi.mock('@/shared/ui/Carousel', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel">{children}</div>
  ),
}))

const author = createUser({ id: 'u01', name: 'Иван', about: 'Люблю ритм', likesCount: 158 })
const skill = createSkill({
  id: 's01',
  authorId: author.id,
  title: 'Игра на барабанах',
  description: 'Научу основам техники',
  categoryId: 'creativity',
  subcategoryId: 'music',
  images: ['/images/skills/s01-1.jpg', '/images/skills/s01-2.jpg'],
})

const props: SkillDetailsProps = {
  skill,
  author,
  cityName: 'Санкт-Петербург',
  categoryTitle: 'Творчество и искусство',
  subcategoryTitle: 'Музыка и звук',
  learnSubcategories: [
    { id: 'english', title: 'Английский', categoryId: 'languages' },
    { id: 'photo', title: 'Фотография', categoryId: 'creativity' },
  ],
}

describe('SkillDetails', () => {
  it('показывает карточку автора: имя, город, «О себе», чему хочет научиться', () => {
    render(<SkillDetails {...props} />)

    expect(screen.getByRole('heading', { name: 'Иван' })).toBeInTheDocument()
    expect(screen.getByText(/^Санкт-Петербург, /)).toBeInTheDocument()
    expect(screen.getByText('Люблю ритм')).toBeInTheDocument()
    expect(screen.getByText('Английский')).toBeInTheDocument()
    expect(screen.getByText('Фотография')).toBeInTheDocument()
  })

  it('показывает блок навыка: название, «Категория / Подкатегория», описание', () => {
    render(<SkillDetails {...props} />)

    expect(screen.getByRole('heading', { level: 1, name: 'Игра на барабанах' })).toBeInTheDocument()
    expect(screen.getByText('Творчество и искусство / Музыка и звук')).toBeInTheDocument()
    expect(screen.getByText('Научу основам техники')).toBeInTheDocument()
  })

  it('навык автора — в «Может научить» карточки автора', () => {
    render(<SkillDetails {...props} />)

    const teach = screen.getByRole('heading', { name: 'Может научить' })
      .parentElement as HTMLElement
    expect(within(teach).getByText('Игра на барабанах')).toBeInTheDocument()
  })

  it('кладёт картинки навыка в галерею', () => {
    render(<SkillDetails {...props} />)

    const slides = within(screen.getByTestId('carousel')).getAllByRole('img', {
      name: /^Игра на барабанах — фото \d+$/,
    })
    expect(slides).toHaveLength(skill.images.length)
  })

  it('показывает лайк со счётчиком автора, «Поделиться» и «Больше опций»', () => {
    render(<SkillDetails {...props} />)

    expect(screen.getByRole('button', { name: 'Добавить в избранное' })).toBeInTheDocument()
    expect(screen.getByText('158')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Поделиться' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Больше опций' })).toBeInTheDocument()
  })

  it('«Поделиться» и «Больше опций» — заглушки: клик ничего не ломает', async () => {
    const user = userEvent.setup()
    render(<SkillDetails {...props} />)

    await user.click(screen.getByRole('button', { name: 'Поделиться' }))
    await user.click(screen.getByRole('button', { name: 'Больше опций' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Игра на барабанах' })).toBeInTheDocument()
  })

  it('«Предложить обмен» вызывает onProposeExchange', async () => {
    const user = userEvent.setup()
    const onProposeExchange = vi.fn()
    render(<SkillDetails {...props} onProposeExchange={onProposeExchange} />)

    await user.click(screen.getByRole('button', { name: 'Предложить обмен' }))

    expect(onProposeExchange).toHaveBeenCalledTimes(1)
  })

  it('когда обмен предложен — вместо «Предложить обмен» неактивная «Обмен предложен»', () => {
    render(<SkillDetails {...props} isExchangeProposed />)

    expect(screen.getByRole('button', { name: 'Обмен предложен' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Предложить обмен' })).not.toBeInTheDocument()
  })

  it('без «О себе» не показывает пустой блок', () => {
    render(<SkillDetails {...props} author={createUser({ ...author, about: '' })} />)

    expect(screen.queryByText('Люблю ритм')).not.toBeInTheDocument()
  })
})
