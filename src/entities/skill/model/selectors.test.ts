import { createTestStore } from '@/app/test/createTestStore'
import { createSkill } from '../testing'
import {
  selectSkillById,
  selectSkillsByAuthor,
  selectSkills,
  selectSkillsStatus,
  selectSkillsSaveStatus,
  selectSkillsSaveError,
} from '..'

const makeState = (items: ReturnType<typeof createSkill>[]): RootState =>
  createTestStore({
    skills: {
      saveStatus: 'idle' as const,
      pendingSaves: 0,
      saveError: null,
      items,
      status: 'idle',
      error: null,
    },
  }).getState()

describe('Тестирование селекторов для навыков (skills)', () => {
  it('возвращает статус загрузки', () => {
    const state = makeState([])
    expect(selectSkillsStatus({ ...state, skills: { ...state.skills, status: 'loading' } })).toBe(
      'loading',
    )
  })
  describe('selectSkillById', () => {
    it('находит навык по id', () => {
      const skill = createSkill({ id: 's1', title: 'Игра в карты наугад' })
      const state = makeState([skill])

      expect(selectSkillById(state, 's1')).toEqual(skill)
    })

    it('возвращает undefined, если навык не найден', () => {
      const skill = createSkill({ id: 's1' })
      const state = makeState([skill])

      expect(selectSkillById(state, 's999')).toBeUndefined()
    })

    it('возвращает undefined для пустого state', () => {
      const state = makeState([])

      expect(selectSkillById(state, 's1')).toBeUndefined()
    })
  })

  describe('selectSkillsByAuthor', () => {
    it('находит навык по authorId', () => {
      const skill = createSkill({ id: 's1', authorId: 'u7' })
      const state = makeState([skill])

      expect(selectSkillsByAuthor(state, 'u7')).toEqual(skill)
    })

    it('возвращает undefined, если у автора нет навыков', () => {
      const skill = createSkill({ id: 's1', authorId: 'u7' })
      const state = makeState([skill])

      expect(selectSkillsByAuthor(state, 'u99')).toBeUndefined()
    })

    it('находит правильный навык среди нескольких', () => {
      const skill1 = createSkill({ id: 's1', authorId: 'u1' })
      const skill2 = createSkill({ id: 's2', authorId: 'u2' })
      const state = makeState([skill1, skill2])

      expect(selectSkillsByAuthor(state, 'u2')).toEqual(skill2)
    })
  })

  describe('selectSkills', () => {
    it('возвращает массив навыков из state', () => {
      const skills = [createSkill({ id: 's1' }), createSkill({ id: 's2' })]
      const state = makeState(skills)

      expect(selectSkills(state)).toEqual(skills)
    })

    it('возвращает пустой массив, если навыков нет', () => {
      const state = makeState([])

      expect(selectSkills(state)).toEqual([])
    })
  })
})

describe('селекторы состояния сохранения', () => {
  it('возвращают состояние записи независимо от стартовой загрузки', () => {
    const state = makeState([])
    const saving = {
      ...state,
      skills: { ...state.skills, saveStatus: 'failed' as const, saveError: 'Не удалось сохранить' },
    }
    expect(selectSkillsSaveStatus(saving)).toBe('failed')
    expect(selectSkillsSaveError(saving)).toBe('Не удалось сохранить')
    expect(selectSkillsStatus(saving)).toBe('idle')
  })
})
