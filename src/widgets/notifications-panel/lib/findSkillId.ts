import type { Exchange } from '@/entities/exchange'
import type { ID } from '@/shared/types'

/**
 * Находит `skillId` навыка получателя для кнопки «Перейти» в уведомлении.
 *
 * Зачем нужен слой: `Notification` (P4-06) не хранит `skillId`, но хранит
 * `exchangeId` — id обмена, из которого он создан. А `Exchange` хранит
 * `skillId` — «навык получателя» (см. `entities/exchange/model/types.ts`).
 * По ТЗ P7-05 «Перейти» открывает ***страницу навыка*** того, кому предложили
 * обмен, поэтому маршрут — `/skill/:id`, где `id` — это `skillId`.
 *
 * Разрешение связи `Notification.exchangeId → Exchange.skillId` спрятано здесь,
 * чтобы `ui` и `useNotifications` не знали про слайс `exchange`.
 *
 * @param exchangeId - id обмена из `notification.exchangeId`
 * @param exchanges - полный список обменов (из `selectExchanges`)
 * @returns `skillId` получателя либо `undefined`; MainLayout проверяет запасную
 *          ссылку из профиля адресата и владельца навыка перед переходом.
 * @see Figma: 1:2148 (окно уведомлений)
 * @see docs/requirements/tz.md — P7-05
 */

export function findSkillId(exchangeId: ID, exchanges: Exchange[]): ID | undefined {
  const exchange = exchanges.find((item) => item.id === exchangeId)

  return exchange?.skillId
}
