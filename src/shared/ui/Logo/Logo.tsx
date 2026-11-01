import logoIcon from '../../assets/icons/logo.svg'
import styles from './Logo.module.css'

export interface LogoProps {
  withText?: boolean
}

export function Logo({ withText = true }: LogoProps) {
  return (
    <a className={styles.logo} href="/" aria-label={withText ? undefined : 'SkillSwap — главная'}>
      <img className={styles.icon} src={logoIcon} alt="" width={40} height={40} />
      {withText && <span className={styles.text}>SkillSwap</span>}
    </a>
  )
}
