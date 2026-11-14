import { render, screen } from '@testing-library/react'

import { StepSkill } from './StepSkill'

describe('StepSkill', () => {
  it('показывает форму и окна, переданные слотами', () => {
    render(
      <StepSkill
        skillForm={<form aria-label="Форма навыка" />}
        previewModal={<p>Окно превью</p>}
      />,
    )

    expect(screen.getByRole('form', { name: 'Форма навыка' })).toBeInTheDocument()
    expect(screen.getByText('Окно превью')).toBeInTheDocument()
  })

  it('без окон показывает только форму', () => {
    render(<StepSkill skillForm={<form aria-label="Форма навыка" />} />)

    expect(screen.getByRole('form', { name: 'Форма навыка' })).toBeInTheDocument()
  })
})
