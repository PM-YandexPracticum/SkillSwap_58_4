import { Modal } from './Modal'
import { render, screen, fireEvent } from '@testing-library/react'

describe('Modal', () => {
  test('рендерится, если isOpen={true}', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        контент
      </Modal>,
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
  test('не рендерится, если isOpen={false}', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        контент
      </Modal>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
  test('вызывает onClose при нажатии Esc', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose}>
        контент
      </Modal>,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalled()
  })
  test('вызывается onClose при нажатие на overlay', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose}>
        контент
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    fireEvent.click(dialog.parentElement!)

    expect(handleClose).toHaveBeenCalled()
  })
  test('onClose по окну не закрывает модалку', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose}>
        контент
      </Modal>,
    )
    const dialog = screen.getByRole('dialog')
    fireEvent.click(dialog)
    expect(handleClose).not.toHaveBeenCalled()
  })
})
