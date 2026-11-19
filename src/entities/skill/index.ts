export type { Skill } from './model/types'
export {
  skillsReducer,
  fetchSkills,
  createNewSkill,
  updateDataSkill,
  type SkillsState,
} from './model/skillsSlice'
export {
  selectSkills,
  selectSkillsStatus,
  selectSkillsSaveStatus,
  selectSkillsSaveError,
  selectSkillById,
  selectSkillsByAuthor,
} from './model/selectors'
export { getSkills, getSkillById, createSkill, updateSkill } from './api/skillApi'
export { SkillTag } from './ui/SkillTag'
export { SkillInfo, type SkillInfoProps } from './ui/SkillInfo'
export { SkillGallery, type SkillGalleryProps } from './ui/SkillGallery'
