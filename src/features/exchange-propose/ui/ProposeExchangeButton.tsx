export interface ProposeExchangeButtonProps {
  toUserId: string
  skillId: string
}

/**
 * Кнопка «Предложить обмен» на странице навыка.
 * Гость → вход (`/login`) с запоминанием страницы; после входа он вернётся сюда (ТЗ наставника, 2.4).
 * Вошедший: создаётся обмен и уведомление «Вы предложили обмен …», показывается toast и открывается ExchangeProposedModal (1:1977);
 * после «Готово» кнопка становится обведённой неактивной «🕓 Обмен предложен», на колокольчике — красная точка (1:1919).
 * @see Figma: «Страница навыка» (1:1864), заметки дизайнера рядом с 1:1977 и 1:1919
 */
export function ProposeExchangeButton(_props: ProposeExchangeButtonProps) {
  // TODO: реализовать по макету
  return null
}
