import { useCallback, useId, useRef, useState } from 'react'

import { useClickOutside } from '@/shared/lib/hooks/useClickOutside'
import CrossIcon from '@/shared/assets/icons/cross.svg?react'
import chevronUp from '@/shared/assets/icons/chevron-up.svg'
import chevronDown from '@/shared/assets/icons/chevron-down.svg'
import { IconButton } from '@/shared/ui/IconButton'
import { Input } from '@/shared/ui/Input'
import styles from './Select.module.css'

export interface SelectProps {
  label?: string
  placeholder?: string
  options: ReadonlyArray<{ value: string | null; label: string }>
  /** Выбранное значение или null («Не указан») */
  value: string | null
  onChange: (value: string | null) => void
  /**
   * Список с поиском: в поле можно печатать, варианты фильтруются по введённому тексту, справа «×».
   * Нужен для «Город» (в макете «Са» → «Санкт-Петербург, Самара, Саратов»).
   */
  searchable?: boolean
  error?: string
  disabled?: boolean
  defaultOpen?: boolean
}

/**
 * Выпадающий список с одним выбором: «Пол» (Не указан / Мужской / Женский), «Город», «Категория», «Подкатегория».
 * @see Figma: «Регистрация 2 шаг» — открытый «Пол» (1:1585), «Город» с поиском (1:1629)
 */
export function Select({
  label,
  placeholder,
  options,
  value,
  onChange,
  searchable = false,
  error,
  disabled = false,
  defaultOpen = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [searchValue, setSearchValue] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const id = useId()
  const listboxId = `${id}-listbox`
  const labelId = `${id}-label`
  const errorId = `${id}-error`
  const selectedOption = options.find((option) => option.value === value)
  const selectedLabel = selectedOption?.label ?? placeholder ?? 'Не указан'
  const inputValue = isOpen
    ? searchValue
    : value !== null && selectedOption
      ? selectedOption.label
      : ''
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLocaleLowerCase().includes(searchValue.trim().toLocaleLowerCase()),
      )
    : options

  const close = useCallback(() => {
    setIsOpen(false)
    setActiveIndex(-1)
  }, [])

  useClickOutside(rootRef, close, isOpen)

  const open = (direction: 'first' | 'last' = 'first') => {
    if (options.length === 0) return
    const selectedIndex = options.findIndex((option) => option.value === value)
    setActiveIndex(
      selectedIndex >= 0 ? selectedIndex : direction === 'first' ? 0 : options.length - 1,
    )
    setIsOpen(true)
  }

  const openSearch = () => {
    if (!isOpen) {
      setSearchValue(value !== null && selectedOption ? selectedOption.label : '')
      setActiveIndex(-1)
      setIsOpen(true)
    }
  }

  const selectOption = (index: number) => {
    const option = filteredOptions[index]
    if (!option) return

    onChange(option.value)
    setSearchValue('')
    close()
    if (searchable) {
      searchInputRef.current?.focus()
    } else {
      triggerRef.current?.focus()
    }
  }

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Tab' && isOpen) {
      close()
      return
    }

    if (event.key === 'Escape' && isOpen) {
      event.preventDefault()
      close()
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen) {
        openSearch()
        return
      }

      setActiveIndex((currentIndex) => {
        if (filteredOptions.length === 0) return -1
        if (currentIndex < 0) return event.key === 'ArrowDown' ? 0 : filteredOptions.length - 1
        const nextIndex = currentIndex + (event.key === 'ArrowDown' ? 1 : -1)
        return Math.max(0, Math.min(filteredOptions.length - 1, nextIndex))
      })
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      if (!isOpen) {
        openSearch()
      } else {
        selectOption(activeIndex)
      }
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Tab' && isOpen) {
      close()
      return
    }

    if (event.key === 'Escape' && isOpen) {
      event.preventDefault()
      close()
      triggerRef.current?.focus()
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen) {
        open(event.key === 'ArrowDown' ? 'first' : 'last')
        return
      }

      setActiveIndex((currentIndex) => {
        const nextIndex = currentIndex + (event.key === 'ArrowDown' ? 1 : -1)
        return Math.max(0, Math.min(options.length - 1, nextIndex))
      })
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      if (!isOpen) {
        open()
      } else {
        selectOption(activeIndex)
      }
    }
  }

  return (
    <div
      ref={rootRef}
      className={styles.root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          close()
        }
      }}
    >
      {label && (
        <label id={labelId} htmlFor={`${id}-trigger`} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.control}>
        {searchable ? (
          <Input
            ref={searchInputRef}
            id={`${id}-trigger`}
            role="combobox"
            placeholder={placeholder ?? 'Не указан'}
            value={inputValue}
            onChange={(event) => {
              const nextSearchValue = event.target.value
              setSearchValue(nextSearchValue)
              setActiveIndex(
                options.some((option) =>
                  option.label
                    .toLocaleLowerCase()
                    .includes(nextSearchValue.trim().toLocaleLowerCase()),
                )
                  ? 0
                  : -1,
              )
              setIsOpen(true)
            }}
            onFocus={openSearch}
            onClick={() => setIsOpen(true)}
            onKeyDown={handleSearchKeyDown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={isOpen ? listboxId : undefined}
            aria-activedescendant={
              isOpen && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
            }
            aria-labelledby={label ? labelId : undefined}
            aria-label={!label ? (placeholder ?? 'Выберите значение') : undefined}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            disabled={disabled}
            rightAction={
              inputValue && (
                <IconButton
                  ariaLabel="Очистить"
                  icon={<CrossIcon />}
                  onClick={() => {
                    setSearchValue('')
                    setActiveIndex(-1)
                    setIsOpen(true)
                    onChange(null)
                    searchInputRef.current?.focus()
                  }}
                />
              )
            }
          />
        ) : (
          <button
            ref={triggerRef}
            id={`${id}-trigger`}
            type="button"
            className={[
              styles.trigger,
              isOpen ? styles.triggerOpen : '',
              selectedOption && selectedOption.value !== null ? styles.triggerSelected : '',
              error ? styles.triggerError : '',
              disabled ? styles.triggerDisabled : '',
            ]
              .filter(Boolean)
              .join(' ')}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={isOpen ? listboxId : undefined}
            aria-activedescendant={
              isOpen && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
            }
            aria-labelledby={label ? labelId : undefined}
            aria-label={!label ? (placeholder ?? 'Выберите значение') : undefined}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            disabled={disabled}
            onClick={() => (isOpen ? close() : open())}
            onKeyDown={handleKeyDown}
          >
            <span className={selectedOption ? styles.value : styles.placeholder}>
              {selectedLabel}
            </span>
            <img className={styles.chevron} src={isOpen ? chevronUp : chevronDown} alt="" />
          </button>
        )}

        {isOpen && (
          <div className={[styles.panel, error ? styles.panelError : ''].join(' ')}>
            <ul
              id={listboxId}
              className={styles.options}
              role="listbox"
              aria-labelledby={label ? labelId : undefined}
              aria-label={!label ? (placeholder ?? 'Выберите значение') : undefined}
            >
              {filteredOptions.map((option, index) => (
                <li
                  key={`${option.value ?? 'null'}-${index}`}
                  id={`${listboxId}-option-${index}`}
                  className={[styles.option, activeIndex === index ? styles.optionActive : '']
                    .filter(Boolean)
                    .join(' ')}
                  role="option"
                  aria-selected={option.value === value}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectOption(index)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
