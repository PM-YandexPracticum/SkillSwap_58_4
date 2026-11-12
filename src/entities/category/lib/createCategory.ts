import type { Category } from '../model/types'

/** Детерминированная категория для тестов и stories; в приложение не импортируется. */
export function createCategory(overrides: Partial<Category> = {}): Category {
  const id = overrides.id ?? 'business'
  return {
    id,
    title: 'Бизнес и карьера',
    icon: 'business',
    color: 'business',
    subcategories: [
      { id: `${id}-management`, categoryId: id, title: 'Управление командой' },
      { id: `${id}-marketing`, categoryId: id, title: 'Маркетинг и реклама' },
    ],
    ...overrides,
  }
}
