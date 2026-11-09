import { render, screen } from '@testing-library/react'

import { IllustrationCard } from './IllustrationCard'

describe('IllustrationCard', () => {
  it('показывает заголовок второго уровня и текст', () => {
    render(<IllustrationCard image="/bulb.svg" title="С возвращением в SkillSwap!" text="Текст" />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'С возвращением в SkillSwap!' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Текст')).toBeInTheDocument()
  })

  it('картинка декоративная — скрыта от скринридера', () => {
    const { container } = render(<IllustrationCard image="/bulb.svg" title="Заголовок" />)

    expect(container.querySelector('img')).toHaveAttribute('alt', '')
    expect(container.querySelector('img')).toHaveAttribute('src', '/bulb.svg')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('без текста выводит только заголовок', () => {
    const { container } = render(<IllustrationCard image="/bulb.svg" title="Заголовок" />)

    expect(container.querySelector('p')).not.toBeInTheDocument()
  })
})
