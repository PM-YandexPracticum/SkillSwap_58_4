import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

import { Modal } from './Modal'

/** Кнопка открывает окно, внутри — поле и две кнопки. onClose передаётся прямо в разметке, как обычно пишут в приложении */
function Example() {
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('')
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Открыть
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} ariaLabel="Ваше предложение">
        <input
          aria-label="Название"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <button type="button">Редактировать</button>
        <button type="button" disabled>
          Недоступно
        </button>
        <button type="button" onClick={() => setIsOpen(false)}>
          Готово
        </button>
      </Modal>
    </>
  )
}

async function openExample() {
  const user = userEvent.setup()
  render(<Example />)
  await user.click(screen.getByRole('button', { name: 'Открыть' }))
  return user
}

describe('Modal', () => {
  it('открыт — диалог с подписью для скринридера, закрыт — ничего', () => {
    const { rerender } = render(
      <Modal isOpen onClose={() => {}} ariaLabel="Вы предложили обмен">
        контент
      </Modal>,
    )
    expect(screen.getByRole('dialog', { name: 'Вы предложили обмен' })).toBeInTheDocument()

    rerender(
      <Modal isOpen={false} onClose={() => {}} ariaLabel="Вы предложили обмен">
        контент
      </Modal>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('Esc закрывает окно и возвращает фокус на кнопку, которая его открыла', async () => {
    const user = await openExample()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Открыть' })).toHaveFocus()
  })

  it('клик по фону закрывает окно, клик по окну — нет', async () => {
    const user = await openExample()
    const dialog = screen.getByRole('dialog')

    await user.click(dialog)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(dialog.parentElement as HTMLElement)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('выделение текста, начатое в окне и отпущенное на фоне, окно не закрывает', async () => {
    await openExample()
    const dialog = screen.getByRole('dialog')
    const overlay = dialog.parentElement as HTMLElement

    fireEvent.mouseDown(dialog)
    fireEvent.mouseUp(overlay)
    fireEvent.click(overlay)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('в поле внутри окна можно печатать — перерисовка родителя не сбивает фокус', async () => {
    const user = await openExample()

    await user.click(screen.getByRole('textbox', { name: 'Название' }))
    await user.keyboard('Игра на барабанах')

    expect(screen.getByRole('textbox', { name: 'Название' })).toHaveValue('Игра на барабанах')
    expect(screen.getByRole('textbox', { name: 'Название' })).toHaveFocus()
  })

  it('Tab ходит по кругу внутри окна и пропускает отключённые кнопки', async () => {
    const user = await openExample()

    await user.tab()
    expect(screen.getByRole('textbox', { name: 'Название' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Редактировать' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Готово' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('textbox', { name: 'Название' })).toHaveFocus()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Готово' })).toHaveFocus()
  })

  it('пока окно открыто, страница под ним не прокручивается; после закрытия — снова можно', async () => {
    document.body.style.overflow = 'auto'
    const user = await openExample()

    expect(document.body.style.overflow).toBe('hidden')

    await user.keyboard('{Escape}')
    expect(document.body.style.overflow).toBe('auto')
  })
})
