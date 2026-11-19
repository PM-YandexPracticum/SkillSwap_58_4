import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes, useLocation } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { createCategory } from '@/entities/category/testing'
import { registerReset, type RegisterDraft } from '@/features/register'
import { ROUTES } from '@/shared/config'
import { fileToDataUrl } from '@/shared/lib/image'
import { RegisterStep2Page } from './RegisterStep2Page'

// Настоящий fileToDataUrl сжимает картинку через canvas, которого в jsdom нет
vi.mock('@/shared/lib/image', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/lib/image')>()),
  fileToDataUrl: vi.fn(async (file: File) => `data:image/png;base64,${file.name}`),
}))

const preloadedState = {
  categories: { items: [createCategory()], status: 'succeeded' as const },
  cities: { items: [{ id: 'moscow', name: 'Москва' }], status: 'succeeded' as const },
}

const emptyDraft: RegisterDraft = {
  email: 'user@example.com',
  password: 'Abcdefg1',
  name: '',
  avatarPreviewUrl: null,
  birthDate: '',
  gender: null,
  cityId: '',
  learnCategoryIds: [],
  learnSubcategoryIds: [],
  skill: null,
  completion: null,
}

const originalScrollIntoView = Element.prototype.scrollIntoView

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  Element.prototype.scrollIntoView = originalScrollIntoView
  vi.clearAllMocks()
})

function Location() {
  const { pathname, search, hash } = useLocation()
  return (
    <p>
      Адрес: {pathname}
      {search}
      {hash}
    </p>
  )
}

function RegistrationRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.REGISTER_STEP_2} element={<RegisterStep2Page />} />
      <Route path={ROUTES.REGISTER_STEP_1} element={<Location />} />
      <Route path={ROUTES.REGISTER_STEP_3} element={<Location />} />
      <Route path={ROUTES.SERVER_ERROR} element={<h1>Ошибка сервера</h1>} />
    </Routes>
  )
}

function renderStep(state: Partial<RootState> = preloadedState) {
  return renderWithProviders(<RegistrationRoutes />, {
    route: ROUTES.REGISTER_STEP_2,
    preloadedState: { ...preloadedState, ...state },
  })
}

type User = ReturnType<typeof renderStep>['user']

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

