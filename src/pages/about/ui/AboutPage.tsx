import { resolveImageUrl } from '@/shared/lib/image'
import type { TeamMember } from '../config/team'
import { TEAM } from '../config/team'
import GithubIcon from '@/shared/assets/icons/brands/github.svg?react'
import styles from './AboutPage.module.css'

/**
 * Пропсы страницы «О проекте».
 * `members` позволяет проверять сетку и состояния карточек в тестах и Storybook
 * независимо от текущего состава TEAM. Макет: 1:3249.
 */
export interface AboutPageProps {
  /** Участники команды. По умолчанию — TEAM из config/team.ts. */
  members?: readonly TeamMember[]
}

/** Первая буква имени — заглушка, если у участника нет фото (photoUrl === null). */
function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase()
}

/** Пропсы карточки участника (внутренняя функция, поэтому интерфейс не экспортируем). */
interface MemberCardProps {
  member: TeamMember
}

/**
 * Внутренняя карточка участника: фото, имя, роль, «Обо мне», ссылка на GitHub.
 * Отдельным файлом не выносим — по ui/README.md компонент страницы один.
 *
 * @see Figma: «О проекте» (1:3249).
 */
function MemberCard({ member }: MemberCardProps) {
  const { name, role, github, photoUrl, about } = member

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        {photoUrl ? (
          <img
            className={styles.avatar}
            src={resolveImageUrl(photoUrl, 'AVATAR')}
            alt={`Фото: ${name}`}
          />
        ) : (
          <span
            className={styles.avatarFallback}
            role="img"
            aria-label={`Фото: ${name} отсутствует`}
          >
            {getInitial(name)}
          </span>
        )}
        <div className={styles.userInfo}>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.text}>Роль в проекте: {role}</p>
        </div>
      </header>

      <section className={styles.about}>
        <h3 className={styles.text}>Обо мне:</h3>
        <p className={styles.text}>{about}</p>
      </section>

      <section className={styles.contact}>
        <h3 className={styles.text}>Связаться со мной:</h3>
        <a
          className={`${styles.githubLink} ${styles.text}`}
          href={github}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon className={styles.githubIcon} width={24} height={24} />
          <span className={styles.githubUrl}>{github}</span>
        </a>
      </section>
    </article>
  )
}

/**
 * Страница «О проекте» (/about) — команда SkillSwap: сетка карточек участников.
 * Ссылка на страницу есть в шапке и в футере. Данные — из config/team.ts.
 *
 * @see Figma: «О проекте» (1:3249).
 */
export function AboutPage({ members = TEAM }: AboutPageProps) {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Команда разработчиков SkillSwap</h1>
      <ul className={styles.cards}>
        {members.map((member) => (
          <li key={member.id} className={styles.cardsItem}>
            <MemberCard member={member} />
          </li>
        ))}
      </ul>
    </main>
  )
}
