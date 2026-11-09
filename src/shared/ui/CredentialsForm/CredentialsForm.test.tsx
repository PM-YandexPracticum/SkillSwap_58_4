import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CredentialsForm } from './CredentialsForm'

describe('CredentialsForm', () => {
  it('отправка и действия полей принадлежат вызывающей форме', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event) => event.preventDefault())
    const onChange = vi.fn()
    render(
      <CredentialsForm
        label="Учётные данные"
        submitLabel="Продолжить"
        onSubmit={onSubmit}
        emailInput={{ name: 'email', onChange }}
        passwordInput={{ name: 'password' }}
      >
        <a href="#login">Войти</a>
      </CredentialsForm>,
    )

    await user.type(screen.getByLabelText('Email'), 'a')
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('разные формы связывают поля только со своей общей ошибкой', () => {
    render(
      <>
        <CredentialsForm
          label="Первая"
          submitLabel="Войти"
          onSubmit={vi.fn()}
          emailInput={{}}
          passwordInput={{}}
          error="Первая ошибка"
        >
          Ссылка
        </CredentialsForm>
        <CredentialsForm
          label="Вторая"
          submitLabel="Войти"
          onSubmit={vi.fn()}
          emailInput={{}}
          passwordInput={{}}
          error="Вторая ошибка"
        >
          Ссылка
        </CredentialsForm>
      </>,
    )

    const emails = screen.getAllByLabelText('Email')
    expect(emails[0]).toHaveAccessibleDescription('Первая ошибка')
    expect(emails[1]).toHaveAccessibleDescription('Вторая ошибка')
  })

  it('снятие общей ошибки очищает описания и признак неверных полей', () => {
    const props = {
      label: 'Вход',
      submitLabel: 'Войти',
      onSubmit: vi.fn(),
      emailInput: {},
      passwordInput: {},
      children: 'Ссылка',
    }
    const { rerender } = render(<CredentialsForm {...props} error="Ошибка входа" />)
    rerender(<CredentialsForm {...props} />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid')
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-describedby')
    expect(screen.getByLabelText('Пароль')).not.toHaveAttribute('aria-invalid')
    expect(screen.getByLabelText('Пароль')).not.toHaveAttribute('aria-describedby')
  })

  it('сохраняет дополнительные описания полей при общей ошибке', () => {
    const form = (error?: string) => (
      <CredentialsForm
        label="Вход"
        submitLabel="Войти"
        onSubmit={vi.fn()}
        emailInput={{ 'aria-describedby': 'email-hint' }}
        passwordInput={{ 'aria-describedby': 'password-hint' }}
        error={error}
      >
        <p id="email-hint">Почта для входа</p>
        <p id="password-hint">Пароль аккаунта</p>
      </CredentialsForm>
    )
    const { rerender } = render(form('Ошибка входа'))

    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription(
      'Почта для входа Ошибка входа',
    )
    expect(screen.getByLabelText('Пароль')).toHaveAccessibleDescription(
      'Пароль аккаунта Ошибка входа',
    )

    rerender(form())

    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription('Почта для входа')
    expect(screen.getByLabelText('Пароль')).toHaveAccessibleDescription('Пароль аккаунта')
  })
})
