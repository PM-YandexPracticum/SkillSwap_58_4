import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { registerReset } from '@/features/register'
import lightBulb from '@/shared/assets/images/light-bulb.svg'
import userInfo from '@/shared/assets/images/user-info.svg'
import schoolBoard from '@/shared/assets/images/school-board.svg'
import { ROUTES } from '@/shared/config'
import { useAppDispatch } from '@/shared/lib/store'
import { AuthPageLayout } from '@/shared/ui/AuthPageLayout'
import { IllustrationCard } from '@/shared/ui/IllustrationCard'
import { Stepper } from '@/shared/ui/Stepper'
import styles from './RegisterLayout.module.css'

const STEPS = [
  {
    path: ROUTES.REGISTER_STEP_1,
    image: lightBulb,
    title: 'Добро пожаловать в SkillSwap!',
    text: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
  },
  {
    path: ROUTES.REGISTER_STEP_2,
    image: userInfo,
    title: 'Расскажите немного о себе',
    text: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
  },
  {
    path: ROUTES.REGISTER_STEP_3,
    image: schoolBoard,
    title: 'Укажите, чем вы готовы поделиться',
    text: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
  },
] as const

/**
 * Общая часть трёх шагов регистрации: Stepper «Шаг N из 3» сверху, форма шага слева (Outlet),
 * справа иллюстрация и подпись текущего шага. Логотип и «Закрыть ×» — из AuthLayout.
 * Номер шага и иллюстрация определяются адресом.
 * Черновик живёт, пока пользователь внутри регистрации: между шагами рамка остаётся на месте, поэтому «Назад»
 * ничего не стирает. Ушёл из регистрации (логотип, ссылка на вход, «Назад» браузера) — рамка исчезает
 * и сбрасывает черновик, чтобы введённые email и пароль не остались в store. «Закрыть ×» сбрасывает его сам (AuthLayout).
 * @see Figma: 1:2548, 1:1497, 1:1761
 */
export function RegisterLayout() {
  const { pathname } = useLocation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    return () => {
      dispatch(registerReset())
    }
  }, [dispatch])

  const index = STEPS.findIndex((step) => step.path === pathname.replace(/\/$/, ''))
  const currentIndex = Math.max(0, index)
  const step = STEPS[currentIndex]

  return (
    <AuthPageLayout
      title="Регистрация"
      progress={<Stepper current={currentIndex + 1} total={STEPS.length} />}
      formClassName={currentIndex === 1 ? styles.profilePanel : undefined}
      illustration={<IllustrationCard image={step.image} title={step.title} text={step.text} />}
    >
      <Outlet />
    </AuthPageLayout>
  )
}
