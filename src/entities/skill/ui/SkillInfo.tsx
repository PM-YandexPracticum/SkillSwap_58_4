export interface SkillInfoProps {
  skill: import('../model/types').Skill
  /** Слот для фич, например «Предложить обмен» */
  actions?: React.ReactNode
}

/**
 * Блок описания навыка: заголовок, «Категория / Подкатегория», текст. Кнопки действий передаются через слот `actions`.
 * @see Figma: «Страница навыка» (1:2764)
 */
export function SkillInfo(_props: SkillInfoProps) {
  // TODO: реализовать по макету
  return null
}
