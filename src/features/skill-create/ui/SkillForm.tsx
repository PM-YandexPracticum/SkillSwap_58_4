import { useState } from 'react'
import { useForm } from 'react-hook-form'
//  import { yupResolver } from '@hookform/resolvers/yup'
import type { SkillFormValues } from '../model/schema'
import { Input } from '@/shared/ui/Input'
import { Textarea } from '@/shared/ui/Textarea'
import { Select } from '@/shared/ui/Select'
import { Button } from '@/shared/ui/Button'
import { FileDropzone } from '@/shared/ui/FileDropzone'
import { useAppSelector } from '@/shared/lib/store'
import { selectCategories } from '@/entities/category'
import { validateImageFile } from '@/shared/lib/validation'
import { fileToDataUrl } from '@/shared/lib/image'
import styles from './SkillForm.module.css'

export interface SkillFormProps {
  defaultValues?: Partial<SkillFormValues>
  onSubmit: (values: SkillFormValues, images: string[]) => void
  onBack: () => void
}

export function SkillForm({ defaultValues, onSubmit, onBack }: SkillFormProps) {
  const categories = useAppSelector(selectCategories)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SkillFormValues>({
    // resolver: yupResolver(skillSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      categoryId: '',
      subcategoryId: '',
      description: '',
      ...defaultValues,
    },
  })

  const [images, setImages] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [imageError, setImageError] = useState<string>()

  const categoryId = watch('categoryId')
  const subcategoryId = watch('subcategoryId')

  const currentCategory = categories.find((c) => c.id === categoryId)
  const subcategoryOptions = currentCategory
    ? currentCategory.subcategories.map((sub) => ({ value: sub.id, label: sub.title }))
    : []

  const isFull = images.length >= 4
  const previews = images.map((url, index) => ({
    url,
    onRemove: () => setImages((current) => current.filter((_, i) => i !== index)),
  }))

  const addImages = async (files: File[]) => {
    const availableFiles = files.slice(0, 4 - images.length)
    if (isProcessing || availableFiles.length === 0) return

    setIsProcessing(true)
    setImageError(undefined)
    try {
      const validFiles: File[] = []
      for (const file of availableFiles) {
        const error = validateImageFile(file)
        if (error) {
          setImageError(error)
          return
        }
        validFiles.push(file)
      }

      const urls = await Promise.all(validFiles.map(fileToDataUrl))
      setImages((current) => [...new Set([...current, ...urls])].slice(0, 4))
    } catch {
      setImageError('Ошибка обработки изображений')
    } finally {
      setIsProcessing(false)
    }
  }

  const onFormSubmit = (values: SkillFormValues) => {
    if (isProcessing) return
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

        <Select
          label="Категория навыка"
          options={categories.map((c) => ({ value: c.id, label: c.title }))}
          value={categoryId}
          onChange={(value) => {
            setValue('categoryId', value || '', { shouldValidate: true })
            setValue('subcategoryId', '', { shouldValidate: false })
          }}
          error={errors.categoryId?.message}
        />

        <Select
          label="Подкатегория навыка"
          options={subcategoryOptions}
          value={subcategoryId}
          onChange={(value) => setValue('subcategoryId', value || '', { shouldValidate: true })}
          disabled={!categoryId}
          error={errors.subcategoryId?.message}
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
