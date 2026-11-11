import styles from './ProfileStub.module.css'
const STUB_TEXT = 'Раздел в разработке'

export interface ProfileStubProps {
  title: string
}

/**
 * Заглушка для разделов кабинета, которые еще в разработке.
 * @see Figma: «Профиль_личные данные» (1:2370)
 */
export function ProfileStub({ title }: ProfileStubProps) {
  return (
    <section className={styles.stub}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.text}>{STUB_TEXT}</p>
    </section>
  )
}
