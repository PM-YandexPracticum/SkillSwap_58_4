import { screen, within, waitFor } from '@testing-library/react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { createCategory } from '@/entities/category/testing'
import { getSkills } from '@/entities/skill'
import { createNewUser, getUsers, selectNewUsers } from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { ROUTES } from '@/shared/config'
import { resetMockDb } from '@/shared/api'
import { RegisterStep3Page } from './RegisterStep3Page'

vi.mock('@/shared/lib/image', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/lib/image')>()),
  fileToDataUrl: vi.fn(async (file: File) => `data:image/png;base64,${file.name}`),
}))

const preloadedState = {
  categories: { items: [createCategory()], status: 'succeeded' as const },
  cities: { items: [{ id: 'moscow', name: 'Москва' }], status: 'succeeded' as const },
  register: {
    completedStep: 3 as const,
    completionStatus: 'idle' as const,
    completionError: null,
    completionRequestId: null,
    draft: {
      email: 'registration-flow@example.com',
      password: 'Chernosliv5',
      name: 'Анна',
      avatarPreviewUrl: null,
      birthDate: '2000-01-10',
      gender: null,
      cityId: 'moscow',
      learnCategoryIds: ['business'],
      learnSubcategoryIds: ['business-management'],
      skill: null,
      completion: null,
    },
  },
}

const originalScrollIntoView = Element.prototype.scrollIntoView

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
  localStorage.clear()
  resetMockDb()
})

afterEach(() => {
  vi.restoreAllMocks()
  Element.prototype.scrollIntoView = originalScrollIntoView
})

function Location() {
  const { pathname, state } = useLocation()
  const offerCreated = (state as { offerCreated?: boolean } | null)?.offerCreated
  return (
    <p>
      Адрес: {pathname}
      {offerCreated ? ' · окно «Ваше предложение создано»' : ''}
    </p>
  )
}

function RegistrationRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.REGISTER_STEP_3} element={<RegisterStep3Page />} />
      <Route path={ROUTES.REGISTER_STEP_2} element={<Location />} />
      <Route path={ROUTES.HOME} element={<Location />} />
      <Route path={ROUTES.SERVER_ERROR} element={<h1>Ошибка сервера</h1>} />
    </Routes>
  )
}

function renderStep(state: Parameters<typeof renderWithProviders>[1] = { preloadedState }) {
  return renderWithProviders(<RegistrationRoutes />, { route: ROUTES.REGISTER_STEP_3, ...state })
}

async function fillForm(user: ReturnType<typeof renderStep>['user']) {
  await user.type(screen.getByLabelText('Название навыка'), 'Игра на барабанах')
  await user.click(screen.getByLabelText('Категория навыка'))
  await user.click(screen.getByText('Бизнес и карьера'))
  await user.click(screen.getByLabelText('Подкатегория навыка'))
  await user.click(screen.getByText('Управление командой'))
  await user.type(screen.getByLabelText('Описание'), 'Научу основам техники')
}

async function uploadImage(user: ReturnType<typeof renderStep>['user']) {
  await user.upload(
    screen.getByTestId('filedropzone-input') as HTMLInputElement,
    new File(['x'], 'drums.png', { type: 'image/png' }),
  )
  await screen.findByAltText('Фото 1')
}

