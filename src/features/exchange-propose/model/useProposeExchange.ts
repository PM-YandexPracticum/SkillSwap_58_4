import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  loadExchangesIfNeeded,
  selectExchangesStatus,
  selectHasProposed,
} from '@/entities/exchange'
import { selectSession } from '@/entities/session'
import { DATA_ERRORS, ROUTES } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { useToast } from '@/shared/lib/toast'

import {
  persistExchangeProposal,
  proposeExchange,
  type ProposeExchangeParams,
} from './proposeExchange'

type Recipient = Pick<ProposeExchangeParams, 'toUserId' | 'skillId' | 'toUserName' | 'toUserGender'>

/**
 * Сценарий кнопки обмена: переход гостя, запись данных и состояние подтверждения.
 * При смене навыка, сессии или размонтировании поздний ответ сохраняет данные,
 * но не открывает окно и не показывает ошибку на другой странице.
 */
export function useProposeExchange({ toUserId, skillId, toUserName, toUserGender }: Recipient) {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const session = useAppSelector(selectSession)
  const isProposed = useAppSelector((state) => selectHasProposed(state, toUserId))
  const exchangesStatus = useAppSelector(selectExchangesStatus)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const operationRef = useRef<object | null>(null)

  useEffect(() => {
    setIsSubmitting(false)
    setIsModalOpen(false)
    setError(null)
    return () => {
      operationRef.current = null
    }
  }, [skillId, toUserId, session?.userId, session?.token])

  useEffect(() => {
    if (!session) return
    void dispatch(loadExchangesIfNeeded())
  }, [dispatch, session])

  const isPending =
    isSubmitting || (!!session && (exchangesStatus === 'idle' || exchangesStatus === 'loading'))

  const handlePropose = async () => {
    if (!session) {
      navigate(ROUTES.LOGIN, { state: { from: location } })
      return
    }
    if (!toUserId || isProposed || isPending || operationRef.current) return

    const operation = {}
    operationRef.current = operation
    setIsSubmitting(true)
    setError(null)
    const proposal = proposeExchange({
      fromUserId: session.userId,
      toUserId,
      skillId,
      toUserName,
      toUserGender,
    })
    try {
      await dispatch(persistExchangeProposal(proposal))
      if (operationRef.current !== operation) return
      showToast(proposal.message)
      setIsModalOpen(true)
    } catch (error) {
      if (operationRef.current !== operation) return
      const message =
        typeof error === 'string' && Object.values(DATA_ERRORS).some((value) => value === error)
          ? error
          : DATA_ERRORS.SAVE_EXCHANGE
      setError(message)
      showToast(message)
    } finally {
      if (operationRef.current === operation) {
        operationRef.current = null
        setIsSubmitting(false)
      }
    }
  }

  return {
    isProposed,
    isPending,
    isModalOpen,
    error,
    handlePropose,
    closeModal: () => setIsModalOpen(false),
  }
}
