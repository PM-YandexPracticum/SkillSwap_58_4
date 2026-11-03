import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RadioGroup } from './RadioGroup'

const options = [
  { value: 'all', label: 'Всё' },
  { value: 'learn', label: 'Хочу научиться' },
  { value: 'teach', label: 'Могу научить' },
]

function Example({ disabled = false, disabledOption = false }) {
  const [value, setValue] = useState('all')
  return (
    <RadioGroup
      name="mode"
      label="Режим"
      options={options.map((option) => ({
        ...option,
        disabled: disabledOption && option.value === 'learn',
      }))}
      value={value}
      onChange={setValue}
      disabled={disabled}
    />
  )
}

describe('RadioGroup', () => {
  it('выбирает только один вариант по клику на подпись', async () => {
    const user = userEvent.setup()
    render(<Example />)
    expect(screen.getByRole('radiogroup', { name: 'Режим' })).toBeInTheDocument()
    await user.click(screen.getByText('Хочу научиться'))
    expect(screen.getByRole('radio', { name: 'Хочу научиться' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Всё' })).not.toBeChecked()
    expect(
      screen.getAllByRole('radio').filter((radio) => (radio as HTMLInputElement).checked),
    ).toHaveLength(1)
  })

  it.each(['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'])(
    'переключается %s и обходит варианты по кругу',
    async (key) => {
      const user = userEvent.setup()
      render(<Example />)
      await user.tab()
      expect(screen.getByRole('radio', { name: 'Всё' })).toHaveFocus()
      await user.keyboard(`{${key}}`)
      const nextLabel =
        key === 'ArrowRight' || key === 'ArrowDown' ? 'Хочу научиться' : 'Могу научить'
      expect(screen.getByRole('radio', { name: nextLabel })).toBeChecked()
      expect(screen.getByRole('radio', { name: nextLabel })).toHaveFocus()
      await user.keyboard(`{${key}}{${key}}`)
      expect(screen.getByRole('radio', { name: 'Всё' })).toBeChecked()
    },
  )

  it('занимает одну остановку Tab и выбирает вариант пробелом', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Example />
        <button>Далее</button>
      </>,
    )
    await user.tab()
    await user.keyboard('{ArrowRight}')
    await user.tab()
    expect(screen.getByRole('button')).toHaveFocus()
    await user.tab({ shift: true })
    expect(screen.getByRole('radio', { name: 'Хочу научиться' })).toHaveFocus()
    await user.keyboard(' ')
    expect(screen.getByRole('radio', { name: 'Хочу научиться' })).toBeChecked()
  })

  it('стрелки пропускают отключённый вариант', async () => {
    const user = userEvent.setup()
    render(<Example disabledOption />)
    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Могу научить' })).toBeChecked()
  })

  it('не меняет отключённую группу', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Example disabled />
        <button>Далее</button>
      </>,
    )
    await user.click(screen.getByText('Хочу научиться'))
    await user.tab()
    expect(screen.getByRole('button')).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'Всё' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Хочу научиться' })).toBeDisabled()
  })

  it('не затрагивает другую группу', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Example />
        <RadioGroup
          name="gender"
          label="Пол автора"
          options={[
            { value: 'any', label: 'Не имеет значения' },
            { value: 'female', label: 'Женский' },
          ]}
          value="any"
          onChange={() => {}}
        />
      </>,
    )
    await user.click(screen.getByText('Могу научить'))
    expect(screen.getByRole('radio', { name: 'Не имеет значения' })).toBeChecked()
  })

  it('связывает сообщение ошибки с группой', () => {
    render(
      <RadioGroup
        name="mode"
        label="Режим"
        options={options}
        value=""
        onChange={() => {}}
        error="Выберите вариант"
      />,
    )
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('radiogroup')).toHaveAccessibleDescription('Выберите вариант')
  })
})
