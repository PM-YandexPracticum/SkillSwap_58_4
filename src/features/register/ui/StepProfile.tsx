import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo, type ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { CategorySubcategorySelect, selectCategories } from '@/entities/category'
import { selectCities } from '@/entities/city'
import type { Gender } from '@/entities/user'
import { useAppSelector } from '@/shared/lib/store'
import { Button } from '@/shared/ui/Button'
import { DatePicker } from '@/shared/ui/DatePicker'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'

import { createProfileStepSchema, type ProfileStepValues } from '../model/schema'
import styles from './StepProfile.module.css'

export interface StepProfileProps {
  /** Отдаёт проверенные значения шага. Страница сохраняет черновик и открывает шаг 3. */
  onNext: (values: ProfileStepValues) => void
  /**
   * Отдаёт текущие значения полей как есть, без проверки, чтобы «Назад» ничего не стирал.
   * Страница сохраняет их в черновик и открывает шаг 1.
   */
  onBack: (values: ProfileStepValues) => void
  /** Значения из черновика: после «Назад» или возврата на шаг поля заполнены. */
  defaultValues?: ProfileStepValues
  /** Слот аватара: `AvatarUpload` подставляет страница, слайсы features не импортируют друг друга. */
  avatarUpload: ReactNode
}

const EMPTY_VALUES: ProfileStepValues = {
  name: '',
  birthDate: '',
  gender: null,
  cityId: '',
  learnCategoryIds: [],
  learnSubcategoryIds: [],
}

const GENDER_OPTIONS = [
  { value: null, label: 'Не указан' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
]

/**
 * Шаг 2 «Расскажите немного о себе»: аватар (слот), имя, дата рождения и пол, город,
 * «Хочу научиться» — категории и подкатегории в режиме `multiple` (списки с чекбоксами),
 * «Назад» / «Продолжить». Поля «О себе» здесь нет — только в профиле.
 *
 * Форма на react-hook-form и `createProfileStepSchema` (общие правила из `@/shared/lib/validation`).
 * Режим `onTouched` показывает ошибку после первого ухода с поля и обновляет её при исправлении,
 * `isValid` определяет доступность «Продолжить» (правило 6 из `docs/rules/validation.md`). Города и категории
 * читает из store (их загружает DataProvider); черновик и переходы остаются ответственностью страницы.
 * @see Figma: «Регистрация 2 шаг» (1:1497 … 1:1717)
 */
export function StepProfile({ onNext, onBack, defaultValues, avatarUpload }: StepProfileProps) {
  const cities = useAppSelector(selectCities)
  const categories = useAppSelector(selectCategories)

  const schema = useMemo(() => createProfileStepSchema(cities.map((city) => city.id)), [cities])
  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ProfileStepValues>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: defaultValues ?? EMPTY_VALUES,
  })

  const cityOptions = cities.map((city) => ({ value: city.id, label: city.name }))
  const learning = {
    categoryIds: watch('learnCategoryIds'),
    subcategoryIds: watch('learnSubcategoryIds'),
  }

  return (
    <form
      className={styles.form}
      aria-label="Расскажите немного о себе"
      noValidate
      onSubmit={handleSubmit((values) => onNext(values))}
    >
      {avatarUpload}

      <div className={styles.containerInput}>
        <Input
          label="Имя"
          type="text"
          placeholder="Введите ваше имя"
          autoComplete="given-name"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className={styles.row}>
          <Controller
            name="birthDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                ref={field.ref}
                name={field.name}
                label="Дата рождения"
                placeholder="дд.мм.гггг"
                value={field.value || null}
                onChange={(iso) => field.onChange(iso ?? '')}
                onBlur={field.onBlur}
                error={errors.birthDate?.message}
              />
            )}
          />

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                label="Пол"
                placeholder="Не указан"
                options={GENDER_OPTIONS}
                value={field.value}
                onChange={(value) => field.onChange(value as Gender | null)}
                error={errors.gender?.message}
              />
            )}
          />
        </div>

        <Controller
          name="cityId"
          control={control}
          render={({ field }) => (
            <Select
              label="Город"
              placeholder="Выберите город"
              options={cityOptions}
              value={field.value || null}
              onChange={(value) => {
                field.onChange(value ?? '')
                // У Select нет onBlur: выбор значения считаем уходом с поля, чтобы показать ошибку
                field.onBlur()
              }}
              error={errors.cityId?.message}
              searchable
            />
          )}
        />

        <CategorySubcategorySelect
          mode="multiple"
          categories={categories}
          value={learning}
          onChange={({ categoryIds, subcategoryIds }) => {
            const subcategoriesChanged =
              subcategoryIds.length !== learning.subcategoryIds.length ||
              subcategoryIds.some((id, index) => id !== learning.subcategoryIds[index])

            setValue('learnCategoryIds', categoryIds, { shouldDirty: true })
            setValue(
              'learnSubcategoryIds',
              subcategoryIds,
              subcategoriesChanged
                ? { shouldDirty: true, shouldTouch: true, shouldValidate: true }
                : { shouldDirty: true },
            )
          }}
          categoryLabel="Категория навыка, которому хотите научиться"
          subcategoryLabel="Подкатегория навыка, которому хотите научиться"
          subcategoryError={errors.learnSubcategoryIds?.message}
        />
      </div>

      <div className={styles.containerButton}>
        <Button variant="secondary" onClick={() => onBack(getValues())}>
          Назад
        </Button>

        <Button type="submit" disabled={!isValid || isSubmitting}>
          Продолжить
        </Button>
      </div>
    </form>
  )
}