describe('RegisterStep2Page', () => {
  it('«Продолжить» неактивна, пока форма не заполнена', () => {
    renderStep()

    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
  })

  it('«Продолжить» сохраняет поля в черновик, отмечает шаг пройденным и открывает шаг 3', async () => {
    const { user, store } = renderStep()

    await fillValid(user)
    await waitFor(() => expect(screen.getByRole('button', { name: 'Продолжить' })).toBeEnabled())
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(screen.getByText(`Адрес: ${ROUTES.REGISTER_STEP_3}`)).toBeInTheDocument()
    const { draft, completedStep } = store.getState().register
    expect(completedStep).toBe(2)
    expect(draft).toMatchObject({
      name: 'Ирина',
      birthDate: '1995-05-01',
      gender: 'female',
      cityId: 'moscow',
      learnCategoryIds: ['business'],
      learnSubcategoryIds: ['business-management'],
    })
  })

  it('«Назад» сохраняет введённое как есть, не отмечает шаг пройденным и открывает шаг 1', async () => {
    const { user, store } = renderStep()

    await user.type(screen.getByLabelText('Имя'), 'Ирина')
    await user.click(screen.getByRole('button', { name: 'Назад' }))

    expect(screen.getByText(`Адрес: ${ROUTES.REGISTER_STEP_1}`)).toBeInTheDocument()
    expect(store.getState().register.draft.name).toBe('Ирина')
    expect(store.getState().register.completedStep).toBe(0)
  })

  it('не стирает данные шага 1', async () => {
    const { user, store } = renderStep({
      register: {
        completedStep: 1,
        draft: emptyDraft,
        completionStatus: 'idle',
        completionError: null,
        completionRequestId: null,
      },
    })

    await user.click(screen.getByRole('button', { name: 'Назад' }))

    expect(store.getState().register.draft).toMatchObject({
      email: 'user@example.com',
      password: 'Abcdefg1',
    })
  })

  it('при возврате на шаг показывает сохранённые данные и аватар', async () => {
    renderStep({
      register: {
        completedStep: 2,
        completionStatus: 'idle',
        completionError: null,
        completionRequestId: null,
        draft: {
          ...emptyDraft,
          name: 'Ирина',
          avatarPreviewUrl: 'data:image/png;base64,saved',
          birthDate: '1995-05-01',
          gender: 'female',
          cityId: 'moscow',
          learnCategoryIds: ['business'],
          learnSubcategoryIds: ['business-management'],
        },
      },
    })

    expect(screen.getByLabelText('Имя')).toHaveValue('Ирина')
    expect(screen.getByLabelText('Дата рождения')).toHaveValue('01.05.1995')
    expect(screen.getByLabelText('Пол')).toHaveTextContent('Женский')
    expect(screen.getByRole('combobox', { name: 'Город' })).toHaveValue('Москва')
    expect(screen.getByRole('img', { name: 'Аватар пользователя' })).toHaveAttribute(
      'src',
      'data:image/png;base64,saved',
    )
    await waitFor(() => expect(screen.getByRole('button', { name: 'Продолжить' })).toBeEnabled())
  })

  describe('аватар', () => {
    const getInput = () => screen.getByTestId('avatar-upload-input')

    it('выбранный файл попадает в черновик готовым data URL, без повторного сжатия', async () => {
      const { user, store } = renderStep()
      await user.upload(getInput(), new File(['x'], 'me.png', { type: 'image/png' }))

      await waitFor(() =>
        expect(store.getState().register.draft.avatarPreviewUrl).toBe(
          'data:image/png;base64,me.png',
        ),
      )
      expect(fileToDataUrl).toHaveBeenCalledOnce()
      expect(await screen.findByRole('img', { name: 'Аватар пользователя' })).toBeInTheDocument()
    })

    it('неподходящий файл не сохраняется, показывается ошибка', async () => {
      const { store } = renderStep()
      const user = userEvent.setup({ applyAccept: false })
      await user.upload(getInput(), new File(['x'], 'doc.pdf', { type: 'application/pdf' }))

      expect(screen.getByRole('alert')).toHaveTextContent('Только JPG, PNG или WEBP')
      expect(store.getState().register.draft.avatarPreviewUrl).toBeNull()
      expect(fileToDataUrl).not.toHaveBeenCalled()
    })

    it('фото не обязательно для перехода на шаг 3', async () => {
      const { user, store } = renderStep()

      await fillValid(user)
      await waitFor(() => expect(screen.getByRole('button', { name: 'Продолжить' })).toBeEnabled())
      await user.click(screen.getByRole('button', { name: 'Продолжить' }))

      expect(screen.getByText(`Адрес: ${ROUTES.REGISTER_STEP_3}`)).toBeInTheDocument()
      expect(store.getState().register.draft.avatarPreviewUrl).toBeNull()
    })
  })

  it.each(['успех', 'ошибка'])(
    'ожидает чтение фото и восстанавливает продолжение после результата: %s',
    async (outcome) => {
      let resolve!: (value: string) => void
      let reject!: (error: Error) => void
      vi.mocked(fileToDataUrl).mockImplementationOnce(
        () =>
          new Promise<string>((done, fail) => {
            resolve = done
            reject = fail
          }),
      )
      const { user, store } = renderStep()
      await fillValid(user)
      await waitFor(() => expect(screen.getByRole('button', { name: 'Продолжить' })).toBeEnabled())
      await user.upload(
        screen.getByTestId('avatar-upload-input'),
        new File(['x'], 'me.png', { type: 'image/png' }),
      )
      expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
      await user.click(screen.getByLabelText('Имя'))
      await user.keyboard('{Enter}')
      expect(screen.getByRole('form')).toBeInTheDocument()
      expect(store.getState().register.completedStep).toBe(0)
      await act(async () => {
        if (outcome === 'успех') resolve('data:image/png;base64,ready')
        else reject(new Error('broken'))
      })
      if (outcome === 'ошибка')
        expect(screen.getByRole('alert')).toHaveTextContent('Не удалось загрузить фото')
      await waitFor(() => expect(screen.getByRole('button', { name: 'Продолжить' })).toBeEnabled())
      await user.click(screen.getByRole('button', { name: 'Продолжить' }))
      expect(screen.getByText(`Адрес: ${ROUTES.REGISTER_STEP_3}`)).toBeInTheDocument()
      expect(store.getState().register.draft.avatarPreviewUrl).toBe(
        outcome === 'успех' ? 'data:image/png;base64,ready' : null,
      )
    },
  )

  it('после ухода назад и очистки черновика позднее фото не восстанавливает данные', async () => {
    let resolve!: (value: string) => void
    vi.mocked(fileToDataUrl).mockImplementationOnce(
      () =>
        new Promise<string>((done) => {
          resolve = done
        }),
    )
    const { user, store } = renderStep()
    await user.upload(
      screen.getByTestId('avatar-upload-input'),
      new File(['x'], 'me.png', { type: 'image/png' }),
    )
    await user.click(screen.getByRole('button', { name: 'Назад' }))
    expect(screen.getByText(`Адрес: ${ROUTES.REGISTER_STEP_1}`)).toBeInTheDocument()
    act(() => {
      store.dispatch(registerReset())
    })
    const resetDraft = store.getState().register.draft
    await act(async () => {
      resolve('data:image/png;base64,late')
    })
    expect(store.getState().register.draft).toEqual(resetDraft)
  })
})
