import { SkillInfo, type Skill } from '@/entities/skill'
import { UserProfileCard, type PublicUser, type UserProfileCardProps } from '@/entities/user'
import { ProposeExchangeButton } from '@/features/exchange-propose'
import { FavoriteButton } from '@/features/favorite-toggle'
import MoreIcon from '@/shared/assets/icons/more-square.svg?react'
import ShareIcon from '@/shared/assets/icons/share.svg?react'
import { IconButton } from '@/shared/ui/IconButton'

import styles from './SkillDetails.module.css'

export interface SkillDetailsProps {
  /** Навык, который показываем */
  skill: Skill
  /** Автор навыка без пароля */
  author: PublicUser
  /** Название города автора из справочника */
  cityName: string
  /** Название категории навыка из справочника */
  categoryTitle: string
  /** Название подкатегории навыка из справочника */
  subcategoryTitle: string
  /** «Хочет научиться» автора: подкатегории с категорией (от неё цвет чипа) */
  learnSubcategories: UserProfileCardProps['learnSubcategories']
  /** Обмен уже предложен: вместо «Предложить обмен» — обведённая «Обмен предложен» */
  isExchangeProposed?: boolean
  /** Нажатие на «Предложить обмен»; логику (вход, обмен, уведомление) подключит P7-04 */
  onProposeExchange?: () => void
}

/**
 * Верх страницы навыка: слева карточка автора, справа блок навыка с галереей. Данные приходят пропсами —
 * их собирает страница. В правом верхнем углу блока навыка: лайк (как на карточке — сердечко со счётчиком),
 * «поделиться» и «⋯» — заглушки, ничего не делают. Галерея внутри `SkillInfo`.
 * @see Figma: «Страница навыка» (1:2764), «Обмен предложен» (1:1919)
 */
export function SkillDetails({
  skill,
  author,
  cityName,
  categoryTitle,
  subcategoryTitle,
  learnSubcategories,
  isExchangeProposed = false,
  onProposeExchange,
}: SkillDetailsProps) {
  return (
    <section className={styles.skill} aria-label="Навык">
      <div>
        <UserProfileCard
          user={author}
          cityName={cityName}
          teachSkill={{ title: skill.title, categoryId: skill.categoryId }}
          learnSubcategories={learnSubcategories}
        />
      </div>
      <div>
        <SkillInfo
          skill={skill}
          categoryTitle={categoryTitle}
          subcategoryTitle={subcategoryTitle}
          actions={{
            like: <FavoriteButton userId={author.id} likesCount={author.likesCount} />,
            createOffer: (
              <ProposeExchangeButton
                toUserId={author.id}
                skillId={skill.id}
                isProposed={isExchangeProposed}
                onClick={onProposeExchange}
              />
            ),
            share: <IconButton ariaLabel="Поделиться" icon={<ShareIcon aria-hidden="true" />} />,
            more: <IconButton ariaLabel="Больше опций" icon={<MoreIcon aria-hidden="true" />} />,
          }}
        />
      </div>
    </section>
  )
}
