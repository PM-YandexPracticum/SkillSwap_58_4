import { getScaledSize } from './getScaledSize'

/** Цвет подложки холста: JPEG не поддерживает прозрачность */
const CANVAS_BACKGROUND = '#fff'

/** Качество JPEG при сохранении: меньше веса при приемлемом виде */
const JPEG_QUALITY = 0.8

/**
 * Загружает картинку в память (не в DOM) и отдаёт её целиком: из элемента
 * берём настоящие `width` и `height`, а он же нужен для `drawImage`.
 *
 * `Image` сообщает о готовности событием, а не промисом, поэтому промис собираем вручную.
 *
 * @param src - data URL картинки
 * @returns промис с загруженным элементом картинки
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Не удалось прочитать изображение'))

    img.src = src
  })
}

/**
 * Уменьшает картинку до 800 px по длинной стороне и сохраняет её как JPEG.
 * Маленькие картинки возвращаются без изменений — холст не создаётся.
 *
 * @param src - data URL картинки
 * @returns промис с data URL: сжатым JPEG или исходной строкой
 */
async function resizeDataUrl(src: string): Promise<string> {
  const img = await loadImage(src)

  const size = getScaledSize(img.width, img.height)

  // фото в пределах лимита не трогаем: лишняя перекодировка портит качество
  if (size.width === img.width && size.height === img.height) {
    return src
  }

  // создать canvas нужного размера
  const canvas = document.createElement('canvas')
  canvas.width = size.width
  canvas.height = size.height

  // взять ctx, если холста нет — лучше вернуть оригинал, чем уронить сохранение
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return src
  }

  // заливаем белым: JPEG не поддерживает прозрачность и без фона отдаст чёрные пиксели
  ctx.fillStyle = CANVAS_BACKGROUND
  ctx.fillRect(0, 0, size.width, size.height)
  ctx.drawImage(img, 0, 0, size.width, size.height)

  return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
}

/**
 * Превращает выбранный файл картинки в data URL — так фото можно сохранить в «базе» (localStorage) без сервера.
 *
 * Проверку типа и размера (до 1 МБ) делает вызывающий код через `validateImageFile` —
 * сама функция файл не проверяет, только читает и сжимает.
 * При переходе на настоящую БД вместо этого файл отправляется на сервер, а в данные пишется ссылка.
 *
 * До сохранения фото уменьшается до 800 px по длинной стороне и пересохраняется в JPEG;
 * фото в пределах лимита возвращается как есть.
 *
 * Файл лежит на диске пользователя и синхронно недоступен, поэтому читается асинхронно,
 * а `FileReader` работает на колбэках и промис сам не возвращает — его собираем вручную.
 *
 * @see [FileReader — MDN](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
 *
 * @param file - картинка, уже прошедшая `validateImageFile`
 * @returns промис с data URL картинки (уменьшенный JPEG или исходный data URL)
 * @throws {Error} если файл не удалось прочитать
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    // onload сработает один раз, когда браузер дочитает файл до конца.
    reader.onload = () => {
      // readAsDataURL всегда отдаёт строку, но в типах result — ещё ArrayBuffer | null
      if (typeof reader.result === 'string') {
        // читаем, затем уменьшаем: второй аргумент промиса ловит ошибку сжатия
        resizeDataUrl(reader.result).then(resolve, reject)

        return
      }
      reject(new Error('Не удалось прочитать файл'))
    }

    // onerror сработает вместо onload, если файл пропал с диска, нет прав или чтение прервали.
    reader.onerror = () => {
      // причина лежит в reader.error (DOMException); ?? — если причины вдруг нет
      reject(new Error(reader.error?.message ?? 'Неизвестная ошибка'))
    }

    // запускаем чтение последним: если раньше, браузер может успеть до назначения onload
    reader.readAsDataURL(file)
  })
}
