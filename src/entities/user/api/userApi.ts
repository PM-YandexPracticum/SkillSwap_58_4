import {
  createMockCollection,
  isISODateString,
  isRecord,
  isString,
  isStringArray,
  loadSeed,
} from '@/shared/api'
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
 * Регистрация нового пользователя — сохраняет его в «базу» как есть.
 * Email здесь не проверяется: «Email уже используется» показывает форма шага 1 (P6-02) до вызова.
 * @throws {Error} если пользователь с таким id уже есть или в браузере не хватает места
 */
export function createUser(user: User): Promise<User> {
  return users.create(user)
}

/**
 * Сохраняет изменения пользователя: личные данные, фото, лайки (`likedUserIds`, `likesCount`), пароль.
 * @param changes только изменившиеся поля
 */
export function updateUser(id: string, changes: Partial<Omit<User, 'id'>>): Promise<User> {
  return users.update(id, changes)
}
