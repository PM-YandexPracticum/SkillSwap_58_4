import { skillSchema } from './schema'

const valid = {
  title: 'Игра на барабанах',
  description: 'Научу играть простые ритмы на барабанах',
  categoryId: 'art',
  subcategoryId: 'music',
}

it('применяет общие лимиты к названию и описанию навыка', async () => {
  expect(await skillSchema.isValid(valid)).toBe(true)
  expect(await skillSchema.isValid({ ...valid, title: 'а'.repeat(51) })).toBe(false)
  expect(await skillSchema.isValid({ ...valid, description: 'коротко' })).toBe(false)
  expect(await skillSchema.isValid({ ...valid, description: 'а'.repeat(501) })).toBe(false)
})
