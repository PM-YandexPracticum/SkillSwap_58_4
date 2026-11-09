/**
 * Перемешивает массив в случайном порядке (Фишер — Йетс) и возвращает НОВЫЙ массив.
 * Нужен для «Рекомендуем»: рекомендаций без сервера нет, поэтому показываем всех в случайном порядке.
 * Перемешивать один раз при загрузке, а не на каждый рендер, — иначе карточки будут прыгать.
 * @param items исходный массив, не изменяется
 * @param random источник случайности в диапазоне [0, 1), как Math.random (параметр для тестов)
 */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const copyOfArray = [...items]

  for (let i = copyOfArray.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[copyOfArray[i], copyOfArray[j]] = [copyOfArray[j], copyOfArray[i]]
  }

  return copyOfArray
}
