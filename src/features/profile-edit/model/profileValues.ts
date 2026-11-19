import type { PublicUser, User } from '@/entities/user'
import type { ProfileEditValues } from './schema'

const PROFILE_FIELDS = [
  'email',
  'name',
  'birthDate',
  'gender',
  'cityId',
  'about',
  'avatarUrl',
] as const

type ProfileChanges = Partial<Pick<User, (typeof PROFILE_FIELDS)[number] | 'password'>>

/** DatePicker редактирует календарный день; API хранит ISO-дату со временем. Пароль из store в форму не попадает. */
export function toProfileValues(user: PublicUser): ProfileEditValues {
  return {
    email: user.email,
    name: user.name,
    birthDate: user.birthDate.slice(0, 10),
    gender: user.gender,
    cityId: user.cityId,
    about: user.about,
    avatarUrl: user.avatarUrl,
    password: '',
  }
}

/** Только поля этого редактора. Остальные данные пользователя обновляет API на актуальной записи. */
export function getProfileChanges(
  values: ProfileEditValues,
  baseline: ProfileEditValues,
): ProfileChanges {
  const changes: ProfileChanges = {}
  for (const key of PROFILE_FIELDS) {
    if (values[key] !== baseline[key]) Object.assign(changes, { [key]: values[key] })
  }
  if (changes.birthDate)
    changes.birthDate = new Date(`${changes.birthDate}T00:00:00.000Z`).toISOString()
  if (values.password) changes.password = values.password
  return changes
}
