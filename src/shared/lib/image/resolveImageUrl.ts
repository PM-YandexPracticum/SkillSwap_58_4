/** Что показать, если фото нет */
export const IMAGE_PLACEHOLDERS = {
  AVATAR: '/images/avatars/placeholder.jpg',
  SKILL: '/images/skills/placeholder.jpg',
} as const

/**
 * Превращает путь из моков в адрес для `<img src>`. Все картинки проекта выводятся только через неё.
 * - `null` / пустая строка → заглушка из `IMAGE_PLACEHOLDERS`;
 * - локальный путь, начинающийся с `/` (например /images/...) → с учётом `import.meta.env.BASE_URL` (если сайт лежит не в корне домена);
 * - `data:` и `blob:` (превью до загрузки) → без изменений.
 * @param path значение `avatarUrl` или элемента `images[]`
 * @param kind какую заглушку подставить
 */
export function resolveImageUrl(
  path: string | null | undefined,
  kind: keyof typeof IMAGE_PLACEHOLDERS,
): string {
  if (path === null || path === undefined || path === '') {
    return IMAGE_PLACEHOLDERS[kind]
  }

  // Проверяем любой локальный путь, а не только /images/: так же работают файлы из public/db
  // slice(1) убирает ведущий /, иначе получится двойной слэш: //images/...
  if (path.startsWith('/')) {
    return `${import.meta.env.BASE_URL}${path.slice(1)}`
  }

  // blob:, data: (превью до загрузки) и внешние адреса — уже готовые, BASE_URL к ним добавлять нельзя
  return path
}
