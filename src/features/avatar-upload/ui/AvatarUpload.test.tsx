import { act, render, screen, waitFor } from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import { VALIDATION } from '@/shared/config'
import { fileToDataUrl } from '@/shared/lib/image'
import { AvatarUpload } from './AvatarUpload'

// Настоящий fileToDataUrl сжимает картинку через canvas, которого в jsdom нет
vi.mock('@/shared/lib/image', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/lib/image')>()),
  fileToDataUrl: vi.fn(async (file: File) => `data:image/png;base64,${file.name}`),
}))

const getInput = () => screen.getByTestId('avatar-upload-input') as HTMLInputElement
const pick = (file: File) => userEvent.setup({ applyAccept: false }).upload(getInput(), file)
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

    await userEvent.setup().click(screen.getByRole('button', { name: 'Добавить фото' }))

    expect(click).toHaveBeenCalledOnce()
    expect(getInput()).toHaveAttribute('accept', 'image/jpeg,image/png,image/webp')
    click.mockRestore()
  })

  it('подходящий файл отдаёт готовый data URL', async () => {
    const onChange = vi.fn()
    render(<AvatarUpload value={null} onChange={onChange} />)

    await pick(image('me.png'))

    await waitFor(() => expect(onChange).toHaveBeenCalledWith('data:image/png;base64,me.png'))
    expect(fileToDataUrl).toHaveBeenCalledOnce()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it.each(['image/jpeg', 'image/png', 'image/webp'])('принимает %s', async (type) => {
    const onChange = vi.fn()
    render(<AvatarUpload value={null} onChange={onChange} />)

    await pick(image('me', type))

    await waitFor(() => expect(onChange).toHaveBeenCalledOnce())
  })

  it('не принимает файл неверного типа и не читает его', async () => {
    const onChange = vi.fn()
    render(<AvatarUpload value={null} onChange={onChange} />)

    await pick(image('doc.pdf', 'application/pdf'))

    expect(screen.getByRole('alert')).toHaveTextContent('Только JPG, PNG или WEBP')
    expect(onChange).not.toHaveBeenCalled()
    expect(fileToDataUrl).not.toHaveBeenCalled()
  })

  it('не принимает файл больше 1 МБ', async () => {
    const onChange = vi.fn()
    render(<AvatarUpload value={null} onChange={onChange} />)

    await pick(
      new File([new Uint8Array(VALIDATION.IMAGE.MAX_SIZE_BYTES + 1)], 'big.png', {
        type: 'image/png',
      }),
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Файл больше 1 МБ')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('связывает ошибку с кнопкой для скринридера', async () => {
    render(<AvatarUpload value={null} onChange={vi.fn()} />)

    await pick(image('doc.pdf', 'application/pdf'))

    expect(screen.getByRole('button', { name: 'Добавить фото' })).toHaveAccessibleDescription(
      'Только JPG, PNG или WEBP',
    )
  })

  it('убирает ошибку после выбора подходящего файла', async () => {
    const onChange = vi.fn()
    render(<AvatarUpload value={null} onChange={onChange} />)

    await pick(image('doc.pdf', 'application/pdf'))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    await pick(image('me.png'))

    await waitFor(() => expect(onChange).toHaveBeenCalledOnce())
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('понятно сообщает, если файл не удалось прочитать', async () => {
    vi.mocked(fileToDataUrl).mockRejectedValueOnce(new Error('broken'))
    const onChange = vi.fn()
    render(<AvatarUpload value={null} onChange={onChange} />)

    await pick(image('me.png'))

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

    await pick(image('me.png'))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Добавить фото' })).toBeDisabled(),
    )

    resolve('data:image/png;base64,me.png')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Добавить фото' })).toBeEnabled())
  })

  it('внешняя ошибка показывается, ошибка файла важнее неё', async () => {
    render(<AvatarUpload value={null} onChange={vi.fn()} error="Загрузите фото" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Загрузите фото')

    await pick(image('doc.pdf', 'application/pdf'))
    expect(screen.getByRole('alert')).toHaveTextContent('Только JPG, PNG или WEBP')
  })

  it('при disabled кнопка недоступна', () => {
    render(<AvatarUpload value={null} onChange={vi.fn()} disabled />)

    expect(screen.getByRole('button', { name: 'Добавить фото' })).toBeDisabled()
  })
  it.each(['успех', 'ошибка'])(
    'не вызывает callbacks после ухода со страницы: %s',
    async (outcome) => {
      let resolve!: (value: string) => void
      let reject!: (error: Error) => void
      vi.mocked(fileToDataUrl).mockImplementationOnce(
        () =>
          new Promise<string>((done, fail) => {
            resolve = done
            reject = fail
          }),
      )
      const onChange = vi.fn()
      const onProcessingChange = vi.fn()
      const { unmount } = render(
        <AvatarUpload value={null} onChange={onChange} onProcessingChange={onProcessingChange} />,
      )
      await pick(image())
      expect(onProcessingChange).toHaveBeenLastCalledWith(true)
      unmount()
      onProcessingChange.mockClear()
      await act(async () => {
        if (outcome === 'успех') resolve('data:image/png;base64,late')
        else reject(new Error('broken'))
      })
      expect(onChange).not.toHaveBeenCalled()
      expect(onProcessingChange).not.toHaveBeenCalled()
    },
  )

  it('сообщает форме о завершении чтения, включая ошибку', async () => {
    vi.mocked(fileToDataUrl).mockRejectedValueOnce(new Error('broken'))
    const onProcessingChange = vi.fn()
    render(<AvatarUpload value={null} onChange={vi.fn()} onProcessingChange={onProcessingChange} />)
    await pick(image())
    await screen.findByRole('alert')
    expect(onProcessingChange.mock.calls).toEqual([[true], [false]])
  })
  it('позволяет повторить выбор того же файла после ошибки чтения', async () => {
    vi.mocked(fileToDataUrl).mockRejectedValueOnce(new Error('broken'))
    const onChange = vi.fn()
    const user = userEvent.setup()
    const file = image()
    render(<AvatarUpload value="data:image/png;base64,saved" onChange={onChange} />)
    await user.upload(getInput(), file)
    await screen.findByRole('alert')
    expect(screen.getByRole('img', { name: 'Аватар пользователя' })).toHaveAttribute(
      'src',
      'data:image/png;base64,saved',
    )
    await user.upload(getInput(), file)
    await waitFor(() => expect(onChange).toHaveBeenCalledWith('data:image/png;base64,me.png'))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('профиль без фото показывает общую заглушку с подписью пользователя', () => {
    render(<AvatarUpload variant="profile" alt="Мария" value={null} onChange={vi.fn()} />)
    expect(screen.getByRole('img', { name: 'Мария' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Добавить фото' })).toBeInTheDocument()
  })
})
