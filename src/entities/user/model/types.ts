import type { ID, ISODateString } from '@/shared/types'

export type Gender = 'male' | 'female'

/**
 * Пользователь платформы. Образцы — `public/db/users.json`; чтение и запись — только через `entities/user/api`.
 * @see Figma: карточка в каталоге и «Профиль_личные данные» (1:2370)
 */
export interface User {
  id: ID
  name: string
  email: string
  /** Учебный пароль (хранится как есть) — только для проверки входа, в UI не показывать */
  password: string
  /**
   * Фото: путь к файлу образца (`/images/avatars/u01.jpg`) или data URL загруженного файла; null — нет фото.
   * В разметку — только через `resolveImageUrl`.
   */
  avatarUrl: string | null
  birthDate: ISODateString
  /** Пол; null — «Не указан» (в макете это отдельный вариант списка) */
  gender: Gender | null
  /** Город — id из справочника городов (`entities/city`) */
  cityId: ID
  /**
   * «О себе». При регистрации пустое — заполняется только в «Личных данных»,
   * после этого текст появляется в карточке автора на странице навыка.
   */
  about: string
  /** Навык, которому может научить — ровно один («Может научить») */
  teachSkillId: ID
  /** Подкатегории, которым хочет научиться — одна или несколько («Хочет научиться») */
  learnSubcategoryIds: ID[]
  /**
   * Кого пользователь лайкнул (id пользователей).
   * Из этого поля строится страница «Избранное».
   */
  likedUserIds: ID[]
  /**
   * Сколько раз пользователя лайкнули. Сортировка «Популярного» и счётчик у сердечка на карточке.
   * Меняется вместе с чужими `likedUserIds`: лайк +1, снятие лайка −1.
   */
  likesCount: number
  /** Дата регистрации — сортировка секции «Новое» */
  createdAt: ISODateString
}

/** Пользователь без секретных полей — то, что можно отдавать в UI */
export type PublicUser = Omit<User, 'password'>
