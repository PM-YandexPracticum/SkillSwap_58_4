import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import * as yup from 'yup'

import { DATA_ERRORS } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { Input } from '@/shared/ui/Input'
import { Textarea } from '@/shared/ui/Textarea'
import { Select } from '@/shared/ui/Select'
import { Button } from '@/shared/ui/Button'
import { PasswordInput } from '@/shared/ui/PasswordInput'
import { DatePicker } from '@/shared/ui/DatePicker'

import { selectCities } from '@/entities/city'
import { selectCurrentUser, updateDataUser } from '@/entities/user'
import type { PublicUser, User } from '@/entities/user'

import { createProfileSchema, type ProfileFormValues } from '../model/schema'

import styles from './ProfileForm.module.css'

/** Дополнительные изменения, передаваемые страницей профиля. */
export type ExtraChanges = {
  avatarUrl?: string
}

export interface ProfileFormProps {
  className?: string
  extraDirty?: boolean
  submitBlocked?: boolean
  onBeforeSubmit?: () => ExtraChanges
  onSaved?: () => void
}

/** Пароль существует только внутри формы. */
type FormValues = ProfileFormValues & {
  password?: string
}

/** Преобразование пользователя в значения формы. */
const toFormValues = (user: PublicUser): ProfileFormValues => ({
  email: user.email,
  name: user.name,
  birthDate: user.birthDate,
  gender: user.gender,
  cityId: user.cityId,
  about: user.about,
})

const EMPTY_FORM: ProfileFormValues = {
  email: '',
  name: '',
  birthDate: '',
  gender: null,
  cityId: '',
  about: '',
}

/**
 * Форма редактирования личных данных.
 * P7-06: редактирование, валидация и сохранение профиля.
 */
export function ProfileForm({
  className,
  extraDirty = false,
  submitBlocked = false,
  onBeforeSubmit,
  onSaved,
}: ProfileFormProps) {
  const dispatch = useAppDispatch()

  const currentUser = useAppSelector(selectCurrentUser)
  const cities = useAppSelector(selectCities)

  const [changePassword, setChangePassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const cityOptions = cities.map((city) => ({
    value: city.id,
    label: city.name,
  }))

  const genderOptions = [
    { value: 'male', label: 'Мужской' },
    { value: 'female', label: 'Женский' },
  ]

  const { control, handleSubmit, reset, setValue, formState, setError, clearErrors } =
    useForm<FormValues>({
      defaultValues: currentUser
        ? {
            ...toFormValues(currentUser),
            password: '',
          }
        : {
            ...EMPTY_FORM,
            password: '',
          },
      mode: 'onBlur',
    })

  const watchedValues = useWatch({ control })

  // Синхронизация формы с актуальным пользователем
  useEffect(() => {
    if (!currentUser) return

    reset({
      ...toFormValues(currentUser),
      password: '',
    })

    setChangePassword(false)
    setSubmitError(null)
  }, [currentUser, reset])

  // Общая схема валидации
  const schema = useMemo(() => createProfileSchema(cities.map((city) => city.id)), [cities])

  // Открытие / закрытие поля изменения пароля
  const handlePasswordToggle = () => {
    setChangePassword((previous) => {
      const next = !previous

      if (!next) {
        setValue('password', '', {
          shouldDirty: false,
          shouldValidate: false,
        })

        clearErrors('password')
      }

      return next
    })
  }

  // Сохранение профиля
  const onSubmit = async (values: FormValues) => {
    if (!currentUser) return

    clearErrors()
    setSubmitError(null)

    // Проверка нового пароля
    if (changePassword) {
      if (!values.password || !values.password.trim()) {
        setError('password', {
          type: 'required',
          message: 'Введите новый пароль',
        })
        return
      }

      if (values.password.length < 8) {
        setError('password', {
          type: 'minLength',
          message: 'Минимум 8 символов',
        })
        return
      }
    }

    // Валидация основных полей
    try {
      await schema.validate(values, {
        abortEarly: false,
      })
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = error.inner.length ? error.inner : [error]

        validationErrors.forEach((item) => {
          if (item.path) {
            setError(item.path as keyof FormValues, {
              type: 'validation',
              message: item.message,
            })
          }
        })
      }

      return
    }

    // Исходные данные пользователя
    const originalValues = toFormValues(currentUser)

    // Формируем только изменённые поля
    const changes: Partial<Omit<User, 'id'>> = {}

    ;(Object.keys(originalValues) as (keyof ProfileFormValues)[]).forEach((key) => {
      if (values[key] !== originalValues[key]) {
        Object.assign(changes, {
          [key]: values[key],
        })
      }
    })

    // Пароль добавляется только при включённом изменении
    if (changePassword && values.password) {
      changes.password = values.password
    }

    // Добавляем изменения аватара
    if (onBeforeSubmit) {
      Object.assign(changes, onBeforeSubmit())
    }

    // Если ничего не изменилось, запрос не нужен
    if (Object.keys(changes).length === 0) {
      return
    }

    // Сохранение
    const result = await dispatch(
      updateDataUser({
        id: currentUser.id,
        changes,
      }),
    )

    // Успешное сохранение
    if (updateDataUser.fulfilled.match(result)) {
      reset({
        ...values,
        password: '',
      })

      setChangePassword(false)
      setSubmitError(null)

      // Сообщаем родительской странице об успехе
      onSaved?.()

      return
    }

    // Обработка ошибки сохранения
    if (updateDataUser.rejected.match(result)) {
      const errorMessage = result.payload ?? DATA_ERRORS.SAVE_USER

      // Email уже занят
      if (errorMessage === DATA_ERRORS.DUPLICATE_EMAIL) {
        setError('email', {
          type: 'server',
          message: errorMessage,
        })

        return
      }

      // Остальные ошибки сохранения
      setSubmitError(errorMessage)
    }
  }

  // Проверка пароля
  const passwordOk =
    !changePassword || (!!watchedValues.password && watchedValues.password.length >= 8)

  // Общая валидность формы
  const isValid = schema.isValidSync(watchedValues) && passwordOk

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={[styles.form, className].filter(Boolean).join(' ')}
    >
      <div className={styles.fieldGroup}>
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <Input
              label="Почта"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              rightIcon={
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              }
            />
          )}
        />

        <button type="button" className={styles.changePassword} onClick={handlePasswordToggle}>
          {changePassword ? 'Отменить' : 'Изменить пароль'}
        </button>

        {changePassword && (
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <PasswordInput
                label="Новый пароль"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                hint="Пароль должен содержать не менее 8 знаков"
              />
            )}
          />
        )}
      </div>

      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <Input
            label="Имя"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            rightIcon={
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            }
          />
        )}
      />

      <div className={styles.row}>
        <Controller
          control={control}
          name="birthDate"
          render={({ field, fieldState }) => (
            <DatePicker
              label="Дата рождения"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="gender"
          render={({ field, fieldState }) => (
            <Select
              label="Пол"
              options={genderOptions}
              value={field.value}
              onChange={field.onChange}
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
            label="Город"
            options={cityOptions}
            value={field.value}
            onChange={field.onChange}
            searchable
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="about"
        render={({ field, fieldState }) => (
          <Textarea
            label="О себе"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            rightIcon={
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            }
            rows={5}
          />
        )}
      />

      {submitError && <p role="alert">{submitError}</p>}

      <Button
        variant="primary"
        type="submit"
        disabled={
          (!formState.isDirty && !extraDirty) || formState.isSubmitting || submitBlocked || !isValid
        }
        className={styles.submitButton}
      >
        Сохранить
      </Button>
    </form>
  )
}
