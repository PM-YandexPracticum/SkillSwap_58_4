import { useState, type FormEvent } from 'react'

import { CategorySubcategorySelect, selectCategories } from '@/entities/category'
import { DATA_ERRORS, VALIDATION } from '@/shared/config'
import { fileToDataUrl } from '@/shared/lib/image'
import { useAppSelector } from '@/shared/lib/store'
import { Button } from '@/shared/ui/Button'
import { FileDropzone } from '@/shared/ui/FileDropzone'
import { Input } from '@/shared/ui/Input'
import { Textarea } from '@/shared/ui/Textarea'

import type { SkillFormValues } from '../model/schema'
import styles from './SkillForm.module.css'

export interface SkillFormProps {
  defaultValues?: Partial<SkillFormValues>
  /** `images` — фото навыка как data URL (результат `fileToDataUrl`) в порядке выбора, не больше четырёх */
  onSubmit: (values: SkillFormValues, images: string[]) => void
  /** «Назад» на шаг 2 */
  onBack: () => void
}

interface Selection {
  categoryIds: string[]
  subcategoryIds: string[]
}

/**
 * Форма навыка, которому пользователь может научить (всегда ровно один): «Название навыка» — своё, например «Игра на барабанах»;
 * «Категория навыка» и «Подкатегория навыка» — CategorySubcategorySelect в режиме `single`; «Описание»;
 * фото — FileDropzone «Перетащите или выберите изображения навыка» (до 4, с превью и крестиком). «Назад» / «Продолжить».
 * Категории читает из store (их загружает DataProvider).
 * Выбранные файлы превращаются в data URL через `fileToDataUrl` — в таком виде фото показываются в превью и позже сохраняются.
 *
 * Сейчас это вёрстка: значения хранятся в локальном состоянии, проверок нет.
 * Пока фото читаются и сжимаются, повторный выбор и отправка формы недоступны.
 * При лимите запрещено только добавление: существующие фото можно удалить и заменить.
 * TODO(P6-05): react-hook-form + skillSchema и validateImageFile до fileToDataUrl.
 * @see Figma: «Регистрация 3 шаг» (1:1761)
 */
export function SkillForm({ defaultValues, onSubmit, onBack }: SkillFormProps) {
  const categories = useAppSelector(selectCategories)
  const [title, setTitle] = useState(defaultValues?.title ?? '')
  const [selection, setSelection] = useState<Selection>({
    categoryIds: defaultValues?.categoryId ? [defaultValues.categoryId] : [],
    subcategoryIds: defaultValues?.subcategoryId ? [defaultValues.subcategoryId] : [],
  })
  const [description, setDescription] = useState(defaultValues?.description ?? '')
  const [images, setImages] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [imageError, setImageError] = useState<string>()

  const isFull = images.length >= VALIDATION.SKILL_IMAGES.MAX
  const previews = images.map((url, index) => ({
    url,
    onRemove: () => setImages((current) => current.filter((_, i) => i !== index)),
  }))

  const addImages = async (files: File[]) => {
    const availableFiles = files.slice(0, VALIDATION.SKILL_IMAGES.MAX - images.length)
    if (isProcessing || availableFiles.length === 0) return

    setIsProcessing(true)
    setImageError(undefined)
    try {
      const results = await Promise.allSettled(availableFiles.map(fileToDataUrl))
      const urls = results.flatMap((result) =>
        result.status === 'fulfilled' ? [result.value] : [],
      )
      setImages((current) =>
        [...new Set([...current, ...urls])].slice(0, VALIDATION.SKILL_IMAGES.MAX),
      )
      if (results.some((result) => result.status === 'rejected')) {
        setImageError(DATA_ERRORS.PROCESS_IMAGES)
      }
    } catch {
      setImageError(DATA_ERRORS.PROCESS_IMAGES)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isProcessing) return
    onSubmit(
      {
        title,
        categoryId: selection.categoryIds[0] ?? '',
        subcategoryId: selection.subcategoryIds[0] ?? '',
        description,
      },
      images,
    )
  }

  return (
    <form
      className={styles.form}
      aria-label="Укажите, чем вы готовы поделиться"
      noValidate
      aria-busy={isProcessing}
      onSubmit={handleSubmit}
    >
      <div className={styles.fields}>
        <Input
          label="Название навыка"
          name="title"
          placeholder="Введите название вашего навыка"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <CategorySubcategorySelect
          mode="single"
          categories={categories}
          value={selection}
          onChange={setSelection}
          categoryLabel="Категория навыка"
          subcategoryLabel="Подкатегория навыка"
        />
        <Textarea
          label="Описание"
          name="description"
          placeholder="Коротко опишите, чему можете научить"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
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
