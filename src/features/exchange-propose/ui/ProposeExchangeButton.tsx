export interface ProposeExchangeButtonProps {
  toUserId: string
  skillId: string
}

/**
 * Кнопка «Предложить обмен» на странице навыка.
 * Гость → регистрация (`/register/step-1`) с запоминанием страницы; после регистрации он вернётся сюда (1:3052).
 * Вошедший: создаётся обмен и уведомление «Вы предложили обмен …», открывается ExchangeProposedModal (1:1977);
 * после «Готово» кнопка становится обведённой неактивной «🕓 Обмен предложен», на колокольчике — красная точка (1:1919).
 * @see Figma: «Страница навыка» (1:1864), заметки дизайнера рядом с 1:1977 и 1:1919
 */
export function ProposeExchangeButton(_props: ProposeExchangeButtonProps) {
  // TODO: реализовать по макету
  return null
}
