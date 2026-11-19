import { StrictMode } from 'react'
import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'

import { createTestStore } from '@/app/test/createTestStore'
import { createCategory } from '@/entities/category/testing'
import { getSkills } from '@/entities/skill'
import { getUsers } from '@/entities/user'
import { draftUpdated, stepCompleted } from '@/features/register'
import { ROUTES } from '@/shared/config'
import { AppRouter } from './RouterProvider'
import { ToastProvider } from './ToastProvider'

const originalScrollIntoView = Element.prototype.scrollIntoView
const credentials = { email: 'registration-router@example.com', password: 'Chernosliv5' }

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
})
afterEach(() => {
  Element.prototype.scrollIntoView = originalScrollIntoView
  window.history.replaceState(null, '', '/')
})

function renderApp(store: ReturnType<typeof createTestStore>, path: string) {
  window.history.replaceState(null, '', path)
  return render(
    <StrictMode>
      <Provider store={store}>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </Provider>
    </StrictMode>,
  )
}

function openStep() {
  const store = createTestStore({
    categories: { items: [createCategory()], status: 'succeeded' },
    cities: { items: [{ id: 'moscow', name: 'Москва' }], status: 'succeeded' },
    users: {
      items: [],
      status: 'succeeded',
      error: null,
      saveStatus: 'idle',
      saveError: null,
      pendingSaves: 0,
    },
    skills: {
      items: [],
      status: 'succeeded',
      error: null,
      saveStatus: 'idle',
      saveError: null,
      pendingSaves: 0,
    },
  })
  store.dispatch(
    draftUpdated({
      ...credentials,
      name: 'Анна',
      birthDate: '2000-01-10',
      gender: null,
      cityId: 'moscow',
      learnCategoryIds: ['business'],
      learnSubcategoryIds: ['business-management'],
      skill: {
        title: 'Игра на барабанах',
        description: 'Научу основам техники',
        categoryId: 'business',
        subcategoryId: 'business-management',
        imagePreviewUrls: ['data:image/png;base64,cGhvdG8='],
      },
    }),
  )
  store.dispatch(stepCompleted(2))
  return { store, ...renderApp(store, ROUTES.REGISTER_STEP_3), user: userEvent.setup() }
}

describe('завершение регистрации через маршруты приложения', { timeout: 20_000 }, () => {
  it('открывает окно один раз, сохраняет карточку и позволяет войти после перезагрузки', async () => {
    const { store, user, unmount } = openStep()
    await user.click(await screen.findByRole('button', { name: 'Продолжить' }))
    await user.click(screen.getByRole('button', { name: 'Готово' }))

    const dialog = await screen.findByRole(
      'dialog',
      { name: 'Ваше предложение создано' },
      { timeout: 8000 },
    )
    expect(window.location.pathname).toBe(ROUTES.HOME)
    const userId = store.getState().session.session?.userId
    expect(userId).toBeTruthy()
    expect(store.getState().register.draft.email).toBe('')
    expect(
      (await screen.findAllByText('Игра на барабанах', {}, { timeout: 8000 })).length,
    ).toBeGreaterThan(0)
    await user.click(within(dialog).getByRole('button', { name: 'Готово' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(window.history.state.usr?.offerCreated).toBeUndefined()
    await waitFor(() => expect(store.getState().exchanges.status).toBe('succeeded'))
    await waitFor(() => expect(store.getState().notifications.status).not.toBe('loading'))
    unmount()

    // Новый store и маршрут имитируют перезагрузку: коллекции читает настоящий DataProvider.
    const reloaded = createTestStore()
    const app = renderApp(reloaded, ROUTES.HOME)
    expect(
      (await screen.findAllByText('Игра на барабанах', {}, { timeout: 8000 })).length,
    ).toBeGreaterThan(0)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(reloaded.getState().session.session?.userId).toBe(userId)
    await waitFor(() => expect(reloaded.getState().exchanges.status).toBe('succeeded'))
    await waitFor(() => expect(reloaded.getState().notifications.status).not.toBe('loading'))
    app.unmount()

    // Сбрасываем только сессию: вход должен находить сохранённую связанную пару, а не черновик.
    const { endSession } = await import('@/entities/session')
    reloaded.dispatch(endSession())
    const signedOut = createTestStore()
    renderApp(signedOut, ROUTES.LOGIN)
    await screen.findByLabelText('Email', {}, { timeout: 8000 })
    await user.type(screen.getByLabelText('Email'), credentials.email)
    await user.type(screen.getByLabelText('Пароль'), credentials.password)
    await user.click(screen.getByRole('button', { name: 'Войти' }))
    expect(
      (await screen.findAllByText('Игра на барабанах', {}, { timeout: 8000 })).length,
    ).toBeGreaterThan(0)
    expect(signedOut.getState().session.session?.userId).toBe(userId)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await waitFor(() => expect(signedOut.getState().exchanges.status).toBe('succeeded'))
    await waitFor(() => expect(signedOut.getState().notifications.status).not.toBe('loading'))
  })

  it('не возвращает на старую страницу после ухода во время сохранения', async () => {
    const { store, user } = openStep()
    await user.click(await screen.findByRole('button', { name: 'Продолжить' }))
    await user.click(screen.getByRole('button', { name: 'Готово' }))
    act(() => {
      window.history.pushState(null, '', ROUTES.ALL_SKILLS)
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    await waitFor(() => expect(store.getState().register.draft.email).toBe(''))
    await screen.findByRole('heading', { name: 'Все навыки' }, { timeout: 8000 })
    await getSkills()
    await getUsers()

    expect(window.location.pathname).toBe(ROUTES.ALL_SKILLS)
    expect(store.getState().session.session).toBeNull()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
