import type { ReactNode } from 'react'

import { SkillGallery } from './SkillGallery'
import type { Skill } from '../model/types'

import styles from './SkillInfo.module.css'

/**
 * Тип для передаваемых фич (слот actions)
 * Передаётся в виде объекта с необязательными свойствами, значение каждого свойства - ReactNode
 *
 * Пример:
 * {
 *  like: <IconButton ariaLabel='Добавить в избранное' icon=<LikeIcon />/>
 *  createOffer: <Button onClick={() => {}}>Предложить обмен</Button>
 *  share: <IconButton ariaLabel='Поделиться' icon=<ShareIcon />/>,
 *  more: <IconButton ariaLabel='Больше опций' icon=<MoreIcon />/>,
 * }
 *
 *
 */

export type SkillInfoActions = Partial<Record<'like' | 'createOffer' | 'share' | 'more', ReactNode>>

export interface SkillInfoProps {
  /** Навык: своё название и описание, изображения */
  skill: Pick<Skill, 'title' | 'description' | 'images'>
  /** Название категории из справочника — сам блок справочник не знает */
  categoryTitle: string
  /** Название подкатегории из справочника */
  subcategoryTitle: string
  /** Слот для фич, например «Предложить обмен» */
  actions?: SkillInfoActions
}

/**
 * Блок описания навыка: своё название, «Категория / Подкатегория», описание. Кнопки действий передаются через слот `actions`.
 * Названия категории и подкатегории приходят пропсами — их соберёт страница навыка (P3-09, P7-01) селекторами P4-02.
 * Галерея — общий SkillGallery; без фото показываем заглушку навыка.
 * Образец устройства, stories и тестов — UserCard (P3-01).
 * @see Figma: «Страница навыка» (1:2764)
 */

export function SkillInfo(_props: SkillInfoProps) {
  return (
    <article className={styles.card}>
      <div className={styles.action}>
        {_props.actions?.like}
        {_props.actions?.share}
        {_props.actions?.more}
      </div>
      <div className={styles.container}>
        <section className={styles.content}>
          <div className={styles.skill}>
            <h1 className={styles.skillName}>{_props.skill.title}</h1>
            <p className={styles.categories}>
              {`${_props.categoryTitle} / ${_props.subcategoryTitle}`}
            </p>
          </div>
          <p className={styles.skillDescription}>{_props.skill.description}</p>
          {_props.actions?.createOffer && (
            <div className={styles.actionCreateOffer}>{_props.actions?.createOffer}</div>
          )}
        </section>
        <SkillGallery
          title={_props.skill.title}
          images={_props.skill.images.length > 0 ? _props.skill.images : ['']}
        />
      </div>
    </article>
  )
}
