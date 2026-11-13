import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { selectCategories, selectCategoriesStatus } from '@/entities/category'
import { selectCities, selectCitiesStatus } from '@/entities/city'
import { selectSkillsStatus, selectSkillById } from '@/entities/skill'
import { selectUsersStatus, selectUserById } from '@/entities/user'
import { ExchangeProposedModal, useProposeExchange } from '@/features/exchange-propose'
import { ROUTES } from '@/shared/config'
import { useAppSelector } from '@/shared/lib/store'
import { Loader } from '@/shared/ui/Loader'
import { OfferCard } from '@/widgets/offer-card'
import { OffersCarousel } from '@/widgets/offers-carousel'
import { SkillDetails } from '@/widgets/skill-details'

import { buildSkillPageData } from '../lib/buildSkillPageData'
import { selectSimilarUsers } from '../model/selectSimilarUsers'
import styles from './SkillPage.module.css'

/** Возвращает пользователя к началу нового навыка, в том числе при переходе с клавиатуры. */
function focusSkillPage(node: HTMLElement | null) {
  if (!node) return

  node.focus({ preventScroll: true })
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}

/**
 * Подбор похожих соединяет публичные данные user/skill в model страницы, без связи сущностей друг с другом.
 * Страница навыка `/skill/:id`: SkillDetails (автор, навык, галерея) + «Похожие предложения» (OffersCarousel).
 * Данные и справочники читает из Redux-состояния через селекторы P4-02/P4-03. Стартовую загрузку
 * до открытия маршрута выполняет общий DataProvider; предложения обмена страница загружает отдельно,
 * потому что они нужны только авторизованному пользователю. При смене навыка возвращает прокрутку
 * и фокус к началу страницы, сбрасывает галерею и состояние операции.
 *
 * Гость переходит на вход с сохранённым адресом страницы. Вошедший пользователь создаёт одну
 * пару «обмен + уведомление» через готовые операции сущностей; повторная попытка после частичного
 * сбоя восстанавливается по сохранённому признаку notificationPending даже после перезагрузки.
 * @see Figma: «Страница навыка» (1:2764, 1:2709, 1:3110, 1:3052), окно 1:1977, «Обмен предложен» 1:1919
 */
export function SkillPage() {
  const { id = '' } = useParams()
  const skill = useAppSelector((state) => selectSkillById(state, id))
  const author = useAppSelector((state) =>
    skill ? selectUserById(state, skill.authorId) : undefined,
  )
  const similarUsers = useAppSelector((state) => selectSimilarUsers(state, id))
  const categories = useAppSelector(selectCategories)
  const cities = useAppSelector(selectCities)
  const skillsStatus = useAppSelector(selectSkillsStatus)
  const usersStatus = useAppSelector(selectUsersStatus)
  const categoriesStatus = useAppSelector(selectCategoriesStatus)
  const citiesStatus = useAppSelector(selectCitiesStatus)
  const exchange = useProposeExchange({
    toUserId: author?.id ?? '',
    skillId: id,
    toUserName: author?.name ?? '',
    toUserGender: author?.gender,
  })

  const data = useMemo(
    () =>
      buildSkillPageData({
        skill,
        author,
        categories,
        cities,
      }),
    [author, categories, cities, skill],
  )

  const statuses = [skillsStatus, usersStatus, categoriesStatus, citiesStatus]
  if (statuses.includes('failed')) return <Navigate to={ROUTES.SERVER_ERROR} replace />
  if (statuses.some((status) => status === 'idle' || status === 'loading')) {
    return (
      <main className={styles.page} aria-label="Страница навыка" aria-busy="true">
        <Loader />
      </main>
    )
  }
  if (!data) return <Navigate to={ROUTES.NOT_FOUND} replace />

  const { cityName, categoryTitle, subcategoryTitle, learnSubcategories } = data

  return (
    // Ключ сбрасывает галерею и похожие предложения только при смене навыка.
    <main
      key={id}
      ref={focusSkillPage}
      className={styles.page}
      tabIndex={-1}
      aria-label={data.skill.title}
    >
      <SkillDetails
        skill={data.skill}
        author={data.author}
        cityName={cityName}
        categoryTitle={categoryTitle}
        subcategoryTitle={subcategoryTitle}
        learnSubcategories={learnSubcategories}
        isExchangeProposed={exchange.isProposed}
        isExchangePending={exchange.isPending}
        onProposeExchange={exchange.handlePropose}
      />
      {exchange.error && (
        <p className={styles.exchangeError} role="alert">
          {exchange.error}
        </p>
      )}
      <OffersCarousel users={similarUsers} renderItem={(user) => <OfferCard user={user} />} />
      <ExchangeProposedModal
        isOpen={exchange.isModalOpen}
        onClose={exchange.closeModal}
        onConfirm={exchange.closeModal}
      />
    </main>
  )
}
