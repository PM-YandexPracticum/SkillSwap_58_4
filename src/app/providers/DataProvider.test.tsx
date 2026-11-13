import { act, screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { createTestStore } from '@/app/test/createTestStore'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import { fetchCategories } from '@/entities/category'
import { fetchCities } from '@/entities/city'
import { createNewUser, fetchUsers, selectUsersSaveError } from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { createNewSkill, fetchSkills, selectSkillsSaveError } from '@/entities/skill'
import { createSkill } from '@/entities/skill/testing'
import { DATA_ERRORS, ROUTES } from '@/shared/config'
import { DataProvider } from './DataProvider'

afterEach(() => vi.restoreAllMocks())

describe('DataProvider — сохранение после стартовой загрузки', () => {
  it.each([
    ['пользователя', false],
    ['пользователя', true],
    ['навыка', false],
    ['навыка', true],
  ] as const)(
    'сохранение %s, ошибка=%s: не размонтирует форму и не открывает 500',
    async (entity, fails) => {
      const store = createTestStore()
      store.dispatch(fetchUsers.fulfilled([], 'users'))
      store.dispatch(fetchSkills.fulfilled([], 'skills'))
      store.dispatch(fetchCategories.fulfilled([], 'categories'))
      store.dispatch(fetchCities.fulfilled([], 'cities'))
      const { user } = renderWithProviders(
        <Routes>
          <Route element={<DataProvider />}>
            <Route path="/" element={<input aria-label="Имя" />} />
          </Route>
          <Route path={ROUTES.SERVER_ERROR} element={<h1>Ошибка 500</h1>} />
        </Routes>,
        { store },
      )
      const input = screen.getByRole('textbox', { name: 'Имя' })
      await user.type(input, 'Несохранённый текст')
      if (fails) {
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
          throw new DOMException('quota details', 'QuotaExceededError')
        })
      }
      let request: Promise<unknown>
      act(() => {
        request =
          entity === 'пользователя'
            ? store.dispatch(createNewUser(createUser()))
            : store.dispatch(createNewSkill(createSkill()))
      })
      expect(screen.getByRole('textbox', { name: 'Имя' })).toBe(input)
      expect(input).toHaveValue('Несохранённый текст')
      await act(async () => {
        await request
      })
      expect(screen.getByRole('textbox', { name: 'Имя' })).toBe(input)
      expect(input).toHaveValue('Несохранённый текст')
      expect(screen.queryByRole('heading', { name: 'Ошибка 500' })).not.toBeInTheDocument()
      expect(screen.queryByRole('status', { name: 'Загрузка' })).not.toBeInTheDocument()
      const getError = entity === 'пользователя' ? selectUsersSaveError : selectSkillsSaveError
      expect(getError(store.getState())).toBe(fails ? DATA_ERRORS.STORAGE_FULL : null)
    },
  )
})
