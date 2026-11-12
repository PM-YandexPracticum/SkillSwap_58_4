import {
  createMockCollection,
  isISODateString,
  isRecord,
  isString,
  isStringArray,
  loadSeed,
} from '@/shared/api'
import type { Skill } from '../model/types'

const isSkill = (value: unknown): value is Skill =>
  isRecord(value) &&
  isString(value.id) &&
  isString(value.title) &&
  isString(value.description) &&
  isString(value.categoryId) &&
  isString(value.subcategoryId) &&
  isStringArray(value.images) &&
  isString(value.authorId) &&
  isISODateString(value.createdAt)

/**
 * Хранилище навыков.
 * Единственное место, которое знает, откуда берутся данные. Переход на настоящую БД — меняется только этот файл.
 */
const skills = createMockCollection<Skill>('skills', loadSeed<Skill>('skills', isSkill), {
  validate: isSkill,
})

/** Все навыки */
export function getSkills(): Promise<Skill[]> {
  return skills.getAll()
}

/** Навык по id или undefined */
export function getSkillById(id: string): Promise<Skill | undefined> {
  return skills.getById(id)
}

/** Навык нового пользователя (шаг 3 регистрации) */
export function createSkill(skill: Skill): Promise<Skill> {
  return skills.create(skill)
}
