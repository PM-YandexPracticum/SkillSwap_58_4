import { Outlet, useNavigate } from 'react-router-dom'

import { CategoriesMenu } from '@/widgets/categories-menu'
import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'
import { NotificationsPanel, useNotifications, findSkillId } from '@/widgets/notifications-panel'
import { clearAllNotifications, markAllRead, selectNotifications } from '@/entities/notification'
import { selectExchanges } from '@/entities/exchange'
import { selectUserById } from '@/entities/user'
import { selectSkillById } from '@/entities/skill'
import { useAppDispatch } from '@/shared/lib/store'
import { useToast } from '@/shared/lib/toast'
import { DATA_ERRORS, getSkillRoute } from '@/shared/config'
import styles from './MainLayout.module.css'

/**
 * Основной лейаут: Header + контент страницы + Footer.
 * Используется для каталога, навыка, профиля, избранного, «О проекте».
 * Ширину контента задаёт лейаут; основную область main предоставляет страница.
 * Подключает NotificationsPanel через слот Header: один загрузчик работает
 * и при закрытом колокольчике, действия сохраняются через thunks сущности.
 * «Перейти» проверяет доступный навык адресата по актуальному store.
 * @see Figma: «Каталог — пользователь не авторизован» (1:2861)
 * @see Figma: уведомления (1:2148, 1:2239)
 */
export function MainLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { notifications, status, error, loadError, retry } = useNotifications()

  const handleGo = (notificationId: string) => {
    const skillId = dispatch((_, getState) => {
      const state = getState()
      const notification = selectNotifications(state).find((item) => item.id === notificationId)
      if (!notification || notification.isRead) return
      const recipient = selectUserById(state, notification.toUserId)
      const id =
        findSkillId(notification.exchangeId, selectExchanges(state)) ?? recipient?.teachSkillId
      const skill = id ? selectSkillById(state, id) : undefined
      return skill?.authorId === notification.toUserId ? skill.id : undefined
    })
    if (skillId) navigate(getSkillRoute(skillId))
    else showToast(DATA_ERRORS.NOTIFICATION_TARGET)
  }

  return (
    <div className={styles.layout}>
      <div className={styles.headerWrap}>
        <Header
          categoriesMenu={<CategoriesMenu />}
          notifications={
            <NotificationsPanel
              notifications={notifications}
              status={status}
              loadError={loadError}
              actionError={loadError ? null : error}
              onRetry={retry}
              onMarkAllRead={() => {
                void dispatch(markAllRead())
              }}
              onClear={() => {
                void dispatch(clearAllNotifications())
              }}
              onGo={handleGo}
            />
          }
        />
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
