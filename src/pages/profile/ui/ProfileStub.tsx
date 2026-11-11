import styles from './ProfileStub.module.css';

export interface ProfileStubProps {
  title: string;
}

/**
 * Заглушка для разделов кабинета, которые еще в разработке.
 */
export function ProfileStub({ title }: ProfileStubProps) {
  return (
    <section className={styles.stub}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.text}>Раздел в разработке</p>
    </section>
  );
}
