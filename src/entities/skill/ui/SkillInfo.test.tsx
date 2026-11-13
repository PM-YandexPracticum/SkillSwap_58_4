import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, it, expect, vi } from 'vitest'

import { SkillInfo, type SkillInfoProps } from './SkillInfo'

// Мок Carousel: рендерит children как есть и не требует Embla/DOM-измерений
vi.mock('@/shared/ui/Carousel', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel">{children}</div>
  ),
}))

const mockSkill: SkillInfoProps['skill'] = {
  title: 'Игра на барабанах',
  description: 'Научу основам техники и импровизации',
  images: [
    '/images/skills/s01-1.jpg',
    '/images/skills/s01-2.jpg',
    '/images/skills/s01-3.jpg',
    '/images/skills/s01-4.jpg',
  ],
}

const defaultProps: SkillInfoProps = {
  skill: mockSkill,
  categoryTitle: 'Творчество и искусство',
  subcategoryTitle: 'Музыка и звук',
}

describe('SkillInfo', () => {
  afterEach(() => vi.unstubAllEnvs())

  it.each([1, 4])('называет каждое фото навыка, когда снимков %i', (count) => {
    render(
      <SkillInfo
        {...defaultProps}
        skill={{ ...mockSkill, images: mockSkill.images.slice(0, count) }}
      />,
    )
    const photos = screen.getAllByRole('img')
    expect(photos).toHaveLength(count)
    photos.forEach((photo, index) => {
      expect(photo).toHaveAccessibleName(`${mockSkill.title} — фото ${index + 1}`)
    })
  })

  it('учитывает подпуть сайта у главных фотографий и превью', () => {
    vi.stubEnv('BASE_URL', '/skillswap/')
    render(<SkillInfo {...defaultProps} />)
    expect(screen.getByRole('img', { name: `${mockSkill.title} — фото 1` })).toHaveAttribute(
      'src',
      '/skillswap/images/skills/s01-1.jpg',
    )
    expect(
      screen.getByRole('button', { name: 'Показать фото 1' }).querySelector('img'),
    ).toHaveAttribute('src', '/skillswap/images/skills/s01-1.jpg')
  })

  it('отображает название навыка', () => {
    render(<SkillInfo {...defaultProps} />)
    expect(screen.getByRole('heading', { name: mockSkill.title })).toBeInTheDocument()
  })

  it('отображает описание навыка', () => {
    render(<SkillInfo {...defaultProps} />)
    expect(screen.getByText(mockSkill.description)).toBeInTheDocument()
  })

  it('отображает категорию и подкатегорию в формате "Категория / Подкатегория"', () => {
    render(<SkillInfo {...defaultProps} />)
    expect(screen.getByText('Творчество и искусство / Музыка и звук')).toBeInTheDocument()
  })

  it('отображает кнопки действий, переданные через слот actions', () => {
    render(
      <SkillInfo
        {...defaultProps}
        actions={{
          like: <button aria-label="Добавить в избранное">like</button>,
          share: <button aria-label="Поделиться">share</button>,
          more: <button aria-label="Больше опций">more</button>,
        }}
      />,
    )

    expect(screen.getByRole('button', { name: 'Добавить в избранное' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Поделиться' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Больше опций' })).toBeInTheDocument()
  })

  it('отображает кнопку "Предложить обмен", если она передана в actions', () => {
    render(
      <SkillInfo {...defaultProps} actions={{ createOffer: <button>Предложить обмен</button> }} />,
    )

    expect(screen.getByRole('button', { name: 'Предложить обмен' })).toBeInTheDocument()
  })

  it('не отображает кнопку "Предложить обмен", если она не передана в actions', () => {
    render(<SkillInfo {...defaultProps} />)

    expect(screen.queryByRole('button', { name: 'Предложить обмен' })).not.toBeInTheDocument()
  })

  it('вызывает обработчик клика кнопки действия', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <SkillInfo
        {...defaultProps}
        actions={{
          like: (
            <button aria-label="Добавить в избранное" onClick={onClick}>
              like
            </button>
          ),
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Добавить в избранное' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('отображает мини-превью для каждого изображения, если изображений не больше трёх', () => {
    const { container } = render(
      <SkillInfo
        {...defaultProps}
        skill={{ ...mockSkill, images: mockSkill.images.slice(0, 3) }}
      />,
    )

    // 3 изображения в карусели + 3 в мини-превью = 6 <img>
    expect(container.querySelectorAll('img')).toHaveLength(6)
  })

  it('отображает overlay "+N" на третьем мини-превью, если изображений больше трёх', () => {
    render(<SkillInfo {...defaultProps} />)

    expect(screen.getByText(`+${mockSkill.images.length - 3}`)).toBeInTheDocument()
  })

  it('даёт мини-превью доступные имена', () => {
    render(<SkillInfo {...defaultProps} />)

    expect(screen.getByRole('button', { name: 'Показать фото 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Показать фото 3, ещё 1 фото' })).toBeInTheDocument()
  })

  it('показывает заглушку вместо пустой карусели, если фотографий нет', () => {
    render(<SkillInfo {...defaultProps} skill={{ ...mockSkill, images: [] }} />)
    expect(screen.getByRole('img', { name: `${mockSkill.title} — фото 1` })).toHaveAttribute(
      'src',
      '/images/skills/placeholder.jpg',
    )
    expect(screen.queryByTestId('carousel')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Показать фото/ })).not.toBeInTheDocument()
  })
})
