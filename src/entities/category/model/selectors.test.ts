import type { Category } from './types'
import {
  selectCategories,
  selectCategoriesStatus,
  selectCategoryBySubcategoryId,
  selectCategoryColor,
  selectSubcategoryById,
} from './selectors'

const CATEGORIES: Category[] = [
  {
    id: 'business',
    title: 'Бизнес и карьера',
    icon: 'business',
    color: '#EEE7F7',
    subcategories: [
      { id: 'team-management', categoryId: 'business', title: 'Управление командой' },
      { id: 'marketing', categoryId: 'business', title: 'Маркетинг и реклама' },
      { id: 'time-management', categoryId: 'business', title: 'Тайм-менеджмент' },
    ],
  },
  {
    id: 'creativity',
    title: 'Творчество и искусство',
    icon: 'creative',
    color: '#F7E7F2',
    subcategories: [
      { id: 'drawing', categoryId: 'creativity', title: 'Рисование и иллюстрация' },
      { id: 'music', categoryId: 'creativity', title: 'Музыка и звук' },
    ],
  },
]

const makeState = (overrides: Partial<RootState['categories']> = {}): RootState =>
  ({
    categories: { items: CATEGORIES, status: 'succeeded', ...overrides },
  }) as RootState

describe('category selectors', () => {
  it('selectCategories возвращает все категории', () => {
    expect(selectCategories(makeState())).toBe(CATEGORIES)
  })

  it('selectCategoriesStatus возвращает статус', () => {
    expect(selectCategoriesStatus(makeState({ status: 'failed' }))).toBe('failed')
  })

  describe('selectSubcategoryById', () => {
    it('находит подкатегорию в любой категории', () => {
      const state = makeState()
      expect(selectSubcategoryById(state, 'music')).toEqual({
        id: 'music',
        categoryId: 'creativity',
        title: 'Музыка и звук',
      })
      expect(selectSubcategoryById(state, 'marketing')?.title).toBe('Маркетинг и реклама')
    })

    it('возвращает undefined для неизвестного id', () => {
      expect(selectSubcategoryById(makeState(), 'нет такой')).toBeUndefined()
    })

    it('работает на пустом справочнике', () => {
      expect(selectSubcategoryById(makeState({ items: [] }), 'music')).toBeUndefined()
    })
  })

  describe('selectCategoryBySubcategoryId', () => {
    it('находит категорию подкатегории', () => {
      expect(selectCategoryBySubcategoryId(makeState(), 'music')?.id).toBe('creativity')
      expect(selectCategoryBySubcategoryId(makeState(), 'team-management')?.id).toBe('business')
    })

    it('возвращает undefined для неизвестной подкатегории', () => {
      expect(selectCategoryBySubcategoryId(makeState(), 'нет такой')).toBeUndefined()
    })
  })

  describe('selectCategoryColor', () => {
    it('возвращает цвет по id категории', () => {
      expect(selectCategoryColor(makeState(), 'business')).toBe('#EEE7F7')
      expect(selectCategoryColor(makeState(), 'creativity')).toBe('#F7E7F2')
    })

    it('id подкатегории — не категория: цвета нет', () => {
      expect(selectCategoryColor(makeState(), 'marketing')).toBeUndefined()
    })

    it('возвращает undefined для неизвестного id', () => {
      expect(selectCategoryColor(makeState(), 'нет такой')).toBeUndefined()
    })
  })
})
