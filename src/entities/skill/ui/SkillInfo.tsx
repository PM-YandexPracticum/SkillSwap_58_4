import type { ReactNode } from 'react'

import type { Skill } from '../model/types'

export interface SkillInfoProps {
  /** Навык: своё название и описание */
  skill: Pick<Skill, 'title' | 'description'>
  /** Название категории из справочника — сам блок справочник не знает */
  categoryTitle: string
  /** Название подкатегории из справочника */
  subcategoryTitle: string
  /** Слот для фич, например «Предложить обмен» */
  actions?: ReactNode
}

/**
 * Блок описания навыка: своё название, «Категория / Подкатегория», описание. Кнопки действий передаются через слот `actions`.
 * Названия категории и подкатегории приходят пропсами — их соберёт страница навыка (P3-09, P7-01) селекторами P4-02.
 * Образец устройства, stories и тестов — UserCard (P3-01).
 * @see Figma: «Страница навыка» (1:2764)
 */
export function SkillInfo(_props: SkillInfoProps) {
  // TODO: реализовать по макету (P3-02)
  return null
}
