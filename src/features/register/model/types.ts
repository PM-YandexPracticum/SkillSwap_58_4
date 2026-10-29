import type { Gender } from '@/entities/user'

/**
 * Данные, накопленные по всем шагам. Хранятся в Redux, поэтому только сериализуемые значения:
 * файлы фото (`File`) не кладём в store — здесь только их превью `blob:`; сами файлы держит страница регистрации.
 */
export interface RegisterDraft {
  /** Шаг 1 — учётные данные */
  email: string
  password: string
  /** Шаг 2 — «Расскажите немного о себе» */
  name: string
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
    imagePreviewUrls: string[]
  } | null
}
