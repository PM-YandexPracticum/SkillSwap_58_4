import { Outlet } from 'react-router-dom'

/**
 * Общая часть трёх шагов регистрации: Stepper «Шаг N из 3» сверху, форма шага слева (Outlet),
 * справа иллюстрация и подпись текущего шага. Логотип и «Закрыть ×» — из AuthLayout.
 * «Закрыть ×» сбрасывает черновик регистрации.
 * При входе в регистрацию запоминает `location.state.from` в `returnTo` — туда вернём после «Готово».
 */
export function RegisterLayout() {
  // TODO: Stepper + Outlet + иллюстрация шага
  return <Outlet />
}
