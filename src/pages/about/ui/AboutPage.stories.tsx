import type { Meta, StoryObj } from '@storybook/react-vite'
import type { TeamMember } from '../config/team'
import { AboutPage } from './AboutPage'

/** Аватар-заглушка для story: inline SVG вместо внешнего запроса */
const PLACEHOLDER_PHOTO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
      '<rect width="100" height="100" fill="#d4e5d1"/>' +
      '<circle cx="50" cy="38" r="18" fill="#7da87d"/>' +
      '<ellipse cx="50" cy="88" rx="28" ry="22" fill="#7da87d"/>' +
      '</svg>',
  )

/**
 * Тестовый участник: вымышленные данные, чтобы story не зависела
 * от реальных людей из TEAM (их добавляют сами по P8-02).
 */
function createMember(overrides: Partial<TeamMember> = {}): TeamMember {
  return {
    name: 'Тестовый Участник',
    role: 'Разработчик',
    github: 'https://github.com/test-member',
    photoUrl: PLACEHOLDER_PHOTO,
    about: 'Короткое описание для витрины: что делал в проекте и чему учится.',
    ...overrides,
  }
}

const SECOND_MEMBER = createMember({
  name: 'Второй Участник',
  role: 'Тимлид',
  github: 'https://github.com/second-member',
})

const THIRD_MEMBER = createMember({
  name: 'Третий Участник',
  role: 'Помощник тимлида',
  github: 'https://github.com/third-member',
})

const meta: Meta<typeof AboutPage> = {
  title: 'pages/about/AboutPage',
  component: AboutPage,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 1440, margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Страница «О проекте» (/about): сетка карточек команды SkillSwap — фото, имя, роль, «Обо мне», ссылка на GitHub. Данные — из `config/team.ts` (P8-02).',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-3249',
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

/** Одна карточка — базовое состояние страницы. */
export const Default: Story = {
  args: { members: [createMember()] },
}

/** Две карточки — сетка в 2 колонки, как в макете. */
export const TwoMembers: Story = {
  args: { members: [createMember(), SECOND_MEMBER] },
}

/** Три карточки — сетка 2 в ряд + перенос на вторую строку. */
export const ThreeMembers: Story = {
  args: { members: [createMember(), SECOND_MEMBER, THIRD_MEMBER] },
}

/** Без фото — показывается буква-инициал (креативное решение). */
export const WithoutPhoto: Story = {
  args: { members: [createMember({ name: 'Анна', photoUrl: null })] },
}

/** Длинный URL — перенос внутри карточки, за границы не вылезает. */
export const LongGithubUrl: Story = {
  args: {
    members: [
      createMember({
        github:
          'https://github.com/a-very-long-test-username-with-many-characters-123456789123456789',
      }),
    ],
  },
}

/** Длинный текст «Обо мне» — карточка растёт по высоте, контакты остаются внизу. */
export const LongAbout: Story = {
  args: {
    members: [
      createMember({
        about: 'Длинное описание для проверки переноса и роста карточки. '.repeat(8),
      }),
    ],
  },
}

/** Пустой список — граничный случай: сетки нет, страница не падает. */
export const Empty: Story = {
  args: { members: [] },
}
