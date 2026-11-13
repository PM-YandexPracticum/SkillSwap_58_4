import {
  addExchange,
  completeExchangeProposal,
  fetchExchanges,
  selectOutgoingExchange,
  type Exchange,
} from '@/entities/exchange'
import { ensureExchangeNotification, type Notification } from '@/entities/notification'
import { DATA_ERRORS } from '@/shared/config'
import { formatRecipientName } from '@/shared/lib/formatRecipientName'
import type { ID, ISODateString } from '@/shared/types'

export interface ProposeExchangeParams {
  /** Текущий пользователь — отправитель предложения. */
  fromUserId: ID
  /** Автор навыка — получатель предложения. */
  toUserId: ID
  /** Навык, на который пользователь откликается. */
  skillId: ID
  /** Имя автора навыка в именительном падеже. */
  toUserName: string
  /** Пол нужен для неоднозначных окончаний имён; неизвестные формы не угадываем. */
  toUserGender?: 'male' | 'female' | null
  /** Дата предложения; параметр можно передать в тестах. */
  createdAt?: ISODateString
}

export interface ExchangeProposal {
  exchange: Exchange
  message: string
}

/** Уведомление всегда использует владельца, адресата и дату фактически сохранённого обмена. */
function buildNotification(exchange: Exchange): Notification {
  return {
    id: `notification-${exchange.id}`,
    userId: exchange.fromUserId,
    toUserId: exchange.toUserId,
    exchangeId: exchange.id,
    isRead: false,
    createdAt: exchange.createdAt,
  }
}

/**
 * Подготавливает обмен и текст подтверждения. Уведомление строится только после сохранения обмена.
 * Идентификаторы детерминированы: повторная попытка после частичного сбоя
 * обращается к тому же обмену и не создаёт дубли.
 */
export function proposeExchange({
  fromUserId,
  toUserId,
  skillId,
  toUserName,
  toUserGender,
  createdAt = new Date().toISOString(),
}: ProposeExchangeParams): ExchangeProposal {
  const exchangeId = `exchange-${fromUserId}-${toUserId}-${skillId}`
  const message = `Вы предложили обмен ${formatRecipientName(toUserName, toUserGender)}`

  const exchange: Exchange = {
    id: exchangeId,
    fromUserId,
    toUserId,
    skillId,
    createdAt,
    notificationPending: true,
  }
  return { exchange, message }
}

/**
 * Сохраняет обмен, затем уведомление и отметку завершения через операции сущностей.
 * notificationPending переживает перезагрузку: повтор не создаёт обмен заново и не восстанавливает
 * намеренно очищенные уведомления завершённых обменов. Данные читает из актуального store.
 */
export const persistExchangeProposal =
  (proposal: ExchangeProposal) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
    const userId = getState().session.session?.userId
    if (!userId) throw DATA_ERRORS.SIGN_IN
    if (userId !== proposal.exchange.fromUserId) throw DATA_ERRORS.OWNER
    let exchange = selectOutgoingExchange(getState(), proposal.exchange.toUserId)
    if (!exchange) {
      try {
        exchange = await dispatch(addExchange(proposal.exchange)).unwrap()
      } catch (error) {
        if (error !== DATA_ERRORS.DUPLICATE_EXCHANGE) throw error
        await dispatch(fetchExchanges()).unwrap()
        exchange = selectOutgoingExchange(getState(), proposal.exchange.toUserId)
        if (!exchange) throw error
      }
    }
    if (!exchange.notificationPending) return

    await dispatch(ensureExchangeNotification(buildNotification(exchange))).unwrap()
    await dispatch(completeExchangeProposal(exchange.id)).unwrap()
  }
