import BusinessIcon from '@/shared/assets/icons/categories/business.svg?react'
import CreativeIcon from '@/shared/assets/icons/categories/creative.svg?react'
import LanguagesIcon from '@/shared/assets/icons/categories/languages.svg?react'
import EducationIcon from '@/shared/assets/icons/categories/education.svg?react'
import HealthIcon from '@/shared/assets/icons/categories/health.svg?react'
import HomeIcon from '@/shared/assets/icons/categories/home.svg?react'
import styles from './CategoryIcon.module.css'

const ICONS = {
  business: BusinessIcon,
  creative: CreativeIcon,
  languages: LanguagesIcon,
  education: EducationIcon,
  health: HealthIcon,
  home: HomeIcon,
}

export interface CategoryIconProps {
  /** Имя SVG из справочника категорий; незнакомое имя оставляет только круг */
  icon: string
  /** Семантический id категории для цвета из CSS-токенов, например `creativity` */
  color: string
}

/**
 * Декоративная иконка 24 px в круге 40 px. Название категории озвучивает соседний заголовок.
 * Незнакомые иконка или цвет не ломают список; цвет по умолчанию нейтральный.
 * @see Figma: «Все навыки» (1:3165)
 */
export function CategoryIcon({ icon, color }: CategoryIconProps) {
  const Icon = Object.prototype.hasOwnProperty.call(ICONS, icon)
    ? ICONS[icon as keyof typeof ICONS]
    : undefined
  const colorClass = Object.prototype.hasOwnProperty.call(styles, color) ? styles[color] : undefined

  return (
    <span className={[styles.circle, colorClass].filter(Boolean).join(' ')} aria-hidden="true">
      {Icon && <Icon className={styles.icon} focusable="false" />}
    </span>
  )
}
