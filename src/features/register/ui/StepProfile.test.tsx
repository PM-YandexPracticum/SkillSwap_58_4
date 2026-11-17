import { act, screen, waitFor } from '@testing-library/react'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { fetchCategories } from '@/entities/category'
import { createCategory } from '@/entities/category/testing'
import { fetchCities } from '@/entities/city'
import { StepProfile, type StepProfileProps } from './StepProfile'

const preloadedState = {
  categories: { items: [createCategory()], status: 'succeeded' as const },
  cities: { items: [{ id: 'moscow', name: 'Москва' }], status: 'succeeded' as const },
}

const defaultValues = {
  name: 'Ирина',
  birthDate: '1995-05-01',
  gender: 'female' as const,
  cityId: 'moscow',
  learnCategoryIds: ['business'],
  learnSubcategoryIds: ['business-management'],
}

const originalScrollIntoView = Element.prototype.scrollIntoView

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  Element.prototype.scrollIntoView = originalScrollIntoView
})

function renderForm(props: Partial<StepProfileProps> = {}) {
  return renderWithProviders(
    <StepProfile
      onNext={vi.fn()}
      onBack={vi.fn()}
      avatarUpload={<button type="button">Добавить фото</button>}
      {...props}
    />,
    { preloadedState },
  )
}

const submitButton = () => screen.getByRole('button', { name: 'Продолжить' })

type User = ReturnType<typeof renderForm>['user']

async function fillValid(user: User) {
  await user.type(screen.getByLabelText('Имя'), 'Ирина')
  await user.type(screen.getByLabelText('Дата рождения'), '01.05.1995')
  await user.click(screen.getByLabelText('Пол'))
  await user.click(screen.getByText('Женский'))
  await user.click(screen.getByRole('combobox', { name: 'Город' }))
  await user.click(screen.getByRole('option', { name: 'Москва' }))
  await user.click(screen.getByRole('button', { name: /^Подкатегория навыка/ }))
  await user.click(screen.getByRole('checkbox', { name: 'Управление командой' }))
  await user.keyboard('{Escape}')
}

