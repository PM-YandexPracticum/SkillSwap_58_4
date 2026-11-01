import logoIcon from '../../assets/icons/logo.svg'
import { Link } from 'react-router-dom'
import styles from './Logo.module.css'

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
