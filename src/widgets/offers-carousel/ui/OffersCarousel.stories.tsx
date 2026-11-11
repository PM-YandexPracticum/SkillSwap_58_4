import type { Meta, StoryObj } from '@storybook/react-vite'

import { UserCard, type PublicUser } from '@/entities/user'
import { createUser } from '@/entities/user/testing'
import { FavoriteButton } from '@/features/favorite-toggle'
import { Button } from '@/shared/ui/Button'

import { OffersCarousel } from './OffersCarousel'

const FIGMA = 'https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id='

const names = ['Наталья', 'Максим', 'Ольга', 'Артём', 'Виктория', 'Павел', 'Елена']

const users: PublicUser[] = names.map((name, index) =>
  createUser({
    id: `u${index + 10}`,
    name,
    avatarUrl: `/images/avatars/u${String(index + 10).padStart(2, '0')}.jpg`,
    likesCount: 20 + index * 7,
    learnSubcategoryIds: ['english', 'photo', 'yoga'],
  }),
)

/**
 * В приложении сюда передают `OfferCard` из виджета offer-card — виджет не импортирует другой виджет и в stories
 * тоже, поэтому здесь карточка собрана из `UserCard`, `FavoriteButton` и зелёной `Button` «Подробнее» — так же, как у `OfferCard`.
 */
const renderItem = (user: PublicUser) => (
  <UserCard
    user={user}
    cityName="Санкт-Петербург"
    teachSkill={{ title: 'Игра на барабанах', categoryId: 'creativity' }}
    learnSubcategories={[
      { id: 'english', title: 'Английский', categoryId: 'languages' },
      { id: 'photo', title: 'Фотография', categoryId: 'creativity' },
      { id: 'yoga', title: 'Йога и медитация', categoryId: 'health' },
    ]}
    topAction={<FavoriteButton userId={user.id} likesCount={user.likesCount} />}
    bottomAction={<Button>Подробнее</Button>}
  />
)

const meta = {
  title: 'widgets/offers-carousel/OffersCarousel',
  component: OffersCarousel,
  tags: ['autodocs'],
  args: { users, renderItem },
  parameters: {
    layout: 'padded',
    design: { type: 'figma', url: `${FIGMA}1-2812` },
    docs: {
      description: {
        component:
          'Карусель «Похожие предложения»: четыре карточки в ряд, стрелки появляются, когда есть куда листать. Если предложений нет — блок скрыт.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 'var(--container-width)', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OffersCarousel>

export default meta

type Story = StoryObj<typeof meta>

/** Семь карточек: видно четыре, остальные — стрелкой вправо */
export const Default: Story = {}

/** Ровно четыре карточки: листать некуда, стрелок нет */
export const FourCards: Story = { args: { users: users.slice(0, 4) } }

/** Меньше четырёх: карточки занимают свои колонки слева */
export const TwoCards: Story = { args: { users: users.slice(0, 2) } }

/** Одно совпадение: одна карточка в первой колонке, стрелок нет */
export const OneCard: Story = { args: { users: users.slice(0, 1) } }

/** Нет похожих предложений: блок ничего не рисует */
export const Empty: Story = { args: { users: [] } }
