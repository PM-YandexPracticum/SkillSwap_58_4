import logoIcon from '@/shared/assets/icons/brands/logo.svg'
import { Link } from 'react-router-dom'
import styles from './Logo.module.css'

/**
 * Логотип SkillSwap (иконка + текст), ведёт на главную.
 * @see https://www.figma.com/design/40gXmyAoxwwnb9kBxI5B8y/SkillSwap-Red.1-?node-id=1-2870&t=9dj85xUsjNrqHimT-1
 */

/**
 * Показывать ли текст рядом с иконкой
 */
export interface LogoProps {
  withText?: boolean
}

export function Logo({ withText = true }: LogoProps) {
  return (
    <Link className={styles.logo} to="/" aria-label={withText ? undefined : 'SkillSwap — главная'}>
      <img className={styles.icon} src={logoIcon} alt="" width={40} height={40} />
      {withText && <span className={styles.text}>SkillSwap</span>}
    </Link>
  )
}
