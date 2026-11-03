import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './Checkbox'

function Example({ partial = false, disabled = false }) {
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(partial)
  return (
    <Checkbox
      label="Москва"
      checked={checked}
      indeterminate={indeterminate}
      disabled={disabled}
      onChange={(next) => {
        setChecked(next)
        setIndeterminate(false)
      }}
    />
  )
}

describe('Checkbox', () => {
  it('переключается по клику на подпись', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByText('Москва'))
    expect(screen.getByRole('checkbox', { name: 'Москва' })).toBeChecked()
    await user.click(screen.getByText('Москва'))
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('переключается пробелом после Tab', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.tab()
    expect(screen.getByRole('checkbox')).toHaveFocus()
    await user.keyboard(' ')
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('из частичного выбора переходит в полный, а затем снимает выбор', async () => {
    const user = userEvent.setup()
    render(<Example partial />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBePartiallyChecked()
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(checkbox).not.toBePartiallyChecked()
    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('из частичного состояния передаёт true даже при checked=true', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Checkbox label="Категория" checked indeterminate onChange={onChange} />)
    await user.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('обновляет частичное состояние при изменении пропсов', () => {
    const { rerender } = render(
      <Checkbox label="Категория" checked={false} indeterminate onChange={() => {}} />,
    )
    expect(screen.getByRole('checkbox')).toBePartiallyChecked()
    rerender(<Checkbox label="Категория" checked onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).not.toBePartiallyChecked()
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('частичный выбор — через родное свойство поля, без aria-checked поверх него', () => {
    render(<Checkbox label="Категория" checked={false} indeterminate onChange={() => {}} />)

    const checkbox = screen.getByRole<HTMLInputElement>('checkbox')
    expect(checkbox.indeterminate).toBe(true)
    expect(checkbox).not.toHaveAttribute('aria-checked')
  })

  it('отключённый чекбокс не меняется и пропускается по Tab', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <>
        <Checkbox label="Москва" checked={false} disabled onChange={onChange} />
        <button>Далее</button>
      </>,
    )
    await user.click(screen.getByText('Москва'))
    await user.tab()
    expect(screen.getByRole('button')).toHaveFocus()
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('связывает ошибку и внешнюю подсказку с чекбоксом', () => {
    render(
      <>
        <p id="hint">Можно выбрать несколько</p>
        <Checkbox
          label="Москва"
          checked={false}
          onChange={() => {}}
          aria-describedby="hint"
          error="Выберите город"
        />
      </>,
    )
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription(
      'Можно выбрать несколько Выберите город',
    )
  })
})
