import { useEffect, useRef } from 'react'
import { useMatch } from 'react-router-dom'

import { registerReset } from '@/features/register'
import { ROUTES } from '@/shared/config'
import { useAppDispatch } from '@/shared/lib/store'

/**
 * Очищает черновик при выходе из маршрутов регистрации, включая ссылки и историю браузера.
 * Живёт рядом с Routes: cleanup эффекта не означает выход со страницы (StrictMode, повторный mount).
 * Переходы между шагами не сбрасывают данные. Логика маршрутизации — P6-01, фрейм не требуется.
 */
export function RegisterDraftLifecycle() {
  const isRegister = Boolean(useMatch(`${ROUTES.REGISTER}/*`))
  const wasRegister = useRef(isRegister)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (wasRegister.current && !isRegister) {
      dispatch(registerReset())
    }
    wasRegister.current = isRegister
  }, [dispatch, isRegister])

  return null
}
