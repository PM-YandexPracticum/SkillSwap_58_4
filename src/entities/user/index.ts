export type { User, PublicUser, Gender } from './model/types'
export {
  usersReducer,
  fetchUsers,
  createNewUser,
  updateDataUser,
  updateUserFavorite,
  type UsersState,
} from './model/usersSlice'
export {
  selectUsers,
  selectUsersStatus,
  selectUsersSaveStatus,
  selectUsersSaveError,
  selectUserById,
  selectUserByEmail,
  selectCurrentUser,
  selectPopularUsers,
  selectNewUsers,
  selectRecommendedUsers,
} from './model/selectors'
export { getUsers, getUserById, createUser, updateUser } from './api/userApi'
export { getAge } from './lib/getAge'
export { UserCard, type UserCardProps, type UserCardTag } from './ui/UserCard'
export { UserProfileCard, type UserProfileCardProps } from './ui/UserProfileCard'
