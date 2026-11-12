export type { Skill } from './model/types'
export { skillsReducer, fetchSkills, createNewSkill, type SkillsState } from './model/skillsSlice'
export {
  selectSkills,
  selectSkillsStatus,
  selectSkillsSaveStatus,
  selectSkillsSaveError,
  selectSkillById,
  selectSkillsByAuthor,
} from './model/selectors'
export { getSkills, getSkillById, createSkill } from './api/skillApi'
export { SkillTag } from './ui/SkillTag'
export { SkillInfo, type SkillInfoProps } from './ui/SkillInfo'
