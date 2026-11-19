import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { selectCities } from '@/entities/city'
import { updateDataUser, type PublicUser } from '@/entities/user'
import { DATA_ERRORS } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { getProfileChanges, toProfileValues } from './profileValues'
import { createProfileEditSchema, type ProfileEditValues } from './schema'

/**
 * Управляет единой формой профиля: общие правила, черновик фото, запись и понятные ошибки.
 * Начальные значения меняются только после успеха; фоновые изменения store ввод не стирают.
 * Страница пересоздаёт редактор по ключу пользователя, поздний ответ после ухода игнорируется UI.
 */
export function useProfileForm(user: PublicUser) {
  const dispatch = useAppDispatch()
  const cities = useAppSelector(selectCities)
  const [changePassword, setChangePassword] = useState(false)
  const [isAvatarProcessing, setIsAvatarProcessing] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const baseline = useRef(toProfileValues(user))
  const mounted = useRef(false)
  const saving = useRef(false)
  const schema = useMemo(
    () =>
      createProfileEditSchema(
        cities.map((city) => city.id),
        changePassword,
      ),
    [cities, changePassword],
  )
  const form = useForm<ProfileEditValues>({
    defaultValues: baseline.current,
    resolver: yupResolver(schema),
    mode: 'onTouched',
  })
  const {
    handleSubmit,
    reset,
    resetField,
    setError,
    trigger,
    setFocus,
    formState: { isSubmitting },
  } = form
  const busy = isSubmitting || isAvatarProcessing

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    // Пересчитываем isValid по новой схеме, не показывая ошибки нетронутых полей до blur.
    void trigger([])
  }, [schema, trigger])

  useEffect(() => {
    if (changePassword) setFocus('password')
  }, [changePassword, setFocus])

  function togglePassword() {
    if (changePassword) resetField('password', { defaultValue: '' })
    setChangePassword(!changePassword)
  }

  async function save(values: ProfileEditValues) {
    if (!mounted.current || isAvatarProcessing) return
    setSubmitError(null)
    const changes = getProfileChanges(values, baseline.current)
    if (Object.keys(changes).length === 0) {
      reset(baseline.current)
      return
    }
    try {
      const saved = await dispatch(updateDataUser({ id: user.id, changes })).unwrap()
      if (!mounted.current) return
      baseline.current = toProfileValues(saved)
      reset(baseline.current)
      setChangePassword(false)
    } catch (error) {
      if (!mounted.current) return
      const message =
        typeof error === 'string' && Object.values(DATA_ERRORS).some((value) => value === error)
          ? error
          : DATA_ERRORS.SAVE_USER
      if (message === DATA_ERRORS.DUPLICATE_EMAIL) {
        setError('email', { type: 'server', message }, { shouldFocus: true })
      } else {
        setSubmitError(message)
      }
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Блокируем повтор ещё до асинхронного resolver: Enter не должен запустить второй handleSubmit.
    if (saving.current || isAvatarProcessing) return
    saving.current = true
    try {
      await handleSubmit(save)(event)
    } finally {
      saving.current = false
    }
  }

  return {
    form,
    cities,
    busy,
    changePassword,
    togglePassword,
    submitError,
    onSubmit,
    onAvatarProcessingChange: setIsAvatarProcessing,
  }
}
