/**
 * Считает размеры, до которых надо уменьшить картинку, чтобы её длинная
 * сторона не превышала limit. Если фото уже меньше — возвращает его размеры
 * как есть. Пропорции сохраняются, результат округляется до целых пикселей.
 *
 * @param width  - ширина оригинала, px
 * @param height - высота оригинала, px
 * @param limit  - максимальная длина длинной стороны, 800 px по умолчанию
 * @returns новые ширина и высота для canvas
 */
export function getScaledSize(
  width: number,
  height: number,
  limit = 800,
): { width: number; height: number } {
  const longestSide = Math.max(width, height)

  if (longestSide <= limit) {
    return { width, height }
  }

  if (width >= height) {
    return { width: limit, height: Math.round((height * limit) / width) }
  }

  return { width: Math.round((width * limit) / height), height: limit }
}
