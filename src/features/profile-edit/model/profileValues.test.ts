import { createUser } from '@/entities/user/testing'
import { getProfileChanges, toProfileValues } from './profileValues'

const person = createUser()

it('готовит календарный день для DatePicker, не раскрывая сохранённый пароль', () => {
  expect(toProfileValues(person)).toMatchObject({ birthDate: '1992-03-15', password: '' })
})

it('не создаёт изменений для неизменённых значений', () => {
  const original = toProfileValues(person)
  expect(getProfileChanges(original, original)).toEqual({})
})

it('передаёт только разрешённые поля, новую дату сохраняет в формате API', () => {
  const original = toProfileValues(person)
  const values = {
    ...original,
    birthDate: '1995-10-28',
    gender: null,
    avatarUrl: 'data:image/jpeg;base64,new',
    password: 'Password123',
    likesCount: 0,
    teachSkillId: 'foreign',
    learnSubcategoryIds: ['foreign'],
  }
  expect(getProfileChanges(values, original)).toEqual({
    birthDate: '1995-10-28T00:00:00.000Z',
    gender: null,
    avatarUrl: 'data:image/jpeg;base64,new',
    password: 'Password123',
  })
  expect(original.birthDate).toBe('1992-03-15')
})
