import type { ReactNode } from 'react'

import { CATALOG } from '@/shared/config'
import { Tag, isTagColor } from '@/shared/ui/Tag'

import type { PublicUser } from '../model/types'
import styles from './UserCard.module.css'
import { UserSummary } from './UserSummary'

/** Чип на карточке: название и категория (от неё цвет) */
export interface UserCardTag {
  title: string
  /** Id категории (`creativity`, `languages`…) */
  categoryId: string
}

export interface UserCardProps {
  user: PublicUser
  /** Название города из справочника — сама карточка города не знает */
  cityName: string
  /** «Может научить»: своё название навыка и его категория */
  teachSkill: UserCardTag
  /** «Хочет научиться»: подкатегории пользователя; на карточке — первые две и «+N» */
  learnSubcategories: ReadonlyArray<UserCardTag & { id: string }>
  /** Слот в правом верхнем углу (лайк со счётчиком, P3-08) */
  topAction?: ReactNode
  /** Слот внизу карточки («Подробнее» / «Обмен предложен», P3-08) */
  bottomAction?: ReactNode
}

export function Chip({ title, categoryId }: UserCardTag) {
  return <Tag label={title} color={isTagColor(categoryId) ? categoryId : undefined} />
}

/**
 * Карточка пользователя: аватар, имя, «город, возраст», «Может научить» (один чип — своё название навыка),
 * «Хочет научиться» (до двух чипов подкатегорий, остальные — «+N»). Сама ничего не «делает»: лайк со счётчиком
 * и «Подробнее» приходят через слоты. Данные о городе, навыке и подкатегориях приходят пропсами —
 * их собирает виджет карточки предложения (P3-08) из соседних сущностей.
 * Длинные названия чипов обрезаются многоточием (полное — в подсказке при наведении), «+N» виден всегда.
 * @see Figma: «Каталог - пользователь не авторизован» (1:2861), карточка Ивана (1:2877)
 */
export function UserCard({
  user,
  cityName,
  teachSkill,
  learnSubcategories,
  topAction,
  bottomAction,
}: UserCardProps) {
  const visibleLearn = learnSubcategories.slice(0, CATALOG.CARD_LEARN_TAGS)
  const hiddenCount = learnSubcategories.length - visibleLearn.length

  return (
    <article className={styles.card}>
      <UserSummary user={user} cityName={cityName} action={topAction} />

      <div className={styles.groups}>
        <div className={styles.group}>
          <h4 className={styles.label}>Может научить:</h4>
          <ul className={styles.tags} aria-label="Может научить">
            <li>
              <Chip {...teachSkill} />
            </li>
          </ul>
        </div>

        <div className={styles.group}>
          <h4 className={styles.label}>Хочет научиться:</h4>
          <ul className={styles.tags} aria-label="Хочет научиться">
            {visibleLearn.map((subcategory) => (
              <li key={subcategory.id}>
                <Chip {...subcategory} />
              </li>
            ))}
            {hiddenCount > 0 && (
              <li className={styles.more}>
                <Tag label={`+${hiddenCount}`} color="more" />
              </li>
            )}
          </ul>
        </div>
      </div>

      {bottomAction && <div className={styles.bottomAction}>{bottomAction}</div>}
    </article>
  )
}
