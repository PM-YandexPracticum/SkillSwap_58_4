import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { CATALOG } from '@/shared/config'
import { CityFilter } from './CityFilter'

const cities = Array.from({ length: CATALOG.CITIES_VISIBLE + 1 }, (_, index) => ({
  id: `city-${index}`,
  name: `Город ${index + 1}`,
}))

describe('CityFilter', () => {
  it.each([0, 1, CATALOG.CITIES_VISIBLE])('не показывает раскрытие для %i городов', (count) => {
    render(<CityFilter cities={cities.slice(0, count)} />)
    expect(screen.queryAllByRole('checkbox')).toHaveLength(count)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('показывает первые города и раскрывает остальные с клавиатуры', async () => {
    const user = userEvent.setup()
    render(<CityFilter cities={cities} />)
    expect(screen.getAllByRole('checkbox')).toHaveLength(CATALOG.CITIES_VISIBLE)
    const button = screen.getByRole('button', { name: 'Все города' })
    button.focus()
    await user.keyboard('{Enter}')
    expect(screen.getAllByRole('checkbox')).toHaveLength(cities.length)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(document.getElementById(button.getAttribute('aria-controls')!)).toBeVisible()
  })

  it('сохраняет выбор скрытого города после сворачивания и снимает его повторным кликом', async () => {
    const user = userEvent.setup()
    render(<CityFilter cities={cities} />)
    await user.click(screen.getByRole('button', { name: 'Все города' }))
    const name = cities.at(-1)!.name
    await user.click(screen.getByRole('checkbox', { name }))
    await user.click(screen.getByRole('button', { name: 'Свернуть города' }))
    expect(screen.queryByRole('checkbox', { name })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Все города' }))
    expect(screen.getByRole('checkbox', { name })).toBeChecked()
    await user.click(screen.getByRole('checkbox', { name }))
    expect(screen.getByRole('checkbox', { name })).not.toBeChecked()
  })

  it('отображает справочник, который появился после пустого состояния', () => {
    const { rerender } = render(<CityFilter cities={[]} />)
    rerender(<CityFilter cities={cities} />)
    expect(screen.getByRole('checkbox', { name: cities[0].name })).toBeInTheDocument()
  })
})
