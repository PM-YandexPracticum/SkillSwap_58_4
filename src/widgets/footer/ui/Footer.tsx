import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/config'
import { Logo } from '@/shared/ui/Logo'
import styles from './Footer.module.css'

export interface FooterProps {
  /** Дополнительный CSS-класс */
  className?: string
}

interface FooterLink {
  label: string
  /** Адрес; без него пункт — заглушка: выглядит как ссылка, но ни на что не реагирует */
  to?: string
}

/** Пункты по колонкам сверху вниз, слева направо — как в макете */
const FOOTER_LINKS: FooterLink[] = [
  { label: 'О проекте', to: ROUTES.ABOUT },
  { label: 'Все навыки', to: ROUTES.ALL_SKILLS },
  { label: 'Контакты' },
  { label: 'Блог' },
  { label: 'Политика конфиденциальности' },
  { label: 'Пользовательское соглашение' },
]

/**
 * Подвал: логотип, ссылки, «SkillSwap — 2025».
 * Рабочие: «О проекте» → `/about` (страница команды), «Все навыки» → `/skills` (отдельная страница).
 * Заглушки: «Контакты», «Блог», «Политика конфиденциальности», «Пользовательское соглашение» —
 * выглядят как ссылки, но ни на что не реагируют.
 * @see Figma: «Каталог - пользователь не авторизован» (1:2861), подвал
 */
export function Footer({ className }: FooterProps) {
  return (
    <footer className={className ? `${styles.footer} ${className}` : styles.footer}>
      <div className={styles.inner}>
        <Logo />
        <nav className={styles.nav} aria-label="Ссылки в подвале">
          <ul className={styles.links}>
            {FOOTER_LINKS.map(({ label, to }) => (
              <li key={label}>
                {to ? (
                  <Link className={styles.link} to={to}>
                    {label}
                  </Link>
                ) : (
                  <span className={styles.stub}>{label}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <p className={styles.copyright}>SkillSwap — 2025</p>
      </div>
    </footer>
  )
}
