import { act, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/app/test/renderWithProviders'
import { CATALOG } from '@/shared/config'
import { resetFilters, setMode, toggleCity } from '../model/catalogFilterSlice'
import { CityFilter } from './CityFilter'

const cities = Array.from({ length: CATALOG.CITIES_VISIBLE + 1 }, (_, index) => ({
  id: `city-${index}`,
  name: `Город ${index + 1}`,
}))

describe('CityFilter', () => {
  it.each([0, 1, CATALOG.CITIES_VISIBLE])('не показывает раскрытие для %i городов', (count) => {
    renderWithProviders(<CityFilter cities={cities.slice(0, count)} />)
    expect(screen.queryAllByRole('checkbox')).toHaveLength(count)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('показывает первые города и раскрывает остальные с клавиатуры', async () => {
    const { user } = renderWithProviders(<CityFilter cities={cities} />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(CATALOG.CITIES_VISIBLE)
    const button = screen.getByRole('button', { name: 'Все города' })
    button.focus()
    await user.keyboard('{Enter}')
    expect(screen.getAllByRole('checkbox')).toHaveLength(cities.length)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(document.getElementById(button.getAttribute('aria-controls')!)).toBeVisible()
  })

  it('пишет выбранный город в store и снимает его повторным кликом', async () => {
    const { user, store } = renderWithProviders(<CityFilter cities={cities} />)

    await user.click(screen.getByRole('checkbox', { name: cities[0].name }))
    expect(store.getState().catalogFilter.cityIds).toEqual([cities[0].id])
    expect(screen.getByRole('checkbox', { name: cities[0].name })).toBeChecked()

    await user.click(screen.getByRole('checkbox', { name: cities[0].name }))
    expect(store.getState().catalogFilter.cityIds).toEqual([])
    expect(screen.getByRole('checkbox', { name: cities[0].name })).not.toBeChecked()
  })

  it('сохраняет выбор скрытого города после сворачивания', async () => {
    const { user, store } = renderWithProviders(<CityFilter cities={cities} />)
    await user.click(screen.getByRole('button', { name: 'Все города' }))
    const hidden = cities.at(-1)!
    await user.click(screen.getByRole('checkbox', { name: hidden.name }))
    await user.click(screen.getByRole('button', { name: 'Свернуть города' }))
    expect(screen.queryByRole('checkbox', { name: hidden.name })).not.toBeInTheDocument()
    expect(store.getState().catalogFilter.cityIds).toEqual([hidden.id])
    await user.click(screen.getByRole('button', { name: 'Все города' }))
    expect(screen.getByRole('checkbox', { name: hidden.name })).toBeChecked()
  })

  it('отражает города из store и сбрасывается через resetFilters', async () => {
    const { store } = renderWithProviders(<CityFilter cities={cities} />)

    act(() => {
      store.dispatch(toggleCity(cities[0].id))
      store.dispatch(toggleCity(cities[1].id))
    })
    expect(screen.getByRole('checkbox', { name: cities[0].name })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: cities[1].name })).toBeChecked()

    act(() => {
      store.dispatch(resetFilters())
    })
    for (const city of cities.slice(0, CATALOG.CITIES_VISIBLE)) {
      expect(screen.getByRole('checkbox', { name: city.name })).not.toBeChecked()
    }
  })

  it('не сбрасывает выбранные города при переключении режима', async () => {
    const { user, store } = renderWithProviders(<CityFilter cities={cities} />)
    await user.click(screen.getByRole('checkbox', { name: cities[0].name }))
    act(() => {
      store.dispatch(setMode('learn'))
    })
    expect(screen.getByRole('checkbox', { name: cities[0].name })).toBeChecked()
    expect(store.getState().catalogFilter.cityIds).toEqual([cities[0].id])
  })

  it('отображает справочник, который появился после пустого состояния', () => {
    const { rerender } = renderWithProviders(<CityFilter cities={[]} />)
    rerender(<CityFilter cities={cities} />)
    expect(screen.getByRole('checkbox', { name: cities[0].name })).toBeInTheDocument()
  })
})
