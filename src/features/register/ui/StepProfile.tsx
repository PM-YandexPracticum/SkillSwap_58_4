
import { useState, type ReactNode } from 'react'

import { CategorySubcategorySelect } from '@/entities/category'
import { selectCities } from '@/entities/city'
import { Button } from '@/shared/ui/Button'
import { DatePicker } from '@/shared/ui/DatePicker'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { useAppSelector } from '@/shared/lib/store'

import styles from './SteapProfile.module.css'

export interface StepProfileProps {
  onNext: () => void
  onBack: () => void
  avatarUpload: ReactNode
}

/**
 * Шаг 2 «Расскажите немного о себе».
 * Аватар, имя, дата рождения и пол, город, категория и подкатегория навыка.
 * Категории отображаются в режиме `multiple` со списками и чекбоксами.
 * Кнопки «Назад» и «Продолжить».
 *
 * Поле «О себе» находится только в профиле.
 */
export function StepProfile(props: StepProfileProps) {
  // TODO: подключить react-hook-form и profileSchema; данные сохранять через draftUpdated.
  const [birthDate, setBirthDate] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [gender, setGender] = useState<string | null>(null)
  const [cityId, setCityId] = useState<string | null>(null)

  const cities = useAppSelector(selectCities)

  const cityOptions = cities.map((city) => ({
    value: city.id,
    label: city.name,
  }))

  return (
    <form action="#" className={styles.form}>
      {props.avatarUpload}

      <div className={styles.containerInput}>
        <Input label="Имя" name="name" type="text" placeholder="Введите ваше имя" />

        <div className={styles.row}>
          <DatePicker
            label="Дата рождения"
            value={birthDate}
            name="date"
            onChange={setBirthDate}
            placeholder="дд.мм.гггг"
          />

          <Select
            label="Пол"
            placeholder="Не указан"
            options={[
              { value: null, label: 'Не указан' },
              { value: 'male', label: 'Мужской' },
              { value: 'female', label: 'Женский' },
            ]}
            value={gender}
            onChange={setGender}
          />
        </div>

        <Select
          label="Город"
          placeholder="Выберите город"
          options={cityOptions}
          value={cityId}
          onChange={setCityId}
          searchable
        />

        <CategorySubcategorySelect
          mode="multiple"
          value={{
            categoryIds: selectedCategories,
            subcategoryIds: selectedSubcategories,
          }}
          onChange={(value) => {
            setSelectedCategories(value.categoryIds)
            setSelectedSubcategories(value.subcategoryIds)
          }}
          categoryLabel="Категория навыка, которому хотите научиться"
          subcategoryLabel="Подкатегория навыка, которому хотите научиться"
        />
      </div>

      <div className={styles.containerButton}>
        <Button variant="secondary" onClick={props.onBack}>
          Назад
        </Button>

        <Button type="submit" onClick={props.onNext}>
          Продолжить
        </Button>
      </div>
    </form>
  )
}
