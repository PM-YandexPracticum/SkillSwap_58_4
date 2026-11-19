import { ProfileForm } from '@/features/profile-edit'
import { AvatarUpload } from '@/features/avatar-upload'
import { selectSession } from '@/entities/session'
import { selectCurrentUser } from '@/entities/user'
import { useAppSelector } from '@/shared/lib/store'

/**
 * Соединяет редактор профиля с общим загрузчиком аватара.
 * При смене пользователя или сессии key сбрасывает весь черновик, включая фото и пароль.
 * @see Figma: «Профиль_личные данные» (1:2370)
 */
export function ProfilePersonal() {
  const user = useAppSelector(selectCurrentUser)
  const session = useAppSelector(selectSession)
  if (!user) return null
  return (
    <ProfileForm
      key={`${user.id}:${session?.token ?? ''}`}
      user={user}
      avatarUpload={(props) => <AvatarUpload {...props} variant="profile" alt={user.name} />}
    />
  )
}
