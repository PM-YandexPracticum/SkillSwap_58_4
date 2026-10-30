/** Что показать, если фото нет */
export const IMAGE_PLACEHOLDERS = {
  AVATAR: '/images/avatars/placeholder.jpg',
  SKILL: '/images/skills/placeholder.jpg',
} as const

/**
 * Превращает путь из моков в адрес для `<img src>`. Все картинки проекта выводятся только через неё.
 * - `null` / пустая строка → заглушка из `IMAGE_PLACEHOLDERS`;
 * - локальный путь `/images/...` → с учётом `import.meta.env.BASE_URL` (если сайт лежит не в корне домена);
 * - `data:` и `blob:` (превью до загрузки) → без изменений.
 * @param path значение `avatarUrl` или элемента `images[]`
 * @param kind какую заглушку подставить
 */
export function resolveImageUrl(
  _path: string | null | undefined,
  _kind: keyof typeof IMAGE_PLACEHOLDERS,
): string {
  // TODO: реализовать + unit-тесты на все случаи
  throw new Error('Not implemented: resolveImageUrl')
}
