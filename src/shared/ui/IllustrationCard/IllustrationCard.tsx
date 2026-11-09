import styles from './IllustrationCard.module.css'

export interface IllustrationCardProps {
  /** Адрес картинки: `import lightBulb from '@/shared/assets/images/light-bulb.svg'` */
  image: string
  /** Заголовок под картинкой */
  title: string
  /** Текст под заголовком */
  text?: string
}

/**
 * Белая карточка с иллюстрацией 300 × 300, заголовком и текстом по центру — правая половина
 * экранов входа и регистрации. Картинка декоративная: смысл передают заголовок и текст.
 * @see Figma: «Вход» (1:2400), «Регистрация 1 шаг» (1:2548)
 */
export function IllustrationCard({ image, title, text }: IllustrationCardProps) {
  return (
    <section className={styles.card}>
      <img className={styles.image} src={image} alt="" width={300} height={300} />
      <div className={styles.caption}>
        <h2 className={styles.title}>{title}</h2>
        {text && <p className={styles.text}>{text}</p>}
      </div>
    </section>
  )
}
