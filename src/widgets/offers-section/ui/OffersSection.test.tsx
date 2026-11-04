import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { PublicUser } from '@/entities/user'
import { createUser } from '@/entities/user/testing'

import { OffersSection } from './OffersSection'

const users = Array.from({ length: 12 }, (_, index) =>
  createUser({ id: `u${index}`, name: `Автор ${index + 1}` }),
)
const renderItem = (user: PublicUser) => <a href={`#${user.id}`}>{user.name}</a>

describe('OffersSection', () => {
  it('раскрывает 3 → 9 → 3, меняет подпись и состояние кнопки', async () => {
    const user = userEvent.setup()
    render(
      <OffersSection title="Популярное" users={users} mode="expandable" renderItem={renderItem} />,
    )
    const section = screen.getByRole('region', { name: 'Популярное' })
    const toggle = within(section).getByRole('button', { name: 'Смотреть все' })
    expect(within(section).getAllByRole('link')).toHaveLength(3)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)

    expect(within(section).getAllByRole('link')).toHaveLength(9)
    expect(toggle).toHaveAccessibleName('Свернуть')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.click(toggle)

    expect(within(section).getAllByRole('link')).toHaveLength(3)
    expect(toggle).toHaveAccessibleName('Смотреть все')
    expect(toggle).toHaveFocus()
  })

  it.each([0, 1, 3])('при %i карточках не предлагает раскрытие', (count) => {
    render(
      <OffersSection
        title="Новое"
        users={users.slice(0, count)}
        mode="expandable"
        renderItem={renderItem}
      />,
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryAllByRole('link')).toHaveLength(count)
  })

  it('раскрывает неполную секцию до числа переданных карточек', async () => {
    const user = userEvent.setup()
    render(
      <OffersSection
        title="Новое"
        users={users.slice(0, 5)}
        mode="expandable"
        renderItem={renderItem}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Смотреть все' }))

    expect(screen.getAllByRole('link')).toHaveLength(5)
  })

  it('в режиме ленты показывает все переданные карточки без кнопки раскрытия', () => {
    render(
      <OffersSection title="Рекомендуем" users={users} mode="infinite" renderItem={renderItem} />,
    )

    expect(screen.getAllByRole('link')).toHaveLength(12)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('не раскрывает соседнюю секцию и даёт каждой кнопке свой список', async () => {
    const user = userEvent.setup()
    render(
      <>
        <OffersSection title="Популярное" users={users} mode="expandable" renderItem={renderItem} />
        <OffersSection title="Новое" users={users} mode="expandable" renderItem={renderItem} />
      </>,
    )
    const popular = within(screen.getByRole('region', { name: 'Популярное' }))
    const recent = within(screen.getByRole('region', { name: 'Новое' }))
    expect(popular.getByRole('button').getAttribute('aria-controls')).not.toBe(
      recent.getByRole('button').getAttribute('aria-controls'),
    )

    await user.click(popular.getByRole('button'))

    expect(popular.getAllByRole('link')).toHaveLength(9)
    expect(recent.getAllByRole('link')).toHaveLength(3)
  })
})