describe('RegisterStep3Page', () => {
  it('показывает форму шага с «Назад» и «Продолжить», окон пока нет', () => {
    renderStep()

    expect(
      screen.getByRole('form', { name: 'Укажите, чем вы готовы поделиться' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Назад' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('«Назад» ведёт на шаг 2 без сохранения данных', async () => {
    const { user, store } = renderStep()
    const before = store.getState().register

    await user.type(screen.getByLabelText('Название навыка'), 'Игра на барабанах')
    await user.click(screen.getByRole('button', { name: 'Назад' }))

    expect(screen.getByText(`Адрес: ${ROUTES.REGISTER_STEP_2}`)).toBeInTheDocument()
    expect(store.getState().register).toEqual(before)
  })

  it('«Продолжить» открывает превью с введёнными данными', async () => {
    const { user } = renderStep()

    await fillForm(user)
    await uploadImage(user)
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    const dialog = screen.getByRole('dialog', { name: 'Ваше предложение' })
    expect(within(dialog).getByRole('heading', { name: 'Игра на барабанах' })).toBeInTheDocument()
    expect(within(dialog).getByText('Бизнес и карьера / Управление командой')).toBeInTheDocument()
    expect(within(dialog).getByText('Научу основам техники')).toBeInTheDocument()
  })

  it('выбранное фото попадает в превью', async () => {
    const { user } = renderStep()

    await fillForm(user)
    await uploadImage(user)
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    const dialog = screen.getByRole('dialog', { name: 'Ваше предложение' })
    expect(within(dialog).getByRole('img')).toHaveAttribute(
      'src',
      'data:image/png;base64,drums.png',
    )
  })

  it('«Редактировать» закрывает превью и оставляет введённые данные в форме', async () => {
    const { user } = renderStep()

    await fillForm(user)
    await uploadImage(user)
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))
    await user.click(screen.getByRole('button', { name: 'Редактировать' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Название навыка')).toHaveValue('Игра на барабанах')
    expect(screen.getByLabelText('Описание')).toHaveValue('Научу основам техники')
  })

  it('«Готово» сохраняет связанные записи, создаёт сессию и открывает каталог с окном', async () => {
    const { user, store } = renderStep()

    await fillForm(user)
    await uploadImage(user)
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))
    await user.click(screen.getByRole('button', { name: 'Готово' }))

    expect(
      await screen.findByText(
        `Адрес: ${ROUTES.HOME} · окно «Ваше предложение создано»`,
        {},
        { timeout: 5000 },
      ),
    ).toBeInTheDocument()
    const savedUser = store
      .getState()
      .users.items.find((item) => item.email === 'registration-flow@example.com')
    expect(savedUser).toMatchObject({
      name: 'Анна',
      about: '',
      likesCount: 0,
      learnSubcategoryIds: ['business-management'],
    })
    expect(selectNewUsers(store.getState())[0]?.id).toBe(savedUser?.id)
    const savedSkill = store
      .getState()
      .skills.items.find((item) => item.id === savedUser?.teachSkillId)
    expect(savedSkill).toMatchObject({
      authorId: savedUser?.id,
      title: 'Игра на барабанах',
      images: ['data:image/png;base64,drums.png'],
    })
    expect(store.getState().session.session?.userId).toBe(savedUser?.id)
    expect((await getUsers()).some((item) => item.id === savedUser?.id)).toBe(true)
    expect((await getSkills()).some((item) => item.id === savedSkill?.id)).toBe(true)
    expect(store.getState().register.draft.email).toBe('')
  })

  it('показывает Loader, если общий провайдер ещё не завершил загрузку категорий', () => {
    renderStep({ preloadedState: { categories: { items: [], status: 'loading' } } })

    expect(screen.getByRole('status', { name: 'Загрузка' })).toBeInTheDocument()
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
  })

  it('при ошибке категорий открывает страницу ошибки', () => {
    renderStep({ preloadedState: { categories: { items: [], status: 'failed' } } })

    expect(screen.getByRole('heading', { name: 'Ошибка сервера' })).toBeInTheDocument()
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
  })

  it('после занятого email позволяет закрыть превью и вернуться к данным регистрации', async () => {
    const { user, store } = renderStep()
    await fillForm(user)
    await uploadImage(user)
    await store
      .dispatch(createNewUser(createUser({ email: 'registration-flow@example.com' })))
      .unwrap()
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))
    await user.click(screen.getByRole('button', { name: 'Готово' }))
    expect(await screen.findByRole('alert', {}, { timeout: 5000 })).toHaveTextContent(
      'email уже используется',
    )
    const attempt = store.getState().register.draft.completion

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Назад' }))

    expect(screen.getByText(`Адрес: ${ROUTES.REGISTER_STEP_2}`)).toBeInTheDocument()
    expect(store.getState().register.draft.completion).toEqual(attempt)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('уход со шага во время сохранения не создаёт сессию и не возвращает в каталог', async () => {
    const { user, store, unmount } = renderStep()
    await fillForm(user)
    await uploadImage(user)
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))
    await user.click(screen.getByRole('button', { name: 'Готово' }))
    unmount()
    // Чтение дожидается уже запущенного обращения к коллекции, без произвольных sleep.
    await getSkills()
    await getUsers()

    expect(store.getState().session.session).toBeNull()
    expect(store.getState().register.draft.email).toBe('registration-flow@example.com')
    await waitFor(() => expect(store.getState().register.completionStatus).toBe('idle'))
  })
})
