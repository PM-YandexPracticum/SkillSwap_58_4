import { resolveImageUrl } from '@/shared/lib/image/resolveImageUrl'
import styles from './Avatar.module.css'

export interface AvatarProps {
  /** Путь к фото из моков (`avatarUrl`) или data URL; `null` — показать заглушку */
  src: string | null
  /** Текст для скринридера — обычно имя пользователя */
  alt: string
  /** Размер: `sm` — шапка (48px), `md` — карточка (100px), `lg` — профиль (244px) */
  size?: 'sm' | 'md' | 'lg'
  /** Класс для размещения аватара внутри составного компонента. */
  className?: string
}

/**
 * Круглый аватар пользователя с заглушкой вместо отсутствующего фото.
 *
 * Если фото нет (`src` равен `null`, `undefined` или пустой строке), показывается
 * заглушка из `IMAGE_PLACEHOLDERS` - подстановку делает `resolveImageUrl`,
 * она же добавляет `BASE_URL` к локальным путям из моков.
 *
 * Размеры: `sm` - шапка, `md` - карточка, `lg` - профиль.
 * По умолчанию `md`.
 *
 * @see Figma: «Шапка» (1:2996) — `sm`, «Карточка пользователя» (1:2861) — `md`,
 * «Профиль — личные данные» (1:2370) — `lg`
 */
export function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  const resolvedSrc = resolveImageUrl(src, 'AVATAR')

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading="lazy"
      className={[styles.avatar, styles[size], className].filter(Boolean).join(' ')}
    />
  )
}
