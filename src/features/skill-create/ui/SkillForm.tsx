import { useState, type FormEvent } from 'react'

import { CategorySubcategorySelect, selectCategories } from '@/entities/category'
import { VALIDATION } from '@/shared/config'
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
 * TODO(P6-05): react-hook-form + skillSchema, validateImageFile до fileToDataUrl и вывод ошибки фото, связь категорий (P6-03).
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

  const isFull = images.length >= VALIDATION.SKILL_IMAGES.MAX
  const previews = images.map((url, index) => ({
    url,
    onRemove: () => setImages((current) => current.filter((_, i) => i !== index)),
  }))

  const addImages = async (files: File[]) => {
    // Файлы, которые не удалось прочитать, пропускаем: проверку и ошибку добавит P6-05
    const results = await Promise.allSettled(files.map(fileToDataUrl))
    const urls = results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []))
    setImages((current) => [...new Set([...current, ...urls])].slice(0, VALIDATION.SKILL_IMAGES.MAX))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
          placeholder="Коротко опишите, чем можете научить"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <FileDropzone
          hint="Перетащите или выберите изображения навыка"
          buttonLabel="Выбрать изображения"
          multiple
          disabled={isFull}
          previews={previews.length ? previews : undefined}
          onFiles={(files) => void addImages(files)}
        />
      </div>
      <div className={styles.buttons}>
        <Button variant="secondary" onClick={onBack}>
          Назад
        </Button>
        <Button type="submit">Продолжить</Button>
      </div>
    </form>
  )
}