describe('StepProfile', () => {
  it('показывает все поля шага регистрации', () => {
    renderForm()

    expect(screen.getByLabelText('Имя')).toBeInTheDocument()
    expect(screen.getByLabelText('Дата рождения')).toBeInTheDocument()
    expect(screen.getByLabelText('Пол')).toBeInTheDocument()
    expect(screen.getByLabelText('Город')).toBeInTheDocument()
    expect(screen.getByText('Категория навыка, которому хотите научиться')).toBeInTheDocument()
    expect(screen.getByText('Подкатегория навыка, которому хотите научиться')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Добавить фото' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Назад' })).toBeInTheDocument()
    expect(submitButton()).toBeInTheDocument()
  })

  it('«Продолжить» неактивна, пока форма не заполнена', () => {
    renderForm()

    expect(submitButton()).toBeDisabled()
  })

  it('«Назад» отдаёт текущие значения без проверки', async () => {
    const onBack = vi.fn()
    const { user } = renderForm({ onBack })

    await user.type(screen.getByLabelText('Имя'), 'Ирина')
    await user.click(screen.getByRole('button', { name: 'Назад' }))

    expect(onBack).toHaveBeenCalledOnce()
    expect(onBack).toHaveBeenCalledWith(expect.objectContaining({ name: 'Ирина', cityId: '' }))
  })

  it('позволяет ввести имя', async () => {
    const { user } = renderForm()
    const nameInput = screen.getByLabelText('Имя')

    await user.type(nameInput, 'Александр')

    expect(nameInput).toHaveValue('Александр')
  })

  it('позволяет выбрать пол, в том числе «Не указан»', async () => {
    const { user } = renderForm()

    await user.click(screen.getByLabelText('Пол'))
    await user.click(screen.getByText('Мужской'))
    expect(screen.getByLabelText('Пол')).toHaveTextContent('Мужской')

    await user.click(screen.getByLabelText('Пол'))
    await user.click(screen.getByRole('option', { name: 'Не указан' }))
    expect(screen.getByLabelText('Пол')).toHaveTextContent('Не указан')
  })

  it('позволяет ввести дату рождения', async () => {
    const { user } = renderForm()
    const dateInput = screen.getByLabelText('Дата рождения')

    await user.type(dateInput, '01.05.1995')

    expect(dateInput).toHaveValue('01.05.1995')
  })

  it('отдаёт проверенные значения в onNext, подкатегория сама отмечает категорию', async () => {
    const onNext = vi.fn()
    const { user } = renderForm({ onNext })

    await fillValid(user)
    await waitFor(() => expect(submitButton()).toBeEnabled())
    await user.click(submitButton())

    expect(onNext).toHaveBeenCalledOnce()
    expect(onNext).toHaveBeenCalledWith({
      name: 'Ирина',
      birthDate: '1995-05-01',
      gender: 'female',
      cityId: 'moscow',
      learnCategoryIds: ['business'],
      learnSubcategoryIds: ['business-management'],
    })
  })

  it('подставляет значения из черновика', async () => {
    renderForm({ defaultValues })

    expect(screen.getByLabelText('Имя')).toHaveValue('Ирина')
    expect(screen.getByLabelText('Дата рождения')).toHaveValue('01.05.1995')
    expect(screen.getByLabelText('Пол')).toHaveTextContent('Женский')
    expect(screen.getByRole('combobox', { name: 'Город' })).toHaveValue('Москва')
    expect(screen.getByRole('button', { name: /^Подкатегория навыка/ })).toHaveTextContent(
      'Управление командой',
    )
    await waitFor(() => expect(submitButton()).toBeEnabled())
  })

  describe('ошибки', () => {
    it('имя: показывается после ухода с поля', async () => {
      const { user } = renderForm()

      await user.type(screen.getByLabelText('Имя'), 'Ирина1')
      expect(screen.queryByText('Только буквы, пробел и дефис')).not.toBeInTheDocument()
      await user.tab()

      expect(await screen.findByText('Только буквы, пробел и дефис')).toBeInTheDocument()
      expect(submitButton()).toBeDisabled()
    })

    it('имя: обязательно', async () => {
      const { user } = renderForm()

      await user.click(screen.getByLabelText('Имя'))
      await user.tab()

      expect(await screen.findByText('Введите имя')).toBeInTheDocument()
    })

    it('дата рождения: возраст младше 14 лет', async () => {
      const { user } = renderForm()

      await user.type(screen.getByLabelText('Дата рождения'), '01.05.2020')
      await user.click(screen.getByLabelText('Имя'))

      expect(await screen.findByText('Возраст от 14 до 100 лет')).toBeInTheDocument()
    })

    it('город: ошибка появляется, когда выбор очищен', async () => {
      const { user } = renderForm({ defaultValues })

      await user.click(screen.getByRole('button', { name: 'Очистить' }))

      expect(await screen.findByText('Выберите город из списка')).toBeInTheDocument()
      expect(submitButton()).toBeDisabled()
    })

    it('«Хочу научиться»: после снятия всех подкатегорий нужна хотя бы одна', async () => {
      const { user } = renderForm()

      await user.click(screen.getByRole('button', { name: /^Подкатегория навыка/ }))
      await user.click(screen.getByRole('checkbox', { name: 'Управление командой' }))
      await user.click(screen.getByRole('checkbox', { name: 'Управление командой' }))

      expect(await screen.findByText('Выберите хотя бы одно направление')).toBeInTheDocument()
    })

    it('«Хочу научиться»: выбор категории не показывает ошибку подкатегории', async () => {
      const { user } = renderForm()

      await user.click(screen.getByRole('button', { name: /^Категория навыка/ }))
      await user.click(screen.getByRole('checkbox', { name: 'Бизнес и карьера' }))
      await user.keyboard('{Escape}')

      expect(screen.queryByText('Выберите хотя бы одно направление')).not.toBeInTheDocument()
      expect(submitButton()).toBeDisabled()
    })
  })
})

describe('StepProfile: отправка и выбор значений', () => {
  it.each(['клик', 'Enter'])('предотвращает нативную отправку формы: %s', async (method) => {
    const onNext = vi.fn()
    const { user } = renderForm({ onNext, defaultValues })
    await waitFor(() => expect(submitButton()).toBeEnabled())
    let prevented = false
    const onSubmit = (event: Event) => {
      prevented = event.defaultPrevented
    }
    document.addEventListener('submit', onSubmit, { once: true })
    if (method === 'клик') await user.click(submitButton())
    else {
      await user.click(screen.getByLabelText('Имя'))
      await user.keyboard('{Enter}')
    }
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
