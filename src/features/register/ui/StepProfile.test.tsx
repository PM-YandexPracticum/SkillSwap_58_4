import { act, screen } from '@testing-library/react'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { fetchCategories } from '@/entities/category'
import { fetchCities } from '@/entities/city'
import { StepProfile } from './StepProfile'

const originalScrollIntoView = Element.prototype.scrollIntoView

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  Element.prototype.scrollIntoView = originalScrollIntoView
})

describe('StepProfile', () => {
  it('показывает все поля шага регистрации', () => {
    renderWithProviders(
      <StepProfile
        onNext={vi.fn()}
        onBack={vi.fn()}
        avatarUpload={<button type="button">Добавить фото</button>}
      />,
    )

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
      <StepProfile
        onNext={vi.fn()}
        onBack={onBack}
        avatarUpload={<button type="button">Добавить фото</button>}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Назад' }))

    expect(onBack).toHaveBeenCalledOnce()
  })

  it('вызывает onNext при нажатии на кнопку «Продолжить»', async () => {
    const onNext = vi.fn()

    const { user } = renderWithProviders(
      <StepProfile
        onNext={onNext}
        onBack={vi.fn()}
        avatarUpload={<button type="button">Добавить фото</button>}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(onNext).toHaveBeenCalledOnce()
  })

  it('позволяет ввести имя', async () => {
    const { user } = renderWithProviders(
      <StepProfile
        onNext={vi.fn()}
        onBack={vi.fn()}
        avatarUpload={<button type="button">Добавить фото</button>}
      />,
    )

    const nameInput = screen.getByLabelText('Имя')

    await user.type(nameInput, 'Александр')

    expect(nameInput).toHaveValue('Александр')
  })

  it('отображает списки категорий и подкатегорий', () => {
    renderWithProviders(
      <StepProfile
        onNext={vi.fn()}
        onBack={vi.fn()}
        avatarUpload={<button type="button">Добавить фото</button>}
      />,
    )

    expect(screen.getByText('Категория навыка, которому хотите научиться')).toBeInTheDocument()

    expect(screen.getByText('Подкатегория навыка, которому хотите научиться')).toBeInTheDocument()
  })

  it('позволяет выбрать город', async () => {
    const { user } = renderWithProviders(
      <StepProfile
        onNext={vi.fn()}
        onBack={vi.fn()}
        avatarUpload={<button type="button">Добавить фото</button>}
      />,
    )

    await user.click(screen.getByLabelText('Город'))

    expect(screen.getByPlaceholderText('Выберите город')).toBeInTheDocument()
  })

  it('позволяет выбрать пол', async () => {
    const { user } = renderWithProviders(
      <StepProfile
        onNext={vi.fn()}
        onBack={vi.fn()}
        avatarUpload={<button type="button">Добавить фото</button>}
      />,
    )

    await user.click(screen.getByLabelText('Пол'))
    await user.click(screen.getByText('Мужской'))

    expect(screen.getByLabelText('Пол')).toHaveTextContent('Мужской')
  })

  it('позволяет выбрать дату рождения', async () => {
    const { user } = renderWithProviders(
      <StepProfile
        onNext={vi.fn()}
        onBack={vi.fn()}
        avatarUpload={<button type="button">Добавить фото</button>}
      />,
    )

    const dateInput = screen.getByLabelText('Дата рождения')

    await user.type(dateInput, '01.05.1995')

    expect(dateInput).toHaveValue('01.05.1995')
  })
})

describe('StepProfile: отправка и выбор значений', () => {
  it.each(['клик', 'Enter'])('предотвращает нативную отправку формы: %s', async (method) => {
    const onNext = vi.fn()
    const { user } = renderWithProviders(
      <StepProfile onNext={onNext} onBack={vi.fn()} avatarUpload={null} />,
    )
    let prevented = false
    const onSubmit = (event: Event) => {
      prevented = event.defaultPrevented
    }
    document.addEventListener('submit', onSubmit, { once: true })
    await user.type(screen.getByLabelText('Имя'), 'Ирина')
    if (method === 'клик') await user.click(screen.getByRole('button', { name: 'Продолжить' }))
    else await user.keyboard('{Enter}')
    document.removeEventListener('submit', onSubmit)
    expect(onNext).toHaveBeenCalledOnce()
    expect(prevented).toBe(true)
  })

  it('ищет и выбирает город с клавиатуры', async () => {
    const { user, store } = renderWithProviders(
      <StepProfile onNext={vi.fn()} onBack={vi.fn()} avatarUpload={null} />,
    )
    await act(async () => {
      await store.dispatch(fetchCities())
    })
    await user.type(screen.getByRole('combobox', { name: 'Город' }), 'моск')
    expect(screen.getAllByRole('option')).toHaveLength(1)
    await user.keyboard('{ArrowDown}{Enter}')
    expect(screen.getByRole('combobox', { name: 'Город' })).toHaveValue('Москва')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('сохраняет несколько выбранных категорий после закрытия списка', async () => {
    const { user, store } = renderWithProviders(
      <StepProfile onNext={vi.fn()} onBack={vi.fn()} avatarUpload={null} />,
    )
    await act(async () => {
      await store.dispatch(fetchCategories())
    })
    const field = screen.getByRole('button', { name: /^Категория навыка/ })
    await user.click(field)
    await user.click(screen.getByRole('checkbox', { name: 'Бизнес и карьера' }))
    await user.click(screen.getByRole('checkbox', { name: 'Иностранные языки' }))
    await user.keyboard('{Escape}')
    expect(field).toHaveTextContent('Бизнес и карьера')
    expect(field).toHaveTextContent('+1')
    expect(field).toHaveFocus()
    await user.click(field)
    expect(screen.getByRole('checkbox', { name: 'Бизнес и карьера' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Иностранные языки' })).toBeChecked()
  })
})
