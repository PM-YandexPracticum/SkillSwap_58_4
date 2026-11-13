import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect } from 'react'

const carouselScrollTo = vi.hoisted(() => vi.fn())

import { SkillPreviewModal, type SkillPreviewModalProps } from './SkillPreviewModal'

// Мок Carousel: рендерит слайды как есть
vi.mock('@/shared/ui/Carousel', () => ({
  Carousel: ({
    children,
    onApiReady,
  }: {
    children: React.ReactNode
    onApiReady?: (api: { scrollTo: (index: number) => void }) => void
  }) => {
    useEffect(() => onApiReady?.({ scrollTo: carouselScrollTo }), [onApiReady])
    return <div data-testid="carousel">{children}</div>
  },
}))

const props: SkillPreviewModalProps = {
  isOpen: true,
  skill: {
    title: 'Рисование акварелью',
    description: 'Научу основам рисунка и работе с любимыми материалами',
    categoryTitle: 'Творчество и искусство',
    subcategoryTitle: 'Рисование и иллюстрации',
  },
  images: ['blob:one', 'blob:two', 'blob:three'],
  onEdit: () => {},
  onConfirm: () => {},
}

describe('SkillPreviewModal', () => {
  beforeEach(() => {
    carouselScrollTo.mockClear()
  })

  it('показывает заголовок, подсказку, данные навыка и обе кнопки', () => {
    render(<SkillPreviewModal {...props} />)

    const dialog = screen.getByRole('dialog', { name: 'Ваше предложение' })
    expect(within(dialog).getByRole('heading', { name: 'Ваше предложение' })).toBeInTheDocument()
    expect(
      within(dialog).getByText('Пожалуйста, проверьте и подтвердите правильность данных'),
    ).toBeInTheDocument()
    expect(within(dialog).getByRole('heading', { name: 'Рисование акварелью' })).toBeInTheDocument()
    expect(
      within(dialog).getByText('Творчество и искусство / Рисование и иллюстрации'),
    ).toBeInTheDocument()
    expect(
      within(dialog).getByText('Научу основам рисунка и работе с любимыми материалами'),
    ).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Редактировать' })).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Готово' })).toBeInTheDocument()
  })

  it('несколько фото — карусель со всеми слайдами и колонка мини-превью', () => {
    render(<SkillPreviewModal {...props} />)

    const carousel = screen.getByTestId('carousel')
    expect(within(carousel).getAllByRole('img')).toHaveLength(3)
    expect(screen.getByAltText('Рисование акварелью — фото 1')).toHaveAttribute('src', 'blob:one')
    expect(screen.getAllByRole('button', { name: /^Показать фото/ })).toHaveLength(3)
    expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument()
  })

  it('больше трёх фото — на третьем мини-превью остаток «+N»', () => {
    render(<SkillPreviewModal {...props} images={['blob:1', 'blob:2', 'blob:3', 'blob:4']} />)

    expect(screen.getAllByRole('button', { name: /^Показать фото/ })).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Показать фото 3, ещё 1 фото' })).toHaveTextContent(
      '+1',
    )
    expect(within(screen.getByTestId('carousel')).getAllByRole('img')).toHaveLength(4)
  })

  it('одно фото — без карусели и без мини-превью', () => {
    render(<SkillPreviewModal {...props} images={['blob:one']} />)

    expect(screen.queryByTestId('carousel')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Показать фото/ })).not.toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(1)
  })

  it('без фото галереи нет, пустая категория не оставляет « / »', () => {
    render(
      <SkillPreviewModal
        {...props}
        images={[]}
        skill={{ ...props.skill, categoryTitle: '', subcategoryTitle: '' }}
      />,
    )

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.queryByText('/')).not.toBeInTheDocument()
  })

  it('только подкатегория показывается без « / »', () => {
    render(<SkillPreviewModal {...props} skill={{ ...props.skill, categoryTitle: '' }} />)

    expect(screen.getByText('Рисование и иллюстрации')).toBeInTheDocument()
  })

  it('закрыто — ничего не показывает', () => {
    render(<SkillPreviewModal {...props} isOpen={false} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('«Редактировать» и Esc вызывают onEdit, «Готово» — onConfirm', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const onConfirm = vi.fn()
    render(<SkillPreviewModal {...props} onEdit={onEdit} onConfirm={onConfirm} />)

    await user.click(screen.getByRole('button', { name: 'Редактировать' }))
    await user.keyboard('{Escape}')
    expect(onEdit).toHaveBeenCalledTimes(2)
    expect(onConfirm).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Готово' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('переключает карусель по клику на мини-превью', async () => {
    const user = userEvent.setup()
    render(<SkillPreviewModal {...props} />)

    await user.click(screen.getByRole('button', { name: 'Показать фото 2' }))

    expect(carouselScrollTo).toHaveBeenCalledWith(1)
  })
})
