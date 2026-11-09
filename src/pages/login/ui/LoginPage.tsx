import { LoginForm } from '@/features/auth-by-email'
import { OAuthButtons } from '@/features/auth-oauth'
import lightBulb from '@/shared/assets/images/light-bulb.svg'
import { AuthPageLayout } from '@/shared/ui/AuthPageLayout'
import { IllustrationCard } from '@/shared/ui/IllustrationCard'

/**
 * Вёрстка отдельной страницы входа: форма и OAuth-заглушки слева, иллюстрация справа.
 * Логотип и закрытие предоставляет внешний AuthLayout. Проверку данных и вход подключает P4-09.
 * @see Figma: «Вход» (1:2400), ошибка — 1:2473
 */
export function LoginPage() {
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
      <LoginForm />
    </AuthPageLayout>
  )
}
