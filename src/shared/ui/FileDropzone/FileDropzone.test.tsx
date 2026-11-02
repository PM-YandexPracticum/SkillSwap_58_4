import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FileDropzone } from './FileDropzone'

const hint = 'Перетащите или выберите изображения навыка'
const buttonLabel = 'Выбрать изображения'

/** Функция - хэлпер для получения input */
function getInput() {
  return screen.getByTestId('filedropzone-input') as HTMLInputElement
}

describe('FileDropzone', () => {
  it('с множественным выбором input принимает несколько файлов', () => {
    render(<FileDropzone hint={hint} buttonLabel={buttonLabel} onFiles={() => {}} multiple />)
    const input = getInput()

    expect(screen.getByText(hint)).toBeInTheDocument()
    expect(screen.getByTestId('filedropzone-button')).toHaveTextContent(buttonLabel)
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
    await userEvent.click(screen.getByTestId('filedropzone-button'))

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

    const previews = screen.getAllByTestId('filedropzone-preview')
    expect(previews).toHaveLength(1)

    const img = previews[0].querySelector('img') as HTMLImageElement
    expect(img.src).toContain('/img/1.jpg')

    await userEvent.click(screen.getByTestId('filedropzone-preview-remove'))
    expect(onRemove).toHaveBeenCalledTimes(1)
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

    expect(screen.getByTestId('filedropzone-error')).toHaveTextContent('Файл больше 1 МБ')
  })
})
