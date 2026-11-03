import { VALIDATION } from '@/shared/config'

/**
 * Считает размеры, до которых надо уменьшить картинку, чтобы её длинная
 * сторона не превышала limit. Если фото уже меньше — возвращает его размеры
 * как есть. Пропорции сохраняются, результат округляется до целых пикселей.
 *
 * @param width  - ширина оригинала, px
 * @param height - высота оригинала, px
 * @param limit  - максимальная длина длинной стороны, по умолчанию `VALIDATION.IMAGE.MAX_SIDE_PX` (800 px)
 * @returns новые ширина и высота для canvas
 */
export function getScaledSize(
  width: number,
  height: number,
  limit: number = VALIDATION.IMAGE.MAX_SIDE_PX,
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
