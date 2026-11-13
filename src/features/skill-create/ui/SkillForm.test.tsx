import { fireEvent, screen } from '@testing-library/react'

import { renderWithProviders } from '@/app/test/renderWithProviders'
import { createCategory } from '@/entities/category/testing'
import { SkillForm, type SkillFormProps } from './SkillForm'

// Настоящий fileToDataUrl сжимает картинку через canvas, которого в jsdom нет
vi.mock('@/shared/lib/image', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/lib/image')>()),
  fileToDataUrl: vi.fn(async (file: File) => `data:image/png;base64,${file.name}`),
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
const addFiles = (...files: File[]) => fireEvent.change(getInput(), { target: { files } })

describe('SkillForm', () => {
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
    addFiles(image('drums.png'))
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

    addFiles(image('a.png'), image('b.png'))
    expect(await screen.findByAltText('Фото 2')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Удалить фото 1' }))

    expect(screen.queryByAltText('Фото 2')).not.toBeInTheDocument()
    expect(screen.getByAltText('Фото 1')).toHaveAttribute('src', 'data:image/png;base64,b.png')
  })

  it('принимает не больше четырёх фото и после этого блокирует выбор', async () => {
    renderForm()

    addFiles(...Array.from({ length: 5 }, (_, i) => image(`${i}.png`)))

    expect(await screen.findAllByRole('button', { name: /^Удалить фото/ })).toHaveLength(4)
    expect(screen.getByRole('button', { name: 'Выбрать изображения' })).toBeDisabled()
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
    renderForm()

    addFiles(image('a.png'))
    await screen.findByAltText('Фото 1')
    addFiles(image('a.png'))

    expect(screen.getAllByRole('button', { name: /^Удалить фото/ })).toHaveLength(1)
  })
})
