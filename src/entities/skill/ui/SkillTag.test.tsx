import { render, screen } from '@testing-library/react'

import { SkillTag } from './SkillTag'

describe('SkillTag', () => {
  it('показывает название и красит чип в цвет категории', () => {
    render(<SkillTag title="Игра на барабанах" categoryId="creativity" />)

    expect(screen.getByText('Игра на барабанах').parentElement).toHaveStyle({
      backgroundColor: 'var(--color-tag-art)',
    })
  })

  it('незнакомая категория — чип без цвета категории, но с названием', () => {
    render(<SkillTag title="Что-то новое" categoryId="unknown" />)

    expect(screen.getByText('Что-то новое').parentElement).toHaveStyle({
      backgroundColor: 'var(--color-bg-secondary)',
    })
  })
})
