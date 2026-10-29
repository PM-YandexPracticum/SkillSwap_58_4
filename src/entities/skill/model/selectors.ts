/** Все навыки */
export const selectSkills = (state: RootState) => state.skills.items

/** Статус загрузки */
export const selectSkillsStatus = (state: RootState) => state.skills.status

// TODO: selectSkillById(id), selectSkillsByAuthor(userId)
