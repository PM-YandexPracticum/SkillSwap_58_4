import { screen, within } from '@testing-library/react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { createCategory } from '@/entities/category/testing'
import { ROUTES } from '@/shared/config'
import { RegisterStep3Page } from './RegisterStep3Page'

vi.mock('@/shared/lib/image', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/lib/image')>()),
  fileToDataUrl: vi.fn(async (file: File) => `data:image/png;base64,${file.name}`),
}))

const preloadedState = {
  categories: { items: [createCategory()], status: 'succeeded' as const },
}

const originalScrollIntoView = Element.prototype.scrollIntoView

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
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

  it('«Готово» открывает каталог с флагом окна «Ваше предложение создано», ничего не сохраняя', async () => {
    const { user, store } = renderStep()
    const before = store.getState().register

    await fillForm(user)
    await uploadImage(user)
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))
    await user.click(screen.getByRole('button', { name: 'Готово' }))

    expect(
      screen.getByText(`Адрес: ${ROUTES.HOME} · окно «Ваше предложение создано»`),
    ).toBeInTheDocument()
    expect(store.getState().register).toEqual(before)
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
})
