import type { Meta, StoryObj } from '@storybook/react-vite'

import { createSkill } from '@/entities/skill/testing'
import { loadSeed } from '@/shared/api'
import LikeIcon from '@/shared/assets/icons/like.svg?react'
import { Button } from '@/shared/ui/Button'
import { IconButton } from '@/shared/ui/IconButton'

import type { User } from '../model/types'
import { createUser } from '../testing'
import { UserCard, type UserCardProps, type UserCardTag } from './UserCard'

/**
 * Подкатегории — как в справочнике `public/db/categories.json`: тот же id, название и категория (от неё цвет чипа).
 * В приложении их найдёт виджет карточки (P3-08) по `learnSubcategoryIds` пользователя.
 */
const SUBCATEGORIES = {
  timeManagement: { id: 'time-management', title: 'Тайм-менеджмент', categoryId: 'business' },
  english: { id: 'english', title: 'Английский', categoryId: 'languages' },
  photo: { id: 'photo', title: 'Фотография', categoryId: 'creativity' },
  yoga: { id: 'yoga', title: 'Йога и медитация', categoryId: 'health' },
  drawing: { id: 'drawing', title: 'Рисование и иллюстрация', categoryId: 'creativity' },
  creativeWriting: { id: 'creative-writing', title: 'Креативное письмо', categoryId: 'creativity' },
} as const

/** Так виджет превращает навык автора в пропс карточки «Может научить» */
const toTeachSkill = ({ title, categoryId }: UserCardTag): UserCardTag => ({ title, categoryId })

/**
 * Карточка пользователя в каталоге — как карточка Ивана в макете (1:2877).
 * Пользователь и навык — из фабрик `createUser()` и `createSkill()`, подкатегории — из справочника.
 * Лайк и «Подробнее» — слоты: здесь показаны для вида, оживит их P3-08.
 */
const meta: Meta<typeof UserCard> = {
  title: 'entities/user/UserCard',
  component: UserCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 324 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    user: createUser({
      name: 'Иван',
      birthDate: '1992-03-15T10:00:00.000Z',
      avatarUrl: '/images/avatars/u01.jpg',
    }),
    cityName: 'Санкт-Петербург',
    teachSkill: toTeachSkill(
      createSkill({ title: 'Игра на барабанах', categoryId: 'creativity', subcategoryId: 'music' }),
    ),
    // Как у Ивана в данных (u01) и ещё одна — чтобы был «+2», как в макете
    learnSubcategories: [
      SUBCATEGORIES.timeManagement,
      SUBCATEGORIES.english,
      SUBCATEGORIES.photo,
      SUBCATEGORIES.yoga,
    ],
    topAction: <IconButton ariaLabel="Добавить в избранное" icon={<LikeIcon />} />,
    bottomAction: <Button>Подробнее</Button>,
  },
}

export default meta

type Story = StoryObj<typeof meta>

/** Как в макете (1:2877): два чипа «Хочет научиться» и «+2» */
export const Default: Story = {}

/** Две подкатегории — «+N» не нужен. Карточка в каталоге (1:2861) */
export const TwoLearnTags: Story = {
  args: { learnSubcategories: [SUBCATEGORIES.english, SUBCATEGORIES.yoga] },
}

/** Без фото — заглушка аватара (вид карточки — 1:2877) */
export const NoPhoto: Story = {
  args: { user: createUser({ name: 'Анна', gender: 'female', avatarUrl: null }) },
}

/** Без слотов — только данные (вид карточки — 1:2877) */
export const WithoutActions: Story = {
  args: { topAction: undefined, bottomAction: undefined },
}

/**
 * Самые длинные названия из данных проекта: навык `s32` и подкатегории `u14`.
 * Чипы не помещаются в карточку (1:2877) — обрезаются многоточием, «+1» виден всегда; длинное имя тоже обрезается.
 */
export const LongTitles: Story = {
  args: {
    user: createUser({ name: 'Александра-Виктория Константинопольская' }),
    teachSkill: toTeachSkill(
      createSkill({
        title: 'Быстрая уборка и организация пространства',
        categoryId: 'home',
        subcategoryId: 'cleaning',
      }),
    ),
    learnSubcategories: [
      SUBCATEGORIES.drawing,
      SUBCATEGORIES.creativeWriting,
      SUBCATEGORIES.english,
    ],
  },
}

/** Поля из файлов базы, которые нужны карточке. Полные типы — в своих сущностях (`entities/skill`, `city`, `category`) */
interface DbSkill {
  id: string
  title: string
  categoryId: string
}
interface DbCity {
  id: string
  name: string
}
interface DbCategory {
  id: string
  subcategories: ReadonlyArray<{ id: string; title: string }>
}

type CardData = Pick<UserCardProps, 'user' | 'cityName' | 'teachSkill' | 'learnSubcategories'>

/**
 * Собирает пропсы карточки из данных «базы» (`public/db`) — ровно то, что в приложении сделает
 * виджет карточки предложения (P3-08): по `cityId` находит город, по `teachSkillId` — навык,
 * по `learnSubcategoryIds` — подкатегории с их категориями.
 *
 * В приложении данные берутся через `entities/*\/api` и store. Story сущности `user` не может импортировать
 * соседние сущности (правило FSD), поэтому читает файлы базы её же загрузчиком `loadSeed` из `shared/api`.
 */
async function loadCardFromDatabase(userId: string): Promise<CardData> {
  const [users, skills, cities, categories] = await Promise.all([
    loadSeed<User>('users')(),
    loadSeed<DbSkill>('skills')(),
    loadSeed<DbCity>('cities')(),
    loadSeed<DbCategory>('categories')(),
  ])
  const user = users.find((item) => item.id === userId)
  if (!user) throw new Error(`В public/db/users.json нет пользователя ${userId}`)

  const skill = skills.find((item) => item.id === user.teachSkillId)
  const subcategories = categories.flatMap((category) =>
    category.subcategories.map(({ id, title }) => ({ id, title, categoryId: category.id })),
  )

  return {
    // Пароль карточка не показывает; убрать его из данных для интерфейса — задача селекторов (P4-03)
    user,
    cityName: cities.find((city) => city.id === user.cityId)?.name ?? '',
    teachSkill: { title: skill?.title ?? '', categoryId: skill?.categoryId ?? '' },
    learnSubcategories: user.learnSubcategoryIds.flatMap((id) =>
      subcategories.filter((subcategory) => subcategory.id === id),
    ),
  }
}

/**
 * Иван (`u01`) — настоящие данные из базы: имя, фото, город, навык и подкатегории приходят из `public/db`.
 * Так карточка будет выглядеть в каталоге (1:2861). Слоты — как в остальных stories.
 */
export const FromDatabase: Story = {
  loaders: [async () => ({ card: await loadCardFromDatabase('u01') })],
  render: (args, { loaded }) => <UserCard {...args} {...(loaded.card as CardData)} />,
}
