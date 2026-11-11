import { createCategory } from '../testing'
import { getAvailableSubcategories, syncCategorySelection } from './linkCategories'

/** Помощник для короткой записи выбора пользователя в тестах */
const choice = (categoryIds: string[], subcategoryIds: string[]) => ({
  categoryIds,
  subcategoryIds,
})

describe('getAvailableSubcategories', () => {
  const creative = createCategory({
    id: 'creative',
    title: 'Творчество и искусство',
    subcategories: [
      { id: 'creative-photo', categoryId: 'creative', title: 'Фотография' },
      { id: 'creative-music', categoryId: 'creative', title: 'Музыка и звук' },
    ],
  })
  const business = createCategory() // «Управление командой», «Маркетинг и реклама»
  const categories = [creative, business]

  it('без выбранных категорий возвращает все подкатегории', () => {
    expect(getAvailableSubcategories(categories, [])).toEqual([
      ...creative.subcategories,
      ...business.subcategories,
    ])
  })

  it('с выбранной категорией возвращает только её подкатегории', () => {
    expect(getAvailableSubcategories(categories, ['business'])).toEqual(business.subcategories)
  })

  it('с несколькими категориями возвращает подкатегории каждой', () => {
    expect(getAvailableSubcategories(categories, ['business', 'creative'])).toEqual([
      ...creative.subcategories,
      ...business.subcategories,
    ])
  })

  it('с неизвестной категорией возвращает пустой список', () => {
    expect(getAvailableSubcategories(categories, ['unknown'])).toEqual([])
  })

  it('возвращает новый массив и не мутирует справочник', () => {
    const snapshot = categories.map((category) => [...category.subcategories])

    const result = getAvailableSubcategories(categories, [])

    expect(result).not.toBe(categories[0].subcategories)
    expect(categories.map((category) => category.subcategories)).toEqual(snapshot)
  })

  it('для пустого справочника возвращает пустой список', () => {
    expect(getAvailableSubcategories([], [])).toEqual([])
  })
})

describe('syncCategorySelection', () => {
  const creative = createCategory({
    id: 'creative',
    title: 'Творчество и искусство',
    subcategories: [
      { id: 'creative-photo', categoryId: 'creative', title: 'Фотография' },
      { id: 'creative-music', categoryId: 'creative', title: 'Музыка и звук' },
    ],
  })
  const business = createCategory()
  const categories = [creative, business]

  it('ничего не изменилось — возвращает тот же согласованный выбор', () => {
    const state = choice(['business'], ['business-management'])

    expect(syncCategorySelection(categories, state, state)).toEqual({
      categoryIds: ['business'],
      subcategoryIds: ['business-management'],
    })
  })

  it('выбранная подкатегория подтягивает свою категорию', () => {
    expect(
      syncCategorySelection(categories, choice([], ['creative-photo']), choice([], [])),
    ).toEqual({ categoryIds: ['creative'], subcategoryIds: ['creative-photo'] })
  })

  it('снятая категория убирает и свои подкатегории', () => {
    expect(
      syncCategorySelection(
        categories,
        choice([], ['creative-photo']),
        choice(['creative'], ['creative-photo']),
      ),
    ).toEqual({ categoryIds: [], subcategoryIds: [] })
  })

  it('смена категории убирает подкатегории прежней', () => {
    expect(
      syncCategorySelection(
        categories,
        choice(['business'], ['creative-photo']),
        choice(['creative'], ['creative-photo']),
      ),
    ).toEqual({ categoryIds: ['business'], subcategoryIds: [] })
  })

  it('чужая пара от родителя становится согласованной', () => {
    expect(
      syncCategorySelection(categories, choice(['business'], ['creative-photo']), choice([], [])),
    ).toEqual({ categoryIds: ['business', 'creative'], subcategoryIds: ['creative-photo'] })
  })

  it('несколько категорий и их подкатегории сохраняются', () => {
    expect(
      syncCategorySelection(
        categories,
        choice(['business', 'creative'], ['business-management', 'creative-music']),
        choice([], []),
      ),
    ).toEqual({
      categoryIds: ['business', 'creative'],
      subcategoryIds: ['business-management', 'creative-music'],
    })
  })

  it('подкатегория без известной категории остаётся как есть', () => {
    expect(syncCategorySelection(categories, choice([], ['unknown-sub']), choice([], []))).toEqual({
      categoryIds: [],
      subcategoryIds: ['unknown-sub'],
    })
  })

  it('возвращает новые массивы и не мутирует вход', () => {
    const selection = choice(['business'], ['business-management'])
    const previous = choice(['creative'], ['creative-photo'])

    const result = syncCategorySelection(categories, selection, previous)

    expect(result.categoryIds).not.toBe(selection.categoryIds)
    expect(result.subcategoryIds).not.toBe(selection.subcategoryIds)
    expect(selection).toEqual(choice(['business'], ['business-management']))
    expect(previous).toEqual(choice(['creative'], ['creative-photo']))
  })

  it('категория, выбранная вручную, не дублируется из подкатегории', () => {
    expect(
      syncCategorySelection(categories, choice(['creative'], ['creative-photo']), choice([], [])),
    ).toEqual({ categoryIds: ['creative'], subcategoryIds: ['creative-photo'] })
  })
})
