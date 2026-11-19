import type { Meta, StoryObj } from '@storybook/react-vite'

import { UserCard, type PublicUser } from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { Button } from '@/shared/ui/Button'

import { OffersSection } from './OffersSection'

const users = Array.from({ length: 12 }, (_, index) =>
  createUser({
    id: `u-${index}`,
    name: ['Иван', 'Анна', 'Максим'][index % 3],
    avatarUrl: `/images/avatars/u${String(index + 1).padStart(2, '0')}.jpg`,
  }),
)

/** Слот на сущности UserCard; композиция настоящих OfferCard — в app/CatalogSections. */
const renderItem = (user: PublicUser) => (
  <UserCard
    user={user}
    cityName="Санкт-Петербург"
    teachSkill={{ title: 'Игра на барабанах', categoryId: 'creativity' }}
    learnSubcategories={[{ id: 'english', title: 'Английский', categoryId: 'languages' }]}
    bottomAction={<Button>Подробнее</Button>}
  />
)

const meta = {
  title: 'widgets/offers-section/OffersSection',
  component: OffersSection,
  tags: ['autodocs'],
  args: { title: 'Популярное', users, mode: 'expandable', renderItem },
  parameters: {
    layout: 'padded',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2872',
    },
    docs: {
      description: {
        component:
          'Сетка 3 колонки, промежутки 24 px. Нажмите «Смотреть все»: 3 → максимум 9 → 3; учитывается reduced motion. Секция принимает renderItem от страницы, потому что виджеты не импортируют соседние виджеты. В infinite секция сама не грузит: порцию, спиннер и маркер конца ленты передаёт страница через useInfiniteScroll (P5-06). Живая догрузка — в app/CatalogPage.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 1020 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OffersSection>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Empty: Story = { args: { users: [] } }
export const ThreeCards: Story = { args: { users: users.slice(0, 3) } }
export const FiveCards: Story = { args: { users: users.slice(0, 5) } }
export const Feed: Story = {
  args: { title: 'Рекомендуем', mode: 'infinite', users: users.slice(0, 6), hasMore: true },
}
/** Пользователь докрутил до конца ленты: под сеткой спиннер, пока догружаются ещё 6 карточек. */
export const FeedLoading: Story = {
  args: {
    title: 'Рекомендуем',
    mode: 'infinite',
    users: users.slice(0, 6),
    isLoading: true,
    hasMore: true,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2888',
    },
  },
}
