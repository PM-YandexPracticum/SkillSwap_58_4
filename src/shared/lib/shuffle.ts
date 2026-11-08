/**
 * Перемешивает массив в случайном порядке (Фишер — Йетс) и возвращает НОВЫЙ массив.
 * Нужен для «Рекомендуем»: рекомендаций без сервера нет, поэтому показываем всех в случайном порядке.
 * Перемешивать один раз при загрузке, а не на каждый рендер, — иначе карточки будут прыгать.
 * @param random источник случайности (параметр для тестов)
 */
export function shuffle<T>(_items: readonly T[], _random: () => number = Math.random): T[] {
  // TODO: реализовать без мутации входного массива + unit-тест
  const copyOfArray = [..._items]

  for (let i = copyOfArray.length - 1; i > 0; i--) {
    const j = Math.floor(_random() * (i + 1))
    ;[copyOfArray[i], copyOfArray[j]] = [copyOfArray[j], copyOfArray[i]]
  }

  return copyOfArray
}
