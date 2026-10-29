/**
 * Превращает выбранный файл картинки в data URL — так фото можно сохранить в «базе» (localStorage) без сервера.
 * Перед вызовом файл проверяется `validateImageFile` (тип и размер до 1 МБ).
 * При переходе на настоящую БД вместо этого файл отправляется на сервер, а в данные пишется ссылка.
 * @throws {Error} если файл не удалось прочитать
 */
export function fileToDataUrl(_file: File): Promise<string> {
  // TODO: FileReader.readAsDataURL + unit-тест
  throw new Error('Not implemented: fileToDataUrl')
}
