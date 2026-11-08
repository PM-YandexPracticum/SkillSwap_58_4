import { useRef, useState, type FormEvent } from 'react'

import CrossIcon from '@/shared/assets/icons/cross.svg?react'
import SearchIcon from '@/shared/assets/icons/search.svg?react'
import { useAppDispatch, useAppSelector } from '@/shared/lib/store'
import { IconButton } from '@/shared/ui/IconButton'
import { Input } from '@/shared/ui/Input'
import { queryApplied, queryCleared, selectSearchQuery } from '../model/searchSlice'
import styles from './SearchInput.module.css'

export interface SearchInputProps {
  /** Начальный текст в поле */
  defaultValue?: string
  /** Поиск запущен — по Enter или клику на лупу. Получает текст без пробелов по краям */
  onSearch?: (query: string) => void
  /** Поле очищено крестиком */
  onClear?: () => void
  className?: string
}

/**
 * Поле «Искать навык» в шапке с иконкой лупы слева (как в макете).
 * Поиск запускается по Enter или по клику на лупу — лупа работает как кнопка (подпись для скринридера «Искать»).
 * Когда в поле есть текст — справа крестик «×»: очищает поле и сбрасывает поиск, каталог возвращается к секциям.
 * Применённый запрос пишется в `searchSlice`; набираемый текст живёт в самом поле.
 * Пропсы `onSearch` / `onClear` остаются как дополнительный колбэк наружу (используются в сторизах и тестах).
 * @see Figma: «Каталог - поиск активный» (1:2819), поле в шапке — «Search» (1:2861, 1:2996)
 */
export function SearchInput({ defaultValue, onSearch, onClear, className }: SearchInputProps) {
  const dispatch = useAppDispatch()
  const appliedQuery = useAppSelector(selectSearchQuery)

  // Приоритет начального значения: явный defaultValue - текущий применённый запрос из store - пусто.
  // Набираемый текст после монтирования живёт только в локальном state - в store попадает лишь применённый запрос.
  const [value, setValue] = useState(defaultValue ?? appliedQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  const search = () => {
    const query = value.trim()
    dispatch(queryApplied(query))
    onSearch?.(query)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    search()
  }

  const handleClear = () => {
    setValue('')
    dispatch(queryCleared())
    onClear?.()
    inputRef.current?.focus()
  }

  return (
    <form
      role="search"
      className={[styles.root, className].filter(Boolean).join(' ')}
      onSubmit={handleSubmit}
    >
      <span className={styles.search}>
        <IconButton
          ariaLabel="Искать"
          icon={<SearchIcon className={styles.icon} />}
          onClick={search}
        />
      </span>
      <Input
        ref={inputRef}
        className={styles.input}
        value={value}
        placeholder="Искать навык"
        aria-label="Искать навык"
        autoComplete="off"
        onChange={(event) => setValue(event.target.value)}
        rightAction={
          value ? (
            <IconButton
              ariaLabel="Очистить поиск"
              icon={<CrossIcon className={styles.icon} />}
              onClick={handleClear}
            />
          ) : undefined
        }
      />
    </form>
  )
}
