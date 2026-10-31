export interface OfferCreatedModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Окно после регистрации: галочка, «Ваше предложение создано», «Теперь вы можете предложить обмен», «Готово».
 * После регистрации пользователь всегда попадает в каталог (ТЗ наставника, 2.6), окно показывается там (1:2950);
 * после «Готово» — каталог с шапкой вошедшего (1:2904).
 * Как показать: `navigate(ROUTES.HOME, { state: { offerCreated: true } })`, страница каталога видит флаг и открывает окно.
 * @see Figma: 1:2950, 1:2904
 */
export function OfferCreatedModal(_props: OfferCreatedModalProps) {
  // TODO: реализовать по макету на основе shared/ui/Modal
  return null
}
