import { act, fireEvent, screen, waitFor } from '@testing-library/react'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { createCategory } from '@/entities/category/testing'
import { SkillForm, type SkillFormProps } from './SkillForm'

// Настоящий fileToDataUrl сжимает картинку через canvas, которого в jsdom нет
const fileToDataUrlMock = vi.hoisted(() =>
  vi.fn(async (file: File) => `data:image/png;base64,${file.name}`),
)

vi.mock('@/shared/lib/image', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/lib/image')>()),
  fileToDataUrl: fileToDataUrlMock,
}))

const preloadedState = {
  categories: { items: [createCategory()], status: 'succeeded' as const },
}

const originalScrollIntoView = Element.prototype.scrollIntoView

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  Element.prototype.scrollIntoView = originalScrollIntoView
})

function renderForm(props: Partial<SkillFormProps> = {}) {
  return renderWithProviders(<SkillForm onSubmit={vi.fn()} onBack={vi.fn()} {...props} />, {
    preloadedState,
  })
}

const image = (name: string) => new File(['x'], name, { type: 'image/png' })
const getInput = () => screen.getByTestId('filedropzone-input') as HTMLInputElement

describe('SkillForm', () => {
  beforeEach(() => {
    fileToDataUrlMock.mockClear()
  })

  it('не отправляет пустую форму и показывает ошибки обязательных полей', async () => {
    const onSubmit = vi.fn()
    const { user } = renderForm({ onSubmit })

    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByText('Введите название навыка')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Категория навыка' })).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    expect(screen.getByText('Опишите навык')).toBeInTheDocument()
  })

  it('проверяет обязательное фото после проверки остальных полей', async () => {
    const { user } = renderForm()

    await user.type(screen.getByLabelText('Название навыка'), 'Игра на барабанах')
    await user.click(screen.getByLabelText('Категория навыка'))
    await user.click(screen.getByText('Бизнес и карьера'))
    await user.click(screen.getByLabelText('Подкатегория навыка'))
    await user.click(screen.getByText('Управление командой'))
    await user.type(screen.getByLabelText('Описание'), 'Научу основам техники')
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Добавьте от 1 до 4 фото')
  })

  it('не принимает подкатегорию, которой нет в выбранной категории', async () => {
    const { user } = renderForm({
      defaultValues: {
        title: 'Игра на барабанах',
        categoryId: 'business',
        subcategoryId: 'unknown-subcategory',
        description: 'Научу основам техники',
      },
    })

    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Выберите подкатегорию')
  })

  it('не передаёт неподдерживаемый файл в обработку', async () => {
    renderForm()

    fireEvent.change(getInput(), {
      target: { files: [new File(['x'], 'photo.gif', { type: 'image/gif' })] },
    })

    expect(await screen.findByRole('alert')).toHaveTextContent('Только JPG, PNG или WEBP')
    expect(screen.queryByAltText('Фото 1')).not.toBeInTheDocument()
    expect(fileToDataUrlMock).not.toHaveBeenCalled()
  })

  it('показывает все поля шага, зону фото и обе кнопки', () => {
    renderForm()

    expect(screen.getByLabelText('Название навыка')).toBeInTheDocument()
    expect(screen.getByLabelText('Категория навыка')).toBeInTheDocument()
    expect(screen.getByLabelText('Подкатегория навыка')).toBeInTheDocument()
    expect(screen.getByLabelText('Описание')).toBeInTheDocument()
    expect(screen.getByText('Перетащите или выберите изображения навыка')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Выбрать изображения' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Назад' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeInTheDocument()
  })

  it('подставляет defaultValues', () => {
    renderForm({ defaultValues: { title: 'Игра на барабанах', description: 'Научу основам' } })

    expect(screen.getByLabelText('Название навыка')).toHaveValue('Игра на барабанах')
    expect(screen.getByLabelText('Описание')).toHaveValue('Научу основам')
  })

  it('«Продолжить» отдаёт введённые значения и фото как data URL', async () => {
    const onSubmit = vi.fn()
    const { user } = renderForm({ onSubmit })

    await user.type(screen.getByLabelText('Название навыка'), 'Игра на барабанах')
    await user.click(screen.getByLabelText('Категория навыка'))
    await user.click(screen.getByText('Бизнес и карьера'))
    await user.click(screen.getByLabelText('Подкатегория навыка'))
    await user.click(screen.getByText('Управление командой'))
    await user.type(screen.getByLabelText('Описание'), 'Научу основам техники')
    await user.upload(getInput(), image('drums.png'))
    await screen.findByAltText('Фото 1')
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit).toHaveBeenCalledWith(
      {
        title: 'Игра на барабанах',
        categoryId: 'business',
        subcategoryId: 'business-management',
        description: 'Научу основам техники',
      },
      ['data:image/png;base64,drums.png'],
    )
  })

  it('показывает превью выбранных фото и убирает фото по крестику', async () => {
    const { user } = renderForm()

    await user.upload(getInput(), [image('a.png'), image('b.png')])
    expect(await screen.findByAltText('Фото 2')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Удалить фото 1' }))

    expect(screen.queryByAltText('Фото 2')).not.toBeInTheDocument()
    expect(screen.getByAltText('Фото 1')).toHaveAttribute('src', 'data:image/png;base64,b.png')
  })

  it('принимает не больше четырёх фото и после этого блокирует выбор', async () => {
    const { user } = renderForm()

    await user.upload(
      getInput(),
      Array.from({ length: 5 }, (_, i) => image(`${i}.png`)),
    )

    expect(await screen.findAllByRole('button', { name: /^Удалить фото/ })).toHaveLength(4)
    expect(screen.getByRole('button', { name: 'Выбрать изображения' })).toBeDisabled()
  })

  it('после удаления фото позволяет выбрать замену', async () => {
    const { user } = renderForm()

    await user.upload(
      getInput(),
      Array.from({ length: 4 }, (_, i) => image(`${i}.png`)),
    )
    expect(await screen.findAllByRole('button', { name: /^Удалить фото/ })).toHaveLength(4)

    await user.click(screen.getByRole('button', { name: 'Удалить фото 2' }))
    expect(screen.getByRole('button', { name: 'Выбрать изображения' })).not.toBeDisabled()

    await user.upload(getInput(), image('replacement.png'))
    await screen.findByAltText('Фото 4')
    expect(screen.getAllByRole('button', { name: /^Удалить фото/ })).toHaveLength(4)
    expect(screen.getByAltText('Фото 4')).toHaveAttribute(
      'src',
      'data:image/png;base64,replacement.png',
    )
  })

  it('блокирует отправку, пока выбранные фото читаются', async () => {
    const { user } = renderForm()
    let resolveFile: (value: string) => void = () => {}
    fileToDataUrlMock.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFile = resolve
      }),
    )

    await user.upload(getInput(), image('pending.png'))
    const submit = screen.getByRole('button', { name: 'Продолжить' })
    expect(submit).toBeDisabled()

    await act(async () => resolveFile('data:image/png;base64,pending.png'))
    await waitFor(() => expect(submit).not.toBeDisabled())
  })

  it('«Назад» вызывает onBack и ничего не отправляет', async () => {
    const onBack = vi.fn()
    const onSubmit = vi.fn()
    const { user } = renderForm({ onBack, onSubmit })

    await user.click(screen.getByRole('button', { name: 'Назад' }))

    expect(onBack).toHaveBeenCalledOnce()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('не добавляет одно и то же фото дважды', async () => {
    const { user } = renderForm()

    await user.upload(getInput(), image('a.png'))
    await screen.findByAltText('Фото 1')
    await user.upload(getInput(), image('a.png'))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Продолжить' })).not.toBeDisabled(),
    )

    expect(screen.getAllByRole('button', { name: /^Удалить фото/ })).toHaveLength(1)
  })

  it('при ошибке чтения сохраняет остальные фото и позволяет повторить выбор', async () => {
    fileToDataUrlMock.mockRejectedValueOnce(new Error('Техническая ошибка'))
    const { user } = renderForm()

    await user.upload(getInput(), [image('broken.png'), image('valid.png')])

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Не удалось обработать часть изображений',
    )
    expect(screen.getByAltText('Фото 1')).toHaveAttribute('src', 'data:image/png;base64,valid.png')
    expect(screen.getByRole('button', { name: 'Продолжить' })).not.toBeDisabled()

    await user.upload(getInput(), image('retry.png'))
    expect(await screen.findByAltText('Фото 2')).toHaveAttribute(
      'src',
      'data:image/png;base64,retry.png',
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('не читает лишние файлы сверх оставшегося лимита', async () => {
    const { user } = renderForm()
    await user.upload(
      getInput(),
      Array.from({ length: 6 }, (_, i) => image(`${i}.png`)),
    )
    await screen.findByAltText('Фото 4')
    expect(fileToDataUrlMock).toHaveBeenCalledTimes(4)
  })

  it('не отправляет форму через Enter до завершения обработки фото', async () => {
    const onSubmit = vi.fn()
    let resolveFile: (value: string) => void = () => {}
    fileToDataUrlMock.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFile = resolve
      }),
    )
    const { user } = renderForm({ onSubmit })
    await user.type(screen.getByLabelText('Название навыка'), 'Игра на барабанах')
    await user.click(screen.getByLabelText('Категория навыка'))
    await user.click(screen.getByText('Бизнес и карьера'))
    await user.click(screen.getByLabelText('Подкатегория навыка'))
    await user.click(screen.getByText('Управление командой'))
    await user.type(screen.getByLabelText('Описание'), 'Научу основам техники')
    await user.upload(getInput(), image('pending.png'))

    fireEvent.submit(screen.getByRole('form', { name: 'Укажите, чем вы готовы поделиться' }))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByRole('status')).toHaveTextContent('Обрабатываем изображения')

    await act(async () => resolveFile('data:image/png;base64,pending.png'))
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))
    expect(onSubmit).toHaveBeenCalledWith(expect.any(Object), ['data:image/png;base64,pending.png'])
  })
})
