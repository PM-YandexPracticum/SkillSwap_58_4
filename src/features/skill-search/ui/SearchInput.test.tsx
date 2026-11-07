import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SearchInput } from './SearchInput'

const getField = () => screen.getByRole('textbox', { name: 'Искать навык' })

describe('SearchInput', () => {
  it('показывает пустое поле с подсказкой и без крестика', () => {
    render(<SearchInput />)

    expect(getField()).toHaveAttribute('placeholder', 'Искать навык')
    expect(screen.queryByRole('button', { name: 'Очистить поиск' })).not.toBeInTheDocument()
  })

  it('запускает поиск по Enter, обрезая пробелы', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<SearchInput onSearch={onSearch} />)

    await user.type(getField(), '  Гитара {Enter}')

    expect(onSearch).toHaveBeenCalledWith('Гитара')
  })

  it('запускает поиск по клику на лупу', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<SearchInput onSearch={onSearch} />)

    await user.type(getField(), 'Йога')
    await user.click(screen.getByRole('button', { name: 'Искать' }))

    expect(onSearch).toHaveBeenCalledWith('Йога')
  })

  it('крестик появляется вместе с текстом и очищает поле', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<SearchInput onClear={onClear} />)

    await user.type(getField(), 'Йога')
    await user.click(screen.getByRole('button', { name: 'Очистить поиск' }))

    expect(getField()).toHaveValue('')
    expect(getField()).toHaveFocus()
    expect(onClear).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('button', { name: 'Очистить поиск' })).not.toBeInTheDocument()
  })

  it('показывает начальный текст из defaultValue', () => {
    render(<SearchInput defaultValue="Гитара" />)

    expect(getField()).toHaveValue('Гитара')
  })
})
