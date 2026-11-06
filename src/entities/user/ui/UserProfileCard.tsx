import { Tag, TagColor } from '@/shared/ui/Tag'
import type { PublicUser } from '../model/types'
import { type UserCardTag, Chip } from './UserCard'
import { UserSummary } from './UserSummary'

import styles from './UserProfileCard.module.css'
import { ReactNode } from 'react'

export interface UserProfileCardProps {
  user: PublicUser
  /** Название города из справочника — сама карточка города не знает */
  cityName: string
  /** «Может научить»: своё название навыка и его категория */
  teachSkill: UserCardTag
  /** «Хочет научиться»: подкатегории пользователя с категорией (от неё цвет чипа) */
  learnSubcategories: ReadonlyArray<UserCardTag & { id: string }>
}

/**
 * Расширенная карточка автора на странице навыка: блок `UserSummary` (аватар, имя, «город, возраст»),
 * «О себе» (только если заполнено — `user.about`) и чипы навыков, как в UserCard.
 * Данные о городе, навыке и подкатегориях приходят пропсами — их соберёт страница навыка (P3-09, P7-01) селекторами P4-02.
 * Образец устройства, stories и тестов — UserCard (P3-01).
 * @see Figma: «Страница навыка» (1:2764), левая колонка
 */
export function UserProfileCard(_props: UserProfileCardProps) {
  // TODO: реализовать по макету (P3-02)

  const renderedSubcategories = _props.learnSubcategories.map(
    (subcategory: UserCardTag & { id: string }, index: number): ReactNode => {
      return (
        <li key={index} className={styles.subcategoriesElement}>
          <Chip title={subcategory.title} categoryId={subcategory.categoryId} />
        </li>
      )
    },
  )

  return (
    <article className={styles.card}>
      <section className={styles.summary}>
        <UserSummary user={_props.user} cityName={_props.cityName} />
        <div className={styles.about}> {_props.user.about ?? ''}</div>
      </section>
      <section className={styles.learnSkills}>
        <h4 className={styles.skillsHeading}>Может научить</h4>
        <Chip title={_props.teachSkill.title} categoryId={_props.teachSkill.categoryId} />
      </section>
      <section className={styles.teachSkills}>
        <h4 className={styles.skillsHeading}>Хочет научиться</h4>
        <ul className={styles.subcategoriesList}>
          {renderedSubcategories}
        </ul>
      </section>
    </article>
  )
}
