import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import { GenderFilter } from './GenderFilter'

describe('GenderFilter', () => {
  it('изначально выбирает «Не имеет значения» и сбрасывает пол к null', async () => {
    const { user, store } = renderWithProviders(<GenderFilter />)
    expect(screen.getByRole('radio', { name: 'Не имеет значения' })).toBeChecked()
    await user.click(screen.getByRole('radio', { name: 'Женский' }))
    expect(store.getState().catalogFilter.gender).toBe('female')
    await user.click(screen.getByRole('radio', { name: 'Не имеет значения' }))
    expect(store.getState().catalogFilter.gender).toBeNull()
  })
})
