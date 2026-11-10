import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { getCategories } from '@/entities/category'
import { getCities } from '@/entities/city'
import { getSkills } from '@/entities/skill'
import { getUsers } from '@/entities/user'
import { ExchangeProposedModal } from '@/features/exchange-propose'
import { ROUTES } from '@/shared/config'
import { OfferCard } from '@/widgets/offer-card'
import { OffersCarousel } from '@/widgets/offers-carousel'
import { SkillDetails } from '@/widgets/skill-details'

import { buildSkillPageData, type SkillPageData } from '../lib/buildSkillPageData'
import styles from './SkillPage.module.css'

/**
 * Страница навыка `/skill/:id`: SkillDetails (автор, навык, галерея) + «Похожие предложения» (OffersCarousel).
 * Пока нет селекторов навыка (P4-03) и загрузки при старте (P4-04), данные берём из `entities/*\/api`;
 * в фазах 4–7 этот вызов заменят селекторы store. Если загрузка не удалась — страница ошибки сервера.
 *
 * Кнопка «Предложить обмен» и окно «Вы предложили обмен» здесь только показывают состояния из макета:
 * после «Готово» кнопка становится «Обмен предложен». Ничего не сохраняется и после перезагрузки сбрасывается —
 * настоящий обмен, уведомление и вход для гостя подключит P7-04.
 * @see Figma: «Страница навыка» (1:2764, 1:2709, 1:3110, 1:3052), окно 1:1977, «Обмен предложен» 1:1919
 */
export function SkillPage() {
  const { id = '' } = useParams()
  const [data, setData] = useState<SkillPageData | null>(null)
  const [isFailed, setIsFailed] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProposed, setIsProposed] = useState(false)

  useEffect(() => {
    let cancelled = false
    setData(null)
    setIsFailed(false)
    setIsModalOpen(false)
    setIsProposed(false)

    Promise.all([getSkills(), getUsers(), getCategories(), getCities()])
      .then(([skills, users, categories, cities]) => {
        if (cancelled) return
        setData(buildSkillPageData({ skillId: id, skills, users, categories, cities }))
      })
      .catch(() => {
        if (!cancelled) setIsFailed(true)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (isFailed) return <Navigate to={ROUTES.SERVER_ERROR} replace />
  if (!data) return null

  const { skill, author, cityName, categoryTitle, subcategoryTitle, learnSubcategories } = data

  return (
    <main className={styles.page}>
      <SkillDetails
        skill={skill}
        author={author}
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
        onClose={() => {
          setIsModalOpen(false)
          setIsProposed(true)
        }}
      />
    </main>
  )
}
