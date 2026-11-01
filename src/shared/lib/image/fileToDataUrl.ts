/**
 * Превращает выбранный файл картинки в data URL — так фото можно сохранить в «базе» (localStorage) без сервера.
 * Перед вызовом файл проверяется `validateImageFile` (тип и размер до 1 МБ).
 * При переходе на настоящую БД вместо этого файл отправляется на сервер, а в данные пишется ссылка.
 *
 * Файл лежит на диске пользователя и синхронно недоступен, поэтому читается асинхронно,
 * а `FileReader` работает на колбэках и промис сам не возвращает — его собираем вручную.
 *
 * @see [FileReader — MDN](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
 *
 * @param file - картинка, уже прошедшая `validateImageFile`
 * @returns промис с data URL картинки (`data:image/png;base64,...`)
 * @throws {Error} если файл не удалось прочитать
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    // onload сработает один раз, когда браузер дочитает файл до конца.
    reader.onload = () => {
      // readAsDataURL всегда отдаёт строку, но в типах result — ещё ArrayBuffer | null
      if (typeof reader.result === 'string') {
        resolve(reader.result)
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
