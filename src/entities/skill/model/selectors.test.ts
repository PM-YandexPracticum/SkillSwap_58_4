import { createSkill } from '../testing'
import { describe, test, expect } from 'vitest'
import { selectSkillByID, selectSkillsByAuthor, selectSkills } from './selectors'

// Вспомогательная функция для создания фейкового state
const makeState = (items: ReturnType<typeof createSkill>[]): RootState =>
  ({
    skills: {
      items,
      status: 'idle',
      error: null,
    },
  }) as RootState

describe('Тестирование селекторов для навыков (skills)', () => {
  describe('selectSkillByID', () => {
    test('находит навык по id', () => {
      const skill = createSkill({ id: 's1', title: 'Игра в карты наугад' })
      const state = makeState([skill])

      expect(selectSkillByID(state, 's1')).toEqual(skill)
    })

    test('возвращает undefined, если навык не найден', () => {
      const skill = createSkill({ id: 's1' })
      const state = makeState([skill])

      expect(selectSkillByID(state, 's999')).toBeUndefined()
    })

    test('возвращает undefined для пустого state', () => {
      const state = makeState([])

      expect(selectSkillByID(state, 's1')).toBeUndefined()
    })
  })

  describe('selectSkillsByAuthor', () => {
    test('находит навык по authorId', () => {
      const skill = createSkill({ id: 's1', authorId: 'u7' })
      const state = makeState([skill])

      expect(selectSkillsByAuthor(state, 'u7')).toEqual(skill)
    })

    test('возвращает undefined, если у автора нет навыков', () => {
      const skill = createSkill({ id: 's1', authorId: 'u7' })
      const state = makeState([skill])

      expect(selectSkillsByAuthor(state, 'u99')).toBeUndefined()
    })

    test('находит правильный навык среди нескольких', () => {
      const skill1 = createSkill({ id: 's1', authorId: 'u1' })
      const skill2 = createSkill({ id: 's2', authorId: 'u2' })
      const state = makeState([skill1, skill2])

      expect(selectSkillsByAuthor(state, 'u2')).toEqual(skill2)
    })
  })

  describe('selectSkills', () => {
    test('возвращает массив навыков из state', () => {
      const skills = [createSkill({ id: 's1' }), createSkill({ id: 's2' })]
      const state = makeState(skills)

      expect(selectSkills(state)).toEqual(skills)
    })

    test('возвращает пустой массив, если навыков нет', () => {
      const state = makeState([])

      expect(selectSkills(state)).toEqual([])
    })
  })
})
