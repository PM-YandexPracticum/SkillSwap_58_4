import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FileDropzone } from './FileDropzone'

const hint = 'Перетащите или выберите изображения навыка'
const buttonLabel = 'Выбрать изображения'

/** Скрытый input и сама зона без роли — их ищем по `data-testid`, остальное — по роли и тексту */
function getInput() {
  return screen.getByTestId('filedropzone-input') as HTMLInputElement
}

describe('FileDropzone', () => {
  it('с множественным выбором input принимает несколько файлов', () => {
    render(<FileDropzone hint={hint} buttonLabel={buttonLabel} onFiles={() => {}} multiple />)
    const input = getInput()

    expect(screen.getByText(hint)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: buttonLabel })).toBeInTheDocument()
    expect(input.multiple).toBe(true)
  })

  it('без multiple input принимает один файл', () => {
    render(<FileDropzone hint={hint} buttonLabel={buttonLabel} onFiles={() => {}} />)
    const input = getInput()

    expect(input.multiple).toBe(false)
  })

  it('клик по зоне открывает диалог выбора файла', async () => {
    render(<FileDropzone hint={hint} buttonLabel={buttonLabel} onFiles={() => {}} />)

    const clickSpy = vi.spyOn(getInput(), 'click')
    await userEvent.click(screen.getByTestId('filedropzone-zone'))

    expect(clickSpy).toHaveBeenCalledTimes(1)
  })

  it('клик по кнопке открывает диалог один раз, без дубля от зоны', async () => {
    render(<FileDropzone hint={hint} buttonLabel={buttonLabel} onFiles={() => {}} />)

    const clickSpy = vi.spyOn(getInput(), 'click')
    await userEvent.click(screen.getByRole('button', { name: buttonLabel }))

    expect(clickSpy).toHaveBeenCalledTimes(1)
  })

  it('передаёт выбранный файл в onFiles и сбрасывает input', async () => {
    const onFiles = vi.fn()
    render(<FileDropzone hint={hint} buttonLabel={buttonLabel} onFiles={onFiles} />)

    const file = new File(['hello'], 'skill.png', { type: 'image/png' })

    await userEvent.upload(getInput(), file)

    expect(onFiles).toHaveBeenCalledTimes(1)
    expect(onFiles.mock.calls[0][0]).toEqual([file])
    expect(getInput().value).toBe('')
  })

  it('подсвечивает зону при перетаскивании и снимает при drop', async () => {
    const onFiles = vi.fn()
    render(<FileDropzone hint={hint} buttonLabel={buttonLabel} onFiles={onFiles} />)

    const zone = screen.getByTestId('filedropzone-zone')

    fireEvent.dragEnter(zone)
    expect(zone.className).toContain('dragging')

    fireEvent.drop(zone, {
      dataTransfer: { files: [new File(['x'], 'a.png', { type: 'image/png' })] },
    })

    expect(zone.className).not.toContain('dragging')
    expect(onFiles).toHaveBeenCalledTimes(1)
  })

  it('в состоянии disabled не открывает диалог и не принимает файлы', () => {
    const onFiles = vi.fn()
    render(<FileDropzone hint={hint} buttonLabel={buttonLabel} onFiles={onFiles} disabled />)

    const zone = screen.getByTestId('filedropzone-zone')
    const clickSpy = vi.spyOn(getInput(), 'click')

    fireEvent.click(zone)
    expect(clickSpy).not.toHaveBeenCalled()

    fireEvent.dragEnter(zone)
    expect(zone.className).not.toContain('dragging')

    fireEvent.drop(zone, {
      dataTransfer: { files: [new File(['x'], 'a.png', { type: 'image/png' })] },
    })
    expect(onFiles).not.toHaveBeenCalled()
  })

  it('показывает превью и удаляет его по крестику', async () => {
    const onRemove = vi.fn()
    render(
      <FileDropzone
        hint={hint}
        buttonLabel={buttonLabel}
        onFiles={() => {}}
        previews={[{ url: '/img/1.jpg', onRemove }]}
      />,
    )

    expect(screen.getByRole('img', { name: 'Фото 1' })).toHaveAttribute('src', '/img/1.jpg')

    await userEvent.click(screen.getByRole('button', { name: 'Удалить фото 1' }))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('при отключённом выборе оставляет удаление превью доступным', async () => {
    const onRemove = vi.fn()
    const onFiles = vi.fn()
    render(
      <FileDropzone
        hint={hint}
        buttonLabel={buttonLabel}
        onFiles={onFiles}
        uploadDisabled
        previews={[{ url: '/img/1.jpg', onRemove }]}
      />,
    )

    expect(screen.getByRole('button', { name: buttonLabel })).toBeDisabled()
    expect(screen.getByTestId('filedropzone-zone')).toHaveAttribute('aria-disabled', 'true')
    fireEvent.drop(screen.getByTestId('filedropzone-zone'), {
      dataTransfer: { files: [new File(['x'], 'a.png', { type: 'image/png' })] },
    })
    expect(onFiles).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'Удалить фото 1' }))
    expect(onRemove).toHaveBeenCalledOnce()
  })

  it('полная блокировка запрещает также удаление превью', async () => {
    const onRemove = vi.fn()
    render(
      <FileDropzone
        hint={hint}
        buttonLabel={buttonLabel}
        onFiles={() => {}}
        disabled
        previews={[{ url: '/img/1.jpg', onRemove }]}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Удалить фото 1' }))
    expect(onRemove).not.toHaveBeenCalled()
  })

  it('показывает текст ошибки', () => {
    render(
      <FileDropzone
        hint={hint}
        buttonLabel={buttonLabel}
        onFiles={() => {}}
        error="Файл больше 1 МБ"
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Файл больше 1 МБ')
  })
})
