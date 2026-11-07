import { shallowEqual } from 'react-redux'
import { Link } from 'react-router-dom'

import { selectCategoryBySubcategoryId, selectSubcategoryById } from '@/entities/category'
import { selectCityById } from '@/entities/city'
import { selectHasProposed, ExchangeStatusBadge } from '@/entities/exchange'
import { selectSkills } from '@/entities/skill'
import { UserCard, type PublicUser } from '@/entities/user'
import { selectSession } from '@/entities/session'
import { FavoriteButton } from '@/features/favorite-toggle'
import { getSkillRoute } from '@/shared/config'
import { useAppSelector } from '@/shared/lib/store'


import styles from './OfferCard.module.css'

export interface OfferCardProps {
  user: PublicUser
}

export function OfferCard({ user }: OfferCardProps) {

  const session = useAppSelector(selectSession);
  const currentUserId = session?.userId;


  const hasProposed = useAppSelector((state) =>
    currentUserId ? selectHasProposed(state, user.id) : false
  );


  const city = useAppSelector((state) => selectCityById(state, user.cityId))
  const skills = useAppSelector(selectSkills)
  const skill = skills.find((item) => item.id === user.teachSkillId)
  const category = useAppSelector((state) =>
    selectCategoryBySubcategoryId(state, skill?.subcategoryId ?? ''),
  )
  const subcategories = useAppSelector(
    (state) => user.learnSubcategoryIds.map((id) => selectSubcategoryById(state, id)),
    shallowEqual,
  )
  const learnSubcategories = subcategories.flatMap((subcategory) =>
    subcategory ? [subcategory] : [],
  )

  return (
    <UserCard
      user={user}
      cityName={city?.name ?? 'Город не указан'}
      teachSkill={{
        title: skill?.title ?? 'Навык не найден',
        categoryId: category?.id ?? skill?.categoryId ?? '',
      }}
      learnSubcategories={learnSubcategories}
      topAction={<FavoriteButton userId={user.id} likesCount={user.likesCount} />}
      bottomAction={
        hasProposed ? (
          <ExchangeStatusBadge />
        ) : (
          <Link className={styles.details} to={getSkillRoute(user.teachSkillId)}>
            Подробнее
          </Link>
        )
      }
    />
  )
}
