import { createCategory } from '../testing'
import { findSubcategories } from './findSubcategories'

describe('findSubcategories', () => {
  const category = createCategory()

  it('сохраняет порядок выбранных id и пропускает отсутствующие подкатегории', () => {
    const [first, second] = category.subcategories
    expect(findSubcategories([category], [second.id, 'missing', first.id])).toEqual([second, first])
  })

  it('возвращает пустой список при пустом выборе или справочнике', () => {
    expect(findSubcategories([category], [])).toEqual([])
    expect(findSubcategories([], ['missing'])).toEqual([])
  })
})
