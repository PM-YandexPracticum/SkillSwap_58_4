import { shallowEqual } from 'react-redux'
import { Link } from 'react-router-dom'

import {
  findSubcategories,
  selectCategories,
  selectCategoryBySubcategoryId,
} from '@/entities/category'
import { getCityName, selectCities } from '@/entities/city'
import { ExchangeStatusBadge, selectHasProposed } from '@/entities/exchange'
import { selectSkillById } from '@/entities/skill'
import { UserCard, type PublicUser } from '@/entities/user'
import { FavoriteButton } from '@/features/favorite-toggle'
import { getSkillRoute } from '@/shared/config'
import { useAppSelector } from '@/shared/lib/store'

import styles from './OfferCard.module.css'

export interface OfferCardProps {
  /** Автор карточки без пароля; справочники, сессия и обмены читаются из store. */
  user: PublicUser
}

/**
 * Собирает UserCard из автора и данных store: справочников, сессии и обменов.
 * Исходящее предложение текущего пользователя этому автору заменяет «Подробнее» статичным бейджем.
 * Проверка выполняется по паре пользователей независимо от навыка; входящего предложения недостаточно.
 * Сам виджет данные не загружает: общий контейнер вызывает `loadExchangesIfNeeded()`
 * один раз для страницы и повторяет запрос после состояния `failed`.
 * @see Figma: каталог (1:2861), карточка со статусом обмена (1:2106)
 */
export function OfferCard({ user }: OfferCardProps) {
  const hasProposed = useAppSelector((state) => selectHasProposed(state, user.id))
  const cityName = useAppSelector((state) => getCityName(selectCities(state), user.cityId))
  const skill = useAppSelector((state) => selectSkillById(state, user.teachSkillId))
  const category = useAppSelector((state) =>
    selectCategoryBySubcategoryId(state, skill?.subcategoryId ?? ''),
  )
  const learnSubcategories = useAppSelector(
    (state) => findSubcategories(selectCategories(state), user.learnSubcategoryIds),
    shallowEqual,
  )

  return (
    <UserCard
      user={user}
      cityName={cityName}
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
