import { Tag, isTagColor } from '@/shared/ui/Tag'

export interface SkillTagProps {
  /** Название навыка или подкатегории */
  title: string
  /** Id категории (`creativity`, `languages`…) — от него цвет чипа; незнакомая — чип без цвета */
  categoryId: string
}

/**
 * Чип навыка или подкатегории в цвете своей категории. Обёртка над `shared/ui/Tag`.
 * @see Figma: чипы на карточке каталога (1:2861)
 */
export function SkillTag({ title, categoryId }: SkillTagProps) {
  return <Tag label={title} color={isTagColor(categoryId) ? categoryId : undefined} />
}
