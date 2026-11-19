import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { CategorySubcategorySelect, findSubcategories, selectCategories } from '@/entities/category'
import { DATA_ERRORS, VALIDATION } from '@/shared/config'
import { fileToDataUrl } from '@/shared/lib/image'
import { useAppSelector } from '@/shared/lib/store'
import { validateImageFile } from '@/shared/lib/validation'
import { Button } from '@/shared/ui/Button'
import { FileDropzone } from '@/shared/ui/FileDropzone'
import { Input } from '@/shared/ui/Input'
import { Textarea } from '@/shared/ui/Textarea'

import { skillSchema, type SkillFormValues } from '../model/schema'
import styles from './SkillForm.module.css'

const IMAGE_COUNT_ERROR = 'Добавьте от 1 до 4 фото'

export interface SkillFormProps {
  defaultValues?: Partial<SkillFormValues>
  /** Фото навыка для восстановления данных шага из черновика регистрации. */
  defaultImages?: readonly string[]
  /** Фото навыка передаются как data URL в порядке выбора. */
  onSubmit: (values: SkillFormValues, images: string[]) => void
  /** Возвращает пользователя на шаг 2. */
  onBack: () => void
}

/**
 * Форма навыка, которому пользователь может научить: один навык со своим названием,
 * связанной категорией и подкатегорией, описанием и 1–4 фото.
 * Справочник категорий читает из store; связь списков переиспользует сущность категории.
 * Значения проверяются `skillSchema`, файлы — `validateImageFile` до `fileToDataUrl`.
 * Пока фото читаются и сжимаются, повторный выбор и отправка формы недоступны.
 * @see Figma: «Регистрация 3 шаг» (1:1761)
 */
export function SkillForm({ defaultValues, defaultImages, onSubmit, onBack }: SkillFormProps) {
  const categories = useAppSelector(selectCategories)
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SkillFormValues>({
    resolver: yupResolver(skillSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      categoryId: '',
      subcategoryId: '',
      description: '',
      ...defaultValues,
    },
  })

  const [images, setImages] = useState<string[]>(() => [...(defaultImages ?? [])])
  const [isProcessing, setIsProcessing] = useState(false)
  const [imageError, setImageError] = useState<string>()

  const categoryId = watch('categoryId')
  const subcategoryId = watch('subcategoryId')
  const selection = {
    categoryIds: categoryId ? [categoryId] : [],
    subcategoryIds: subcategoryId ? [subcategoryId] : [],
  }
  const isFull = images.length >= VALIDATION.SKILL_IMAGES.MAX
  const previews = images.map((url, index) => ({
    url,
    onRemove: () => {
      setImages((current) => current.filter((_, imageIndex) => imageIndex !== index))
      setImageError(undefined)
    },
  }))

  const addImages = async (files: File[]) => {
    const availableFiles = files.slice(0, VALIDATION.SKILL_IMAGES.MAX - images.length)
    if (isProcessing || availableFiles.length === 0) return

    setIsProcessing(true)
    setImageError(undefined)
    try {
      const validFiles: File[] = []
      let validationError: string | undefined
      for (const file of availableFiles) {
        const error = validateImageFile(file)
        if (error) {
          validationError ??= error
          continue
        }
        validFiles.push(file)
      }

      const results = await Promise.allSettled(validFiles.map(fileToDataUrl))
      const urls = results.flatMap((result) =>
        result.status === 'fulfilled' ? [result.value] : [],
      )
      setImages((current) =>
        [...new Set([...current, ...urls])].slice(0, VALIDATION.SKILL_IMAGES.MAX),
      )
      if (validationError || results.some((result) => result.status === 'rejected')) {
        setImageError(validationError ?? DATA_ERRORS.PROCESS_IMAGES)
      }
    } catch {
      setImageError(DATA_ERRORS.PROCESS_IMAGES)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSelectionChange = (next: { categoryIds: string[]; subcategoryIds: string[] }) => {
    setValue('categoryId', next.categoryIds[0] ?? '', {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    setValue('subcategoryId', next.subcategoryIds[0] ?? '', {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    clearErrors(['categoryId', 'subcategoryId'])
  }

  const onFormSubmit = (values: SkillFormValues) => {
    if (isProcessing) return
    const selectedSubcategory = findSubcategories(categories, [values.subcategoryId])[0]
    if (selectedSubcategory?.categoryId !== values.categoryId) {
      setError('subcategoryId', { type: 'validate', message: 'Выберите подкатегорию' })
      return
    }
    if (images.length < VALIDATION.SKILL_IMAGES.MIN) {
      setImageError(IMAGE_COUNT_ERROR)
      return
    }
    onSubmit(values, images)
  }

  return (
    <form
      className={styles.form}
      aria-label="Укажите, чем вы готовы поделиться"
      noValidate
      aria-busy={isProcessing}
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <div className={styles.fields}>
        <Input
          label="Название навыка"
          placeholder="Введите название вашего навыка"
          {...register('title')}
          error={errors.title?.message}
        />

        <CategorySubcategorySelect
          mode="single"
          categories={categories}
          value={selection}
          onChange={handleSelectionChange}
          categoryLabel="Категория навыка"
          subcategoryLabel="Подкатегория навыка"
          categoryError={errors.categoryId?.message}
          subcategoryError={errors.subcategoryId?.message}
        />

        <Textarea
          label="Описание"
          placeholder="Коротко опишите, чему можете научить"
          {...register('description')}
          error={errors.description?.message}
        />

        <FileDropzone
          hint="Перетащите или выберите изображения навыка"
          buttonLabel="Выбрать изображения"
          multiple
          uploadDisabled={isFull || isProcessing}
          error={imageError}
          previews={previews.length ? previews : undefined}
          onFiles={(files) => void addImages(files)}
        />
        {isProcessing && <p role="status">Обрабатываем изображения…</p>}
      </div>
      <div className={styles.buttons}>
        <Button variant="secondary" onClick={onBack}>
          Назад
        </Button>
        <Button type="submit" disabled={isProcessing}>
          Продолжить
        </Button>
      </div>
    </form>
  )
}
