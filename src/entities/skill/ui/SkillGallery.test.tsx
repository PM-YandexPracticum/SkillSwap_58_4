import { useEffect } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SkillGallery } from './SkillGallery'

const scrollTo = vi.hoisted(() => vi.fn())

vi.mock('@/shared/ui/Carousel', () => ({
  Carousel: ({
    children,
    onApiReady,
  }: {
    children: React.ReactNode
    onApiReady: (api: { scrollTo: typeof scrollTo }) => void
  }) => {
    useEffect(() => onApiReady({ scrollTo }), [onApiReady])
    return <div>{children}</div>
  },
}))

describe('SkillGallery', () => {
  beforeEach(() => {
    scrollTo.mockClear()
  })

  it('не показывает галерею без фото', () => {
    render(<SkillGallery title="Барабаны" images={[]} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('одно фото имеет подпись, но не имеет миниатюр', () => {
    render(<SkillGallery title="Барабаны" images={['blob:one']} />)
    expect(screen.getByRole('img', { name: 'Барабаны — фото 1' })).toHaveAttribute(
      'src',
      'blob:one',
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('переключает фото с клавиатуры через миниатюру', async () => {
    render(<SkillGallery title="Барабаны" images={['blob:1', 'blob:2']} />)
    const user = userEvent.setup()
    await user.tab()
    await user.tab()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: 'Показать фото 2' })).toHaveFocus()
    expect(scrollTo).toHaveBeenCalledWith(1)
  })

  it('сохраняет все фото в карусели и показывает остаток на третьей миниатюре', async () => {
    render(<SkillGallery title="Барабаны" images={['blob:1', 'blob:2', 'blob:3', 'blob:4']} />)
    expect(screen.getAllByRole('img')).toHaveLength(4)
    expect(screen.getAllByRole('button')).toHaveLength(3)
    await userEvent.click(screen.getByRole('button', { name: 'Показать фото 3, ещё 1 фото' }))
    expect(scrollTo).toHaveBeenCalledWith(2)
    expect(screen.getByText('+1')).toBeInTheDocument()
  })
})
