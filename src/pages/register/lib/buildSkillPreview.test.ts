import { createCategory } from '@/entities/category/testing'
import { buildSkillPreview } from './buildSkillPreview'

const categories = [createCategory()]
const values = {
  title: '  Игра на барабанах ',
  categoryId: 'business',
  subcategoryId: 'business-marketing',
  description: ' Научу основам ',
}

describe('buildSkillPreview', () => {
  it('подставляет названия категории и подкатегории и обрезает пробелы', () => {
    expect(buildSkillPreview(values, categories)).toEqual({
      title: 'Игра на барабанах',
      description: 'Научу основам',
      categoryTitle: 'Бизнес и карьера',
      subcategoryTitle: 'Маркетинг и реклама',
    })
  })

  it('неизвестная категория даёт пустые названия', () => {
    const result = buildSkillPreview({ ...values, categoryId: 'unknown' }, categories)

    expect(result.categoryTitle).toBe('')
    expect(result.subcategoryTitle).toBe('')
  })

  it('неизвестная подкатегория оставляет только название категории', () => {
    const result = buildSkillPreview({ ...values, subcategoryId: 'unknown' }, categories)

    expect(result.categoryTitle).toBe('Бизнес и карьера')
    expect(result.subcategoryTitle).toBe('')
  })

  it('пустая форма не падает', () => {
    expect(
      buildSkillPreview({ title: '', categoryId: '', subcategoryId: '', description: '' }, categories),
    ).toEqual({ title: '', description: '', categoryTitle: '', subcategoryTitle: '' })
  })
})
