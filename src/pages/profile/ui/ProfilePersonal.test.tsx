import { StrictMode } from 'react'
import { act, screen, waitFor } from '@testing-library/react'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { startSession } from '@/entities/session'
import { fetchUsers, getUserById, updateDataUser } from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { DATA_ERRORS, MOCK_DB, VALIDATION } from '@/shared/config'
import { fileToDataUrl } from '@/shared/lib/image'
import { ProfilePersonal } from './ProfilePersonal'

vi.mock('@/shared/lib/image', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/lib/image')>()),
  fileToDataUrl: vi.fn(async () => 'data:image/jpeg;base64,profile'),
}))

const person = createUser({ avatarUrl: '/images/avatars/u01.jpg' })
const other = createUser({ id: 'other', email: 'other@example.com', name: 'Анна' })
const saveButton = () => screen.getByRole('button', { name: 'Сохранить' })
const nameInput = () => screen.getByRole('textbox', { name: 'Имя' })
const emailInput = () => screen.getByRole('textbox', { name: 'Почта' })
const fileInput = () => screen.getByTestId('avatar-upload-input')

function renderProfile(current = person) {
  localStorage.setItem(`${MOCK_DB.STORAGE_PREFIX}users`, JSON.stringify([current, other]))
  return renderWithProviders(
    <StrictMode>
      <ProfilePersonal />
    </StrictMode>,
    {
      preloadedState: {
        cities: { items: [{ id: 'spb', name: 'Санкт-Петербург' }], status: 'succeeded' },
        session: { session: { userId: current.id, token: 'profile-test' } },
        users: {
          items: [current, other],
          status: 'succeeded',
          error: null,
          saveStatus: 'idle',
          pendingSaves: 0,
          saveError: null,
        },
      },
    },
  )
}

const originalScrollIntoView = Element.prototype.scrollIntoView
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
})
afterEach(() => {
  Element.prototype.scrollIntoView = originalScrollIntoView
  vi.restoreAllMocks()
})

