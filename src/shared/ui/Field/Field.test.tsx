import { render, screen } from '@testing-library/react'
import { Field } from './Field'

describe('Field', () => {
  it('связывает подпись с дочерним полем', () => {
    render(<Field label="Имя">{(control) => <input {...control} />}</Field>)

    expect(screen.getByRole('textbox', { name: 'Имя' })).toBeInTheDocument()
  })

  it('объединяет внешнюю подсказку с ошибкой и помечает поле невалидным', () => {
    render(
      <>
        <p id="hint">Подсказка формы</p>
        <Field label="Имя" describedBy="hint" error="Проверьте значение">
          {(control) => <input {...control} />}
        </Field>
      </>,
    )

    const field = screen.getByRole('textbox', { name: 'Имя' })
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(field).toHaveAccessibleDescription('Подсказка формы Проверьте значение')
  })

  it('принимает заданный id и убирает ошибку без error', () => {
    const { rerender } = render(
      <Field id="custom-field" label="Имя" error="Проверьте значение">
        {(control) => <input {...control} />}
      </Field>,
    )

    expect(screen.getByRole('textbox', { name: 'Имя' })).toHaveAttribute('id', 'custom-field')
    expect(screen.getByText('Проверьте значение')).toBeInTheDocument()

    rerender(
      <Field id="custom-field" label="Имя">
        {(control) => <input {...control} />}
      </Field>,
    )

    expect(screen.queryByText('Проверьте значение')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Имя' })).not.toHaveAttribute('aria-invalid', 'true')
  })
})
