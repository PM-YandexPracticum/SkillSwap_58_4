import { nanoid } from 'nanoid'
import { render, screen } from '@testing-library/react'
import type { TeamMember } from '../config/team'
import { AboutPage } from './AboutPage'

function createMember(overrides: Partial<TeamMember> = {}): TeamMember {
  return {
    id: nanoid(),
    name: 'Тестовый Участник',
    role: 'Разработчик',
    github: 'https://github.com/test-member',
    photoUrl: '/images/team/t0.jpg',
    about: 'Короткое описание участника.',
    ...overrides,
  }
}

describe('AboutPage', () => {
  it('показывает заголовок страницы', () => {
    render(<AboutPage members={[]} />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Команда разработчиков SkillSwap' }),
    ).toBeInTheDocument()
  })

  it('показывает имя, роль и «Обо мне» участника', () => {
    render(<AboutPage members={[createMember()]} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Тестовый Участник' })).toBeInTheDocument()
    expect(screen.getByText('Роль в проекте: Разработчик')).toBeInTheDocument()
    expect(screen.getByText('Короткое описание участника.')).toBeInTheDocument()
  })

  it('открывает GitHub участника в новой вкладке безопасно', () => {
    render(<AboutPage members={[createMember()]} />)
    const link = screen.getByRole('link', { name: 'https://github.com/test-member' })
    expect(link).toHaveAttribute('href', 'https://github.com/test-member')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it.each([
    {
      label: 'с фото',
      photoUrl: '/images/team/t0.jpg',
      accessibleName: 'Фото: анна',
      initial: null,
    },
    { label: 'без фото', photoUrl: null, accessibleName: 'Фото: анна отсутствует', initial: 'А' },
  ] as const)('$label: аватар доступен скринридеру', ({ photoUrl, accessibleName, initial }) => {
    render(<AboutPage members={[createMember({ name: 'анна', photoUrl })]} />)
    const avatar = screen.getByRole('img')

    expect(avatar).toHaveAccessibleName(accessibleName)
    if (initial) {
      expect(avatar).toHaveTextContent(initial)
    } else {
      expect(avatar).not.toHaveTextContent('А')
    }
  })
})
