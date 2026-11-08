import AppleIcon from '@/shared/assets/icons/brands/apple.svg?react'
import GoogleIcon from '@/shared/assets/icons/brands/google.svg?react'
import styles from './OAuthButtons.module.css'

export interface OAuthButtonsProps {
  className?: string
}

const PROVIDERS = [
  { id: 'google', label: 'Продолжить с Google', Icon: GoogleIcon },
  { id: 'apple', label: 'Продолжить с Apple', Icon: AppleIcon },
] as const

/**
 * Кнопки «Продолжить с Google» / «Продолжить с Apple» + разделитель «или». Заглушки: по клику ничего не происходит.
 * В макете опечатка «Продлжить» — в коде правильное «Продолжить».
 * Кнопки `type="button"`, поэтому внутри формы не отправляют её.
 * @see Figma: «Вход» (1:2400), «Регистрация 1 шаг» (1:2548)
 */
export function OAuthButtons({ className }: OAuthButtonsProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.buttons}>
        {PROVIDERS.map(({ id, label, Icon }) => (
          <button key={id} className={styles.button} type="button">
            <Icon className={styles.icon} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
      <p className={styles.divider}>или</p>
    </div>
  )
}
