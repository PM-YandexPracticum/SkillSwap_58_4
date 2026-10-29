/** Участник команды для страницы «О проекте» */
export interface TeamMember {
  name: string
  /** Роль: «Тимлид», «Помощник тимлида», «Разработчик» */
  role: string
  /** Ссылка на профиль GitHub */
  github: string
  /** Путь к фото или null */
  photoUrl: string | null
  /** Пара слов о себе / что сделал в проекте */
  about: string
}

/**
 * Команда проекта — традиция наставника: в портфолио видно, кто делал эту версию SkillSwap.
 * TODO: каждый участник добавляет себя сам (одна строка — свой мини-PR)
 */
export const TEAM: readonly TeamMember[] = []
