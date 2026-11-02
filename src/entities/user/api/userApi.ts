import { createMockCollection, SEED } from '@/shared/api'
import type { User } from '../model/types'

/**
 * Хранилище пользователей.
 * Единственное место, которое знает, откуда берутся данные. Переход на настоящую БД — меняется только этот файл.
 */
const users = createMockCollection<User>('users', SEED.users as readonly User[])

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
