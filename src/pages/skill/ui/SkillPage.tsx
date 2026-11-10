import { useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { fetchCategories, selectCategories, selectCategoriesStatus } from '@/entities/category'
import { fetchCities, selectCities, selectCitiesStatus } from '@/entities/city'
import { fetchSkills, selectSkills, selectSkillsStatus, selectSkillById } from '@/entities/skill'
import { fetchUsers, selectUsers, selectUsersStatus, selectUserById } from '@/entities/user'
import { ExchangeProposedModal } from '@/features/exchange-propose'
import { ROUTES } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { Loader } from '@/shared/ui/Loader'
import { OfferCard } from '@/widgets/offer-card'
import { OffersCarousel } from '@/widgets/offers-carousel'
import { SkillDetails } from '@/widgets/skill-details'

import { buildSkillPageData } from '../lib/buildSkillPageData'
import styles from './SkillPage.module.css'

/**
 * Временная загрузка данных для прямого захода до появления P4-04.
 * TODO(P4-04): удалить вместе с `loadCatalogData` из `CatalogPage` после подключения общего DataProvider.
 * Читаем состояние внутри thunk, а не из замыкания эффекта: React StrictMode
 * запускает effect повторно и не должен создавать второй запрос.
 */
function loadSkillPageResources() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState()

    if (state.users.status === 'idle') void dispatch(fetchUsers())
    if (state.skills.status === 'idle') void dispatch(fetchSkills())
    if (state.categories.status === 'idle') void dispatch(fetchCategories())
    if (state.cities.status === 'idle') void dispatch(fetchCities())
  }
}

/**
 * Страница навыка `/skill/:id`: SkillDetails (автор, навык, галерея) + «Похожие предложения» (OffersCarousel).
 * Данные и справочники читает из Redux-состояния через селекторы P4-02/P4-03. До P4-04 страница
 * сама запускает недостающие загрузочные thunk-и; после появления общего DataProvider этот effect
 * ничего не запускает, если данные уже загружаются или загружены.
 *
 * Кнопка «Предложить обмен» и окно «Вы предложили обмен» здесь только показывают состояния из макета:
 * после «Готово» кнопка становится «Обмен предложен». Ничего не сохраняется и после перезагрузки сбрасывается —
 * настоящий обмен, уведомление и вход для гостя подключит P7-03.
 * @see Figma: «Страница навыка» (1:2764, 1:2709, 1:3110, 1:3052), окно 1:1977, «Обмен предложен» 1:1919
 */
export function SkillPage() {
  const { id = '' } = useParams()
  const dispatch = useAppDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProposed, setIsProposed] = useState(false)
  const skill = useAppSelector((state) => selectSkillById(state, id))
  const author = useAppSelector((state) =>
    skill ? selectUserById(state, skill.authorId) : undefined,
  )
  const skills = useAppSelector(selectSkills)
  const users = useAppSelector(selectUsers)
  const categories = useAppSelector(selectCategories)
  const cities = useAppSelector(selectCities)
  const skillsStatus = useAppSelector(selectSkillsStatus)
  const usersStatus = useAppSelector(selectUsersStatus)
  const categoriesStatus = useAppSelector(selectCategoriesStatus)
  const citiesStatus = useAppSelector(selectCitiesStatus)

  useEffect(() => {
    void dispatch(loadSkillPageResources())
  }, [dispatch])

  useEffect(() => {
    setIsModalOpen(false)
    setIsProposed(false)
  }, [id])

  const data = useMemo(
    () =>
      buildSkillPageData({
        skill,
        author,
        skills,
        users,
        categories,
        cities,
      }),
    [author, categories, cities, skill, skills, users],
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
    <main className={styles.page}>
      <SkillDetails
        skill={data.skill}
        author={data.author}
        cityName={cityName}
        categoryTitle={categoryTitle}
        subcategoryTitle={subcategoryTitle}
        learnSubcategories={learnSubcategories}
        isExchangeProposed={isProposed}
        onProposeExchange={() => setIsModalOpen(true)}
      />
      <OffersCarousel users={data.similarUsers} renderItem={(user) => <OfferCard user={user} />} />
      <ExchangeProposedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false)
          setIsProposed(true)
        }}
      />
    </main>
  )
}
