import { render, screen } from '@testing-library/react'

import { CategoryIcon } from './CategoryIcon'

describe('CategoryIcon', () => {
  it.each(['business', 'creative', 'languages', 'education', 'health', 'home'])(
    'показывает декоративную иконку %s, не повторяя название категории',
    (icon) => {
      const { container } = render(<CategoryIcon icon={icon} color="business" />)

      expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
      expect(container.querySelector('svg')).toBeInTheDocument()
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    },
  )

  it.each(['unknown', 'toString', 'constructor'])('обрабатывает неизвестное имя %s', (icon) => {
    const { container } = render(<CategoryIcon icon={icon} color="unknown" />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })
})
