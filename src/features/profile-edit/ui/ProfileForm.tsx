import { useId, type ReactNode } from 'react'
import { Controller } from 'react-hook-form'

import type { PublicUser } from '@/entities/user'
import EditIcon from '@/shared/assets/icons/edit.svg?react'
import { Button } from '@/shared/ui/Button'
import { DatePicker } from '@/shared/ui/DatePicker'
import { Input } from '@/shared/ui/Input'
import { PasswordInput } from '@/shared/ui/PasswordInput'
import { Select } from '@/shared/ui/Select'
import { Textarea } from '@/shared/ui/Textarea'

import { useProfileForm } from '../model/useProfileForm'
import styles from './ProfileForm.module.css'

interface ProfileAvatarProps {
  value: string | null
  onChange: (dataUrl: string) => void
  onProcessingChange: (isProcessing: boolean) => void
  disabled: boolean
}

export interface ProfileFormProps {
  /** При смене пользователя страница пересоздаёт редактор через key пользователя и сессии. */
  user: PublicUser
  className?: string
  /** Страница подключает общий загрузчик фото; feature не импортирует соседний feature. */
  avatarUpload?: (props: ProfileAvatarProps) => ReactNode
}

const GENDER_OPTIONS = [
  { value: null, label: 'Не указан' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
]

/**
 * Личные данные и фото — одна форма с общей Yup-валидацией и записью через updateDataUser.
 * Во время записи и чтения фото редактирование заблокировано. Ошибка сохраняет ввод,
 * успех обновляет исходные значения; поздний ответ после ухода не меняет другой редактор.
 * Изменение лайков или другой записи в store не сбрасывает черновик.
 * @see Figma: «Профиль_личные данные» (1:2370)
 */
export function ProfileForm({ user, className, avatarUpload }: ProfileFormProps) {
  const passwordId = useId()
  const {
    form,
    cities,
    busy,
    changePassword,
    togglePassword,
    submitError,
    onSubmit,
    onAvatarProcessingChange,
  } = useProfileForm(user)
  const {
    register,
    control,
    formState: { errors, isDirty, isValid },
  } = form

  return (
    <form
      aria-label="Личные данные"
      aria-busy={busy}
      noValidate
      onSubmit={onSubmit}
      className={[styles.form, className].filter(Boolean).join(' ')}
    >
      <div className={styles.fields}>
        <div className={styles.fieldGroup}>
          <Input
            {...register('email')}
            label="Почта"
            type="email"
            autoComplete="email"
            disabled={busy}
            error={errors.email?.message}
            rightIcon={<EditIcon />}
          />
          <button
            type="button"
            className={styles.changePassword}
            onClick={togglePassword}
            disabled={busy}
            aria-expanded={changePassword}
            aria-controls={changePassword ? passwordId : undefined}
          >
            {changePassword ? 'Отменить' : 'Изменить пароль'}
          </button>
          {changePassword && (
            <PasswordInput
              {...register('password')}
              id={passwordId}
              label="Новый пароль"
              autoComplete="new-password"
              disabled={busy}
              error={errors.password?.message}
              hint="Пароль должен содержать не менее 8 знаков"
            />
          )}
        </div>
        <Input
          {...register('name')}
          label="Имя"
          autoComplete="given-name"
          disabled={busy}
          error={errors.name?.message}
          rightIcon={<EditIcon />}
        />
        <div className={styles.row}>
          <Controller
            control={control}
            name="birthDate"
            render={({ field, fieldState }) => (
              <DatePicker
                {...field}
                label="Дата рождения"
                disabled={busy}
                onChange={(value) => field.onChange(value ?? '')}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="gender"
            render={({ field, fieldState }) => (
              <Select
                ref={field.ref}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                label="Пол"
                options={GENDER_OPTIONS}
                disabled={busy}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
        <Controller
          control={control}
          name="cityId"
          render={({ field, fieldState }) => (
            <Select
              ref={field.ref}
              value={field.value}
              onChange={(value) => field.onChange(value ?? '')}
              onBlur={field.onBlur}
              label="Город"
              options={cities.map((city) => ({ value: city.id, label: city.name }))}
              searchable
              disabled={busy}
              error={fieldState.error?.message}
            />
          )}
        />
        <Textarea
          {...register('about')}
          label="О себе"
          disabled={busy}
          error={errors.about?.message}
          rightIcon={<EditIcon />}
          rows={4}
        />
        {submitError && (
          <p className={styles.error} role="alert">
            {submitError}
          </p>
        )}
        <Button
          type="submit"
          disabled={!isDirty || !isValid || busy}
          className={styles.submitButton}
        >
          Сохранить
        </Button>
      </div>
      {avatarUpload && (
        <Controller
          control={control}
          name="avatarUrl"
          render={({ field }) => (
            <>
              {avatarUpload({
                value: field.value,
                onChange: field.onChange,
                onProcessingChange: onAvatarProcessingChange,
                disabled: busy,
              })}
            </>
          )}
        />
      )}
    </form>
  )
}
