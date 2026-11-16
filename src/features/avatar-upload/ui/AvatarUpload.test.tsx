import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { VALIDATION } from '@/shared/config'
import { fileToDataUrl } from '@/shared/lib/image'
import { AvatarUpload } from './AvatarUpload'

// Настоящий fileToDataUrl сжимает картинку через canvas, которого в jsdom нет
vi.mock('@/shared/lib/image', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/lib/image')>()),
  fileToDataUrl: vi.fn(async (file: File) => `data:image/png;base64,${file.name}`),
}))

const getInput = () => screen.getByTestId('avatar-upload-input') as HTMLInputElement
const pick = (file: File) => fireEvent.change(getInput(), { target: { files: [file] } })
const image = (name = 'me.png', type = 'image/png') => new File(['x'], name, { type })

afterEach(() => vi.clearAllMocks())

describe('AvatarUpload', () => {
  it('без фото показывает доступную кнопку добавления', () => {
    render(<AvatarUpload value={null} onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Добавить фото' })).toHaveAttribute('type', 'button')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('с фото кнопка называется «Изменить фото»', () => {
    render(<AvatarUpload value="/images/avatars/u01.jpg" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Изменить фото' })).toBeInTheDocument()
  })

  it('показывает переданное фото и меняет его при обновлении пропса', () => {
    const { rerender } = render(<AvatarUpload value="/images/avatars/u01.jpg" onChange={vi.fn()} />)
    expect(screen.getByRole('img', { name: 'Аватар пользователя' })).toHaveAttribute(
      'src',
      expect.stringContaining('u01.jpg'),
    )
    rerender(<AvatarUpload value="/images/avatars/u02.jpg" onChange={vi.fn()} />)
    expect(screen.getByRole('img', { name: 'Аватар пользователя' })).toHaveAttribute(
      'src',
      expect.stringContaining('u02.jpg'),
    )
  })

  it('кнопка открывает выбор файла, принимаются только jpg, png и webp', async () => {
    const click = vi.spyOn(HTMLInputElement.prototype, 'click')
    render(<AvatarUpload value={null} onChange={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Добавить фото' }))

    expect(click).toHaveBeenCalledOnce()
    expect(getInput()).toHaveAttribute('accept', 'image/jpeg,image/png,image/webp')
    click.mockRestore()
  })

  it('подходящий файл отдаёт готовый data URL', async () => {
    const onChange = vi.fn()
    render(<AvatarUpload value={null} onChange={onChange} />)

    pick(image('me.png'))

    await waitFor(() => expect(onChange).toHaveBeenCalledWith('data:image/png;base64,me.png'))
    expect(fileToDataUrl).toHaveBeenCalledOnce()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it.each(['image/jpeg', 'image/png', 'image/webp'])('принимает %s', async (type) => {
    const onChange = vi.fn()
    render(<AvatarUpload value={null} onChange={onChange} />)

    pick(image('me', type))

    await waitFor(() => expect(onChange).toHaveBeenCalledOnce())
  })

  it('не принимает файл неверного типа и не читает его', () => {
    const onChange = vi.fn()
    render(<AvatarUpload value={null} onChange={onChange} />)

    pick(image('doc.pdf', 'application/pdf'))

    expect(screen.getByRole('alert')).toHaveTextContent('Только JPG, PNG или WEBP')
    expect(onChange).not.toHaveBeenCalled()
    expect(fileToDataUrl).not.toHaveBeenCalled()
  })

  it('не принимает файл больше 1 МБ', () => {
    const onChange = vi.fn()
    render(<AvatarUpload value={null} onChange={onChange} />)

    pick(
      new File([new Uint8Array(VALIDATION.IMAGE.MAX_SIZE_BYTES + 1)], 'big.png', {
        type: 'image/png',
      }),
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Файл больше 1 МБ')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('связывает ошибку с кнопкой для скринридера', () => {
    render(<AvatarUpload value={null} onChange={vi.fn()} />)

    pick(image('doc.pdf', 'application/pdf'))

    expect(screen.getByRole('button', { name: 'Добавить фото' })).toHaveAccessibleDescription(
      'Только JPG, PNG или WEBP',
    )
  })

  it('убирает ошибку после выбора подходящего файла', async () => {
    const onChange = vi.fn()
    render(<AvatarUpload value={null} onChange={onChange} />)

    pick(image('doc.pdf', 'application/pdf'))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    pick(image('me.png'))

    await waitFor(() => expect(onChange).toHaveBeenCalledOnce())
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('понятно сообщает, если файл не удалось прочитать', async () => {
    vi.mocked(fileToDataUrl).mockRejectedValueOnce(new Error('broken'))
    const onChange = vi.fn()
    render(<AvatarUpload value={null} onChange={onChange} />)

    pick(image('me.png'))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Не удалось загрузить фото. Попробуйте другой файл',
    )
    expect(onChange).not.toHaveBeenCalled()
  })

  it('пока файл читается, кнопка недоступна', async () => {
    let resolve!: (value: string) => void
    vi.mocked(fileToDataUrl).mockImplementationOnce(
      () => new Promise<string>((done) => (resolve = done)),
    )
    render(<AvatarUpload value={null} onChange={vi.fn()} />)

    pick(image('me.png'))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Добавить фото' })).toBeDisabled())

    resolve('data:image/png;base64,me.png')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Добавить фото' })).toBeEnabled())
  })

  it('внешняя ошибка показывается, ошибка файла важнее неё', () => {
    render(<AvatarUpload value={null} onChange={vi.fn()} error="Загрузите фото" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Загрузите фото')

    pick(image('doc.pdf', 'application/pdf'))
    expect(screen.getByRole('alert')).toHaveTextContent('Только JPG, PNG или WEBP')
  })

  it('при disabled кнопка недоступна', () => {
    render(<AvatarUpload value={null} onChange={vi.fn()} disabled />)

    expect(screen.getByRole('button', { name: 'Добавить фото' })).toBeDisabled()
  })
})
