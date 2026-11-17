import { useState } from 'react'
import { useLocation, useNavigate, type To } from 'react-router-dom'
import { login, LoginForm, type LoginFormValues } from '@/features/auth-by-email'
import { OAuthButtons } from '@/features/auth-oauth'
import lightBulb from '@/shared/assets/images/light-bulb.svg'
import { ROUTES } from '@/shared/config'
import { useAppDispatch } from '@/shared/lib/store'
import { AuthPageLayout } from '@/shared/ui/AuthPageLayout'
import { IllustrationCard } from '@/shared/ui/IllustrationCard'

function getReturnAddress(from: unknown): To {
  if (!from || typeof from !== 'object') return ROUTES.HOME

  const { pathname, search, hash } = from as Record<string, unknown>
  if (
    typeof pathname !== 'string' ||
    !pathname.startsWith('/') ||
    pathname.startsWith('//') ||
    pathname.includes('\\') ||
    pathname.includes('?') ||
    pathname.includes('#') ||
    /\s/.test(pathname)
  ) {
    return ROUTES.HOME
  }

  return {
    pathname,
    search:
      typeof search === 'string' && search.startsWith('?') && !search.includes('#') ? search : '',
    hash: typeof hash === 'string' && hash.startsWith('#') ? hash : '',
  }
}

/**
 * Страница входа. После успешной проверки возвращает пользователя на сохранённый маршрут.
 * @see Figma: «Вход» (1:2400), ошибка — 1:2473
 */
export function LoginPage() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const [error, setError] = useState<string>()

  const handleSubmit = (values: LoginFormValues) => {
    if (!dispatch(login(values))) {
      setError('Email или пароль введён неверно')
      return
    }
    navigate(getReturnAddress(location.state?.from), { replace: true })
  }

  return (
    <AuthPageLayout
      title="Вход"
      illustration={
        <IllustrationCard
          image={lightBulb}
          title="С возвращением в SkillSwap!"
          text="Обменивайтесь знаниями и навыками с другими людьми"
        />
      }
    >
      <OAuthButtons />
      <LoginForm onSubmit={handleSubmit} onEdit={() => setError(undefined)} error={error} />
    </AuthPageLayout>
  )
}
