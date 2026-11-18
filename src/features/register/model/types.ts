import type { Gender } from '@/entities/user'

/**
 * Данные, накопленные по всем шагам. Хранятся в Redux, поэтому только сериализуемые значения:
 * файлы (`File`) в store не кладём. Фото хранятся как готовые data URL: их уже проверил
 * `validateImageFile` и уменьшил `fileToDataUrl`, при сохранении (P6-06) повторно их не сжимаем.
 */
export interface RegisterDraft {
  /** Шаг 1 — учётные данные */
  email: string
  password: string
  /** Шаг 2 — «Расскажите немного о себе» */
  name: string
  /** Аватар: готовый data URL (до 800 px; небольшое фото сохраняет исходный формат) или `null` */
  avatarPreviewUrl: string | null
  birthDate: string
  gender: Gender | null
  cityId: string
  /** «Хочу научиться»: отмеченные категории (для фильтра подкатегорий) */
  learnCategoryIds: string[]
  /** «Хочу научиться»: отмеченные подкатегории — одна или несколько, их и сохраняем в пользователя */
  learnSubcategoryIds: string[]
  /** Шаг 3 — «Укажите, чем вы готовы поделиться»: ровно один навык со своим названием */
  skill: {
    title: string
    categoryId: string
    subcategoryId: string
    description: string
    /** фото навыка: готовые data URL */
    imagePreviewUrls: string[]
  } | null
  /** Стабильные данные попытки для повтора после отказа записи или отмены запроса. */
  completion: {
    userId: string
    skillId: string
    createdAt: string
  } | null
}