describe('ProfilePersonal: редактирование и сохранение', () => {
  it('заполняет все поля пользователя, включая дату со временем', async () => {
    renderProfile()
    expect(emailInput()).toHaveValue(person.email)
    expect(nameInput()).toHaveValue(person.name)
    expect(screen.getByRole('textbox', { name: 'Дата рождения' })).toHaveValue('15.03.1992')
    expect(screen.getByRole('textbox', { name: 'О себе' })).toHaveValue(person.about)
    expect(screen.getByRole('img', { name: person.name })).toBeInTheDocument()
    await waitFor(() => expect(saveButton()).toBeDisabled())
  })

  it('объясняет ошибку email после ухода с поля и снимает её при исправлении', async () => {
    const { user } = renderProfile()
    await user.clear(emailInput())
    await user.type(emailInput(), 'bad')
    await user.tab()
    expect(await screen.findByText('Введите корректный email')).toBeInTheDocument()
    expect(emailInput()).toHaveAttribute('aria-invalid', 'true')
    expect(saveButton()).toBeDisabled()
    await user.clear(emailInput())
    await user.type(emailInput(), 'new@example.com')
    await waitFor(() => expect(saveButton()).toBeEnabled())
    expect(screen.queryByText('Введите корректный email')).not.toBeInTheDocument()
  })

  it.each(['abcdefgh', '12345678', 'Pass 123', 'a1'.repeat(33)])(
    'не принимает новый пароль %s',
    async (password) => {
      const { user } = renderProfile()
      await user.click(screen.getByRole('button', { name: 'Изменить пароль' }))
      await user.type(screen.getByLabelText('Новый пароль'), password)
      await user.tab()
      await waitFor(() =>
        expect(screen.getByLabelText('Новый пароль')).toHaveAttribute('aria-invalid', 'true'),
      )
      expect(saveButton()).toBeDisabled()
    },
  )

  it('после отмены пароля не оставляет ложных изменений и не выдаёт предупреждений React', async () => {
    const warning = vi.spyOn(console, 'error')
    const { user } = renderProfile()
    await user.click(screen.getByRole('button', { name: 'Изменить пароль' }))
    await user.type(screen.getByLabelText('Новый пароль'), 'Password123')
    await waitFor(() => expect(saveButton()).toBeEnabled())
    await user.click(screen.getByRole('button', { name: 'Отменить' }))
    await waitFor(() => expect(saveButton()).toBeDisabled())
    expect(screen.queryByLabelText('Новый пароль')).not.toBeInTheDocument()
    expect(warning).not.toHaveBeenCalled()
  })

  it('сохраняет нормализованные данные и оставляет связи, лайки и отменённый пароль прежними', async () => {
    const { user, store } = renderProfile()
    await user.clear(emailInput())
    await user.type(emailInput(), ' NEW@EXAMPLE.COM ')
    await user.clear(nameInput())
    await user.type(nameInput(), ' Пётр ')
    await user.clear(screen.getByRole('textbox', { name: 'О себе' }))
    await user.type(screen.getByRole('textbox', { name: 'О себе' }), '   ')
    await user.click(screen.getByRole('button', { name: 'Изменить пароль' }))
    await user.type(screen.getByLabelText('Новый пароль'), 'Password123')
    await user.click(screen.getByRole('button', { name: 'Отменить' }))
    await user.click(saveButton())
    await waitFor(() => expect(store.getState().users.saveStatus).toBe('succeeded'))
    const expected = { ...person, email: 'new@example.com', name: 'Пётр', about: '' }
    expect(store.getState().users.items.find((u) => u.id === person.id)).toEqual(expected)
    expect(await getUserById(person.id)).toEqual(expected)
    expect(await getUserById(other.id)).toEqual(other)
    await act(async () => {
      await store.dispatch(fetchUsers())
    })
    expect(nameInput()).toHaveValue('Пётр')
    expect(saveButton()).toBeDisabled()
  })

  it('сохраняет новый пароль только после включения изменения', async () => {
    const { user, store } = renderProfile()
    await user.click(screen.getByRole('button', { name: 'Изменить пароль' }))
    await user.type(screen.getByLabelText('Новый пароль'), 'NewPassword123')
    await user.click(saveButton())
    await waitFor(() => expect(store.getState().users.saveStatus).toBe('succeeded'))
    expect((await getUserById(person.id))?.password).toBe('NewPassword123')
    expect(screen.queryByLabelText('Новый пароль')).not.toBeInTheDocument()
    expect(saveButton()).toBeDisabled()
  })

  it('показывает занятый email, сохраняет ввод и позволяет повторить с новым адресом', async () => {
    const { user, store } = renderProfile()
    await user.clear(emailInput())
    await user.type(emailInput(), ' OTHER@EXAMPLE.COM ')
    await user.clear(nameInput())
    await user.type(nameInput(), 'Пётр')
    await user.click(saveButton())
    expect(await screen.findByText(DATA_ERRORS.DUPLICATE_EMAIL)).toBeInTheDocument()
    expect(nameInput()).toHaveValue('Пётр')
    expect(store.getState().users.items.find((u) => u.id === person.id)).toEqual(person)
    await user.clear(emailInput())
    await user.type(emailInput(), 'unique@example.com')
    await waitFor(() => expect(saveButton()).toBeEnabled())
    await user.click(saveButton())
    await waitFor(() => expect(store.getState().users.saveStatus).toBe('succeeded'))
    expect((await getUserById(person.id))?.email).toBe('unique@example.com')
  })

  it('не отправляет неизвестный город и объясняет, как исправить выбор', async () => {
    const { user, store } = renderProfile(createUser({ ...person, cityId: 'unknown' }))
    await user.click(screen.getByRole('combobox', { name: 'Город' }))
    await user.tab()
    expect(await screen.findByText('Выберите город из списка')).toBeInTheDocument()
    expect(saveButton()).toBeDisabled()
    expect(store.getState().users.saveStatus).toBe('idle')
    await user.click(screen.getByRole('combobox', { name: 'Город' }))
    await user.click(screen.getByRole('option', { name: 'Санкт-Петербург' }))
    await waitFor(() => expect(saveButton()).toBeEnabled())
  })

  it('позволяет выбрать «Не указан» и сохранить null', async () => {
    const { user, store } = renderProfile()
    await user.click(screen.getByRole('combobox', { name: 'Пол' }))
    await user.click(screen.getByRole('option', { name: 'Не указан' }))
    await user.click(saveButton())
    await waitFor(() => expect(store.getState().users.saveStatus).toBe('succeeded'))
    expect((await getUserById(person.id))?.gender).toBeNull()
  })

  it('при ошибке записи оставляет ввод и позволяет повторить сохранение', async () => {
    const { user, store } = renderProfile()
    await user.clear(nameInput())
    await user.type(nameInput(), 'Пётр')
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError')
    })
    await user.click(saveButton())
    expect(await screen.findByRole('alert')).toHaveTextContent(DATA_ERRORS.STORAGE_FULL)
    expect(nameInput()).toHaveValue('Пётр')
    expect(store.getState().users.items.find((u) => u.id === person.id)).toEqual(person)
    write.mockRestore()
    await user.click(saveButton())
    await waitFor(() => expect(store.getState().users.saveStatus).toBe('succeeded'))
  })

  it('во время сохранения блокирует поля, пароль, фото и повторную отправку', async () => {
    const { user, store } = renderProfile()
    await user.clear(nameInput())
    await user.type(nameInput(), 'Пётр')
    await user.click(saveButton())
    expect(nameInput()).toBeDisabled()
    expect(screen.getByRole('combobox', { name: 'Город' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Изменить пароль' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Изменить фото' })).toBeDisabled()
    expect(saveButton()).toBeDisabled()
    await user.type(nameInput(), 'Новое')
    await waitFor(() => expect(store.getState().users.saveStatus).toBe('succeeded'))
    expect(nameInput()).toHaveValue('Пётр')
    expect(saveButton()).toBeDisabled()
  })

  it('изменение лайков текущего пользователя не стирает черновик формы', async () => {
    const { user, store } = renderProfile()
    await user.clear(nameInput())
    await user.type(nameInput(), 'Пётр')
    await act(async () => {
      await store.dispatch(updateDataUser({ id: person.id, changes: { likesCount: 50 } }))
    })
    expect(nameInput()).toHaveValue('Пётр')
    await user.click(saveButton())
    await waitFor(() => expect(store.getState().users.saveStatus).toBe('succeeded'))
    expect((await getUserById(person.id))?.likesCount).toBe(50)
  })

  it('проверяет файл, сохраняет фото вместе с профилем и обновляет исходные значения', async () => {
    const { user, store } = renderProfile()
    await user.upload(fileInput(), new File(['image'], 'avatar.png', { type: 'image/png' }))
    await waitFor(() => expect(saveButton()).toBeEnabled())
    expect(screen.getByRole('img', { name: person.name })).toHaveAttribute(
      'src',
      'data:image/jpeg;base64,profile',
    )
    await user.click(saveButton())
    await waitFor(() => expect(store.getState().users.saveStatus).toBe('succeeded'))
    expect((await getUserById(person.id))?.avatarUrl).toBe('data:image/jpeg;base64,profile')
    expect(saveButton()).toBeDisabled()
  })

  it('во время чтения фото запрещает сохранение', async () => {
    let finish!: (value: string) => void
    vi.mocked(fileToDataUrl).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve
        }),
    )
    const { user } = renderProfile()
    await user.clear(nameInput())
    await user.type(nameInput(), 'Пётр')
    await user.upload(fileInput(), new File(['x'], 'avatar.png', { type: 'image/png' }))
    expect(saveButton()).toBeDisabled()
    await act(async () => {
      finish('data:image/jpeg;base64,profile')
    })
    await waitFor(() => expect(saveButton()).toBeEnabled())
  })

  it('не принимает слишком большое фото и показывает связанную с кнопкой ошибку', async () => {
    const { user } = renderProfile()
    await user.upload(
      fileInput(),
      new File([new Uint8Array(VALIDATION.IMAGE.MAX_SIZE_BYTES + 1)], 'large.png', {
        type: 'image/png',
      }),
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Файл больше 1 МБ')
    expect(screen.getByRole('button', { name: 'Изменить фото' })).toHaveAccessibleDescription(
      'Файл больше 1 МБ',
    )
    expect(saveButton()).toBeDisabled()
  })

  it('смена пользователя сбрасывает форму, пароль и несохранённое фото', async () => {
    const { user, store } = renderProfile()
    await user.clear(nameInput())
    await user.type(nameInput(), 'Пётр')
    await user.upload(fileInput(), new File(['x'], 'avatar.png', { type: 'image/png' }))
    await user.click(screen.getByRole('button', { name: 'Изменить пароль' }))
    await act(async () => {
      store.dispatch(startSession(other.id))
    })
    expect(nameInput()).toHaveValue(other.name)
    expect(screen.queryByLabelText('Новый пароль')).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: other.name })).not.toHaveAttribute(
      'src',
      'data:image/jpeg;base64,profile',
    )
    expect(saveButton()).toBeDisabled()
  })

  it('ручной ввод даты проверяется и сохраняется в формате API', async () => {
    const { user, store } = renderProfile()
    const birth = screen.getByRole('textbox', { name: 'Дата рождения' })
    await user.clear(birth)
    await user.type(birth, '01.01.2026')
    await user.click(nameInput())
    expect(await screen.findByText('Возраст от 14 до 100 лет')).toBeInTheDocument()
    expect(saveButton()).toBeDisabled()
    await user.clear(birth)
    await user.type(birth, '28.10.1995')
    await user.click(nameInput())
    await user.click(saveButton())
    await waitFor(() => expect(store.getState().users.saveStatus).toBe('succeeded'))
    expect((await getUserById(person.id))?.birthDate).toBe('1995-10-28T00:00:00.000Z')
    expect(birth).toHaveValue('28.10.1995')
  })

  it('поздний ответ записи не сбрасывает редактор другого пользователя', async () => {
    const { user, store } = renderProfile()
    await user.clear(nameInput())
    await user.type(nameInput(), 'Пётр')
    await user.click(saveButton())
    await act(async () => {
      store.dispatch(startSession(other.id))
    })
    await user.clear(nameInput())
    await user.type(nameInput(), 'Новое имя')
    await waitFor(() => expect(store.getState().users.saveStatus).toBe('succeeded'))
    expect(nameInput()).toHaveValue('Новое имя')
    expect(saveButton()).toBeEnabled()
    expect((await getUserById(other.id))?.name).toBe(other.name)
  })
})
