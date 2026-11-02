import { createMockCollection, loadSeed } from '@/shared/api'
import type { Skill } from '../model/types'

/**
 * Хранилище навыков.
 * Единственное место, которое знает, откуда берутся данные. Переход на настоящую БД — меняется только этот файл.
 */
const skills = createMockCollection<Skill>('skills', loadSeed<Skill>('skills'))

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
