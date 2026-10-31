import logoIcon from '../../assets/icons/logo.svg'
import './Logo.css'

export interface LogoProps {
  withText?: boolean
}

export function Logo({ withText = true }: LogoProps) {
  return (
    <a
      className="logo"
      href="/"
      aria-label={withText ? undefined : 'SkillSwap — главная'}
    >
      <img className="logo__icon" src={logoIcon} alt="" width={40} height={40} />
      {withText && <span className="logo__text">SkillSwap</span>}
    </a>
  )
}
