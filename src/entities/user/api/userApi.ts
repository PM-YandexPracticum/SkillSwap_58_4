import {
  createMockCollection,
  isISODateString,
  isRecord,
  isString,
  isStringArray,
  loadSeed,
} from '@/shared/api'
import { DATA_ERRORS } from '@/shared/config'
import { normalizeEmail } from '../lib/normalizeEmail'
import type { User } from '../model/types'

const isUser = (value: unknown): value is User => {
  if (!isRecord(value)) return false
  return (
    isString(value.id) &&
    isString(value.name) &&
    isString(value.email) &&
    isString(value.password) &&
    (value.avatarUrl === null || isString(value.avatarUrl)) &&
    isISODateString(value.birthDate) &&
    (value.gender === null || value.gender === 'male' || value.gender === 'female') &&
    isString(value.cityId) &&
    isString(value.about) &&
    isString(value.teachSkillId) &&
    isStringArray(value.learnSubcategoryIds) &&
    isStringArray(value.likedUserIds) &&
    typeof value.likesCount === 'number' &&
    Number.isFinite(value.likesCount) &&
    value.likesCount >= 0 &&
    isISODateString(value.createdAt)
  )
}

/**
 * Хранилище пользователей.
 * Единственное место, которое знает, откуда берутся данные. Переход на настоящую БД — меняется только этот файл.
 */
const users = createMockCollection<User>('users', loadSeed<User>('users', isUser), {
  validate: isUser,
  validateWrite: (user, items) => {
    if (
      items.some(
        (item) => item.id !== user.id && normalizeEmail(item.email) === normalizeEmail(user.email),
      )
    ) {
      throw new Error(DATA_ERRORS.DUPLICATE_EMAIL)
    }
  },
})

/** Все пользователи */
export function getUsers(): Promise<User[]> {
  return users.getAll()
}

/** Пользователь по id или undefined */
export function getUserById(id: string): Promise<User | undefined> {
  return users.getById(id)
}

/**
 * Регистрация нового пользователя. Проверка email и запись выполняются атомарно в очереди коллекции.
 * Email сравнивается без учёта регистра и краевых пробелов, независимо от актуальности Redux.
 * Проверка формы (P6-02) нужна для ранней подсказки, а здесь — окончательная защита от дублей.
 * @throws {Error} при повторе email/id, неверных данных или нехватке места
 */
export function createUser(user: User): Promise<User> {
  return users.create(user)
}

/**
 * Сохраняет изменения пользователя: личные данные, фото, лайки (`likedUserIds`, `likesCount`), пароль.
 * При изменении email сохраняет то же ограничение уникальности, что и регистрация.
 * @param changes только изменившиеся поля
 */
export function updateUser(id: string, changes: Partial<Omit<User, 'id'>>): Promise<User> {
  return users.update(id, changes)
}

/**
 * Избранное владельца и счётчик адресата сохраняются одной записью коллекции.
 * Расчёт на актуальных данных внутри очереди не теряет параллельные лайки.
 * При ошибке хранения обе записи остаются прежними; компенсация не требуется.
 */
export function toggleUserFavorite(currentUserId: string, targetUserId: string): Promise<User[]> {
  return users.updateMany((items) => {
    const currentUser = items.find((user) => user.id === currentUserId)
    const targetUser = items.find((user) => user.id === targetUserId)
    if (!currentUser || !targetUser || currentUserId === targetUserId) {
      throw new Error(DATA_ERRORS.SAVE_USER)
    }
    const alreadyLiked = currentUser.likedUserIds.includes(targetUserId)
    return [
      {
        id: currentUserId,
        changes: {
          likedUserIds: alreadyLiked
            ? currentUser.likedUserIds.filter((id) => id !== targetUserId)
            : [...currentUser.likedUserIds, targetUserId],
        },
      },
      {
        id: targetUserId,
        changes: { likesCount: Math.max(0, targetUser.likesCount + (alreadyLiked ? -1 : 1)) },
      },
    ]
  })
}
