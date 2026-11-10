import { screen } from '@testing-library/react'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { StepProfile } from './StepProfile'

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

describe('StepProfile', () => {
  it('показывает все поля шага регистрации', () => {
    renderWithProviders(<StepProfile onNext={vi.fn()} onBack={vi.fn()} onAvatarFile={vi.fn()} />)

    expect(screen.getByLabelText('Имя')).toBeInTheDocument()
    expect(screen.getByLabelText('Дата рождения')).toBeInTheDocument()
    expect(screen.getByLabelText('Пол')).toBeInTheDocument()
    expect(screen.getByLabelText('Город')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Назад' })).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeInTheDocument()
  })

  it('вызывает onBack при нажатии на кнопку «Назад»', async () => {
    const onBack = vi.fn()

    const { user } = renderWithProviders(
      <StepProfile onNext={vi.fn()} onBack={onBack} onAvatarFile={vi.fn()} />,
    )

    await user.click(screen.getByRole('button', { name: 'Назад' }))

    expect(onBack).toHaveBeenCalledOnce()
  })

  it('вызывает onNext при нажатии на кнопку «Продолжить»', async () => {
    const onNext = vi.fn()

    const { user } = renderWithProviders(
      <StepProfile onNext={onNext} onBack={vi.fn()} onAvatarFile={vi.fn()} />,
    )

    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(onNext).toHaveBeenCalledOnce()
  })

  it('позволяет ввести имя', async () => {
    const { user } = renderWithProviders(
      <StepProfile onNext={vi.fn()} onBack={vi.fn()} onAvatarFile={vi.fn()} />,
    )

    const nameInput = screen.getByLabelText('Имя')

    await user.type(nameInput, 'Александр')

    expect(nameInput).toHaveValue('Александр')
  })

  it('отображает списки категорий и подкатегорий', () => {
    renderWithProviders(<StepProfile onNext={vi.fn()} onBack={vi.fn()} onAvatarFile={vi.fn()} />)

    expect(screen.getByText('Категория навыка, которому хотите научиться')).toBeInTheDocument()

    expect(screen.getByText('Подкатегория навыка, которому хотите научиться')).toBeInTheDocument()
  })

  it('позволяет выбрать город', async () => {
    const { user } = renderWithProviders(
      <StepProfile onNext={vi.fn()} onBack={vi.fn()} onAvatarFile={vi.fn()} />,
    )

    await user.click(screen.getByLabelText('Город'))

    expect(screen.getByPlaceholderText('Выберите город')).toBeInTheDocument()
  })

  it('позволяет выбрать пол', async () => {
    const { user } = renderWithProviders(
      <StepProfile onNext={vi.fn()} onBack={vi.fn()} onAvatarFile={vi.fn()} />,
    )

    await user.click(screen.getByLabelText('Пол'))
    await user.click(screen.getByText('Мужской'))

    expect(screen.getByLabelText('Пол')).toHaveTextContent('Мужской')
  })

  it('позволяет выбрать дату рождения', async () => {
    const { user } = renderWithProviders(
      <StepProfile onNext={vi.fn()} onBack={vi.fn()} onAvatarFile={vi.fn()} />,
    )

    const dateInput = screen.getByLabelText('Дата рождения')

    await user.type(dateInput, '01.05.1995')

    expect(dateInput).toHaveValue('01.05.1995')
  })
})
