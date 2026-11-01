import { Link } from 'react-router-dom'

import logoIcon from '@/shared/assets/icons/brands/logo.svg'
import styles from './Logo.module.css'

export interface LogoProps {
  /** Показывать ли текст «SkillSwap» рядом с иконкой. По умолчанию `true` */
  withText?: boolean
}

/**
 * Логотип SkillSwap (иконка + текст), ведёт на главную.
 *
 * Без текста (`withText={false}`) у ссылки остаётся подпись для скринридера «SkillSwap — главная».
 *
 * @see Figma: «Шапка» (1:2870)
 */
export function Logo({ withText = true }: LogoProps) {
  return (
    <Link className={styles.logo} to="/" aria-label={withText ? undefined : 'SkillSwap — главная'}>
      <img className={styles.icon} src={logoIcon} alt="" width={40} height={40} />
      {withText && <span className={styles.text}>SkillSwap</span>}
    </Link>
  )
}
